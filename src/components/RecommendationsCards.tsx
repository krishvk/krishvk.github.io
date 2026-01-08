import React, {useEffect, useRef, useState} from 'react';
import styles from './RecommendationsCards.module.css';
import {recommendations} from '../data/recommendations';

export default function RecommendationsCards(): React.ReactElement {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollSpeed = 0.5; // pixels per frame

  // Update active index based on scroll position
  // Use modulo to map duplicated indices back to original recommendations
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateActiveIndex = () => {
      if (container.children.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      // Only check the first set of recommendations to avoid confusion
      Array.from(container.children)
        .slice(0, recommendations.length)
        .forEach((child, index) => {
          const cardRect = child.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(cardCenter - containerCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

      setActiveIndex(closestIndex);
    };

    container.addEventListener('scroll', updateActiveIndex);
    updateActiveIndex();

    return () => {
      container.removeEventListener('scroll', updateActiveIndex);
    };
  }, []);

  // Auto-scroll effect with seamless infinite scrolling
  // Uses content duplication and smart reset to avoid visible jumps
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    // Use ref-like object to allow reset from handlers
    let lastTimestampRef = { value: 0 };
    let isUserInteracting = false;
    let userInteractionTimeout: NodeJS.Timeout;
    let lastScrollLeft = 0;
    // Flag to prevent scroll events during reset
    let isResetting = false;
    // Track if we're currently auto-scrolling to distinguish from user scrolls
    let isAutoScrolling = false;

    // Calculate width of one complete set of recommendations
    const getSingleSetWidth = (): number => {
      if (container.children.length < recommendations.length) return 0;
      const firstCard = container.children[0] as HTMLElement;
      const lastCardOfFirstSet =
        container.children[recommendations.length - 1] as HTMLElement;
      if (!firstCard || !lastCardOfFirstSet) return 0;

      const firstCardLeft = firstCard.offsetLeft;
      const lastCardRight =
        lastCardOfFirstSet.offsetLeft + lastCardOfFirstSet.offsetWidth;
      const gap =
        parseFloat(window.getComputedStyle(container).gap || '32');
      return lastCardRight - firstCardLeft + gap;
    };

    // Detect user interaction (mouse wheel, touch, etc.)
    // Since scrollbar is hidden, we only need to detect wheel/touch events
    const handleUserInteraction = () => {
      // Ignore scroll events during reset or auto-scroll to prevent false
      // user interaction detection
      if (isResetting || isAutoScrolling) {
        lastScrollLeft = container.scrollLeft;
        return;
      }

      const currentScroll = container.scrollLeft;
      const scrollDelta = Math.abs(currentScroll - lastScrollLeft);

      // Only detect user interaction if the scroll change is significant
      // and in a direction that suggests user input (not our auto-scroll)
      // Auto-scroll always moves forward, so backward or large jumps indicate
      // user input
      const singleSetWidth = getSingleSetWidth();
      const isBackwardScroll = currentScroll < lastScrollLeft;
      // More than 10% of set width
      const isLargeJump =
        singleSetWidth > 0 && scrollDelta > singleSetWidth * 0.1;

      if ((isBackwardScroll || isLargeJump) && scrollDelta > 5) {
        isUserInteracting = true;
        setIsPaused(true);
        // Reset timestamp to prevent timing issues
        lastTimestampRef.value = 0;
        clearTimeout(userInteractionTimeout);
        userInteractionTimeout = setTimeout(() => {
          isUserInteracting = false;
          setIsPaused(false);
          // Reset timestamp when resuming
          lastTimestampRef.value = 0;
        }, 2000);
      }

      lastScrollLeft = currentScroll;
    };

    // Also detect wheel events directly for better responsiveness
    // Text elements stop propagation, so this only fires for container-level
    // wheel events
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;

      // Only pause if the target is the container or a direct child (not text)
      // Text elements stop propagation, so if we get here, it's a container scroll
      if (target !== container && !container.contains(target)) {
        return;
      }

      // If target is a text element, it shouldn't have propagated here
      // but check anyway as a safety measure
      if (target.classList.contains(styles.text)) {
        return;
      }

      // Container-level wheel event - pause auto-scroll
      isUserInteracting = true;
      setIsPaused(true);
      // Reset timestamp to prevent timing issues
      lastTimestampRef.value = 0;
      clearTimeout(userInteractionTimeout);
      userInteractionTimeout = setTimeout(() => {
        isUserInteracting = false;
        setIsPaused(false);
        // Reset timestamp when resuming to avoid large deltaTime on first frame
        lastTimestampRef.value = 0;
      }, 2000);
    };

    // Listen for scroll events (wheel, touch, etc.)
    // Only detect scroll changes on the container itself
    container.addEventListener(
      'scroll',
      handleUserInteraction,
      { passive: true }
    );
    // Use capture phase to catch events before they bubble
    container.addEventListener('wheel', handleWheel as EventListener, {
      passive: true,
      capture: false
    });

    const autoScroll = (timestamp: number) => {
      // Reset timestamp when resuming from pause to avoid large deltaTime jumps
      if (!lastTimestampRef.value || isPaused || isUserInteracting) {
        lastTimestampRef.value = timestamp;
        animationFrameId = requestAnimationFrame(autoScroll);
        return;
      }

      const deltaTime = timestamp - lastTimestampRef.value;
      lastTimestampRef.value = timestamp;

      // Don't auto-scroll if paused or user is interacting
      if (isPaused || isUserInteracting) {
        animationFrameId = requestAnimationFrame(autoScroll);
        return;
      }

      if (container) {
        const singleSetWidth = getSingleSetWidth();
        if (singleSetWidth > 0) {
          isAutoScrolling = true;
          const scrollIncrement = scrollSpeed * (deltaTime / 16);
          let currentScroll = container.scrollLeft;
          let newScrollLeft = currentScroll + scrollIncrement;

          // When we reach or exceed the end of the first set, reset seamlessly
          // Reset exactly at the boundary to ensure perfect alignment with
          // duplicate content
          if (newScrollLeft >= singleSetWidth) {
            // Calculate how far past the boundary we are
            const overflow = newScrollLeft - singleSetWidth;
            // Set flag to prevent scroll event from triggering user interaction
            // detection
            isResetting = true;
            // Reset to the beginning plus the overflow amount
            // This ensures the reset is seamless - we jump back but maintain
            // visual continuity
            container.scrollLeft = overflow;
            lastScrollLeft = overflow;
            // Clear flag after a microtask to allow scroll event to process
            Promise.resolve().then(() => {
              isResetting = false;
              isAutoScrolling = false;
            });
          } else {
            container.scrollLeft = newScrollLeft;
            lastScrollLeft = newScrollLeft;
            // Clear auto-scrolling flag after scroll completes
            // Use requestAnimationFrame to ensure scroll event has fired
            requestAnimationFrame(() => {
              isAutoScrolling = false;
            });
          }
        }
      }

      animationFrameId = requestAnimationFrame(autoScroll);
    };

    // Initialize
    lastScrollLeft = container.scrollLeft;
    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      container.removeEventListener('scroll', handleUserInteraction);
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(userInteractionTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused, scrollSpeed]);

  const handleDotClick = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container || container.children.length === 0) return;

    // Always use the first set of cards for navigation
    const targetCard = container.children[index] as HTMLElement;
    if (!targetCard) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = targetCard.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;
    const targetPosition =
      scrollLeft +
      cardRect.left -
      containerRect.left -
      (containerRect.width - cardRect.width) / 2;

    container.scrollTo({
      left: targetPosition,
      behavior: 'smooth'
    });
    setActiveIndex(index);
    setIsPaused(true);
    // Resume auto-scroll after a delay
    // The timestamp will be reset when auto-scroll resumes
    setTimeout(() => setIsPaused(false), 2000);
  };

  // Duplicate recommendations for seamless infinite scroll
  // This mimics Android's RecyclerView approach by having enough content
  // to scroll continuously without visible resets
  const duplicatedRecommendations = [
    ...recommendations,
    ...recommendations
  ];

  return (
    <div className={styles.container}>
      <div
        ref={scrollContainerRef}
        className={styles.scrollContainer}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsPaused(false), 2000);
        }}
      >
        {duplicatedRecommendations.map((rec, index) => {
          // Use modulo to get the original index for key stability
          const originalIndex = index % recommendations.length;
          return (
            <div
              key={`${originalIndex}-${index}`}
              className={styles.card}
            >
              <div className={styles.quoteIcon}>"</div>
              <p
                className={styles.text}
                onWheel={(e) => {
                  // Stop wheel events from bubbling to container when scrolling text
                  // Only allow propagation if text is at boundary and scroll would
                  // affect container
                  const textElement = e.currentTarget;
                  const isScrollable =
                    textElement.scrollHeight > textElement.clientHeight;

                  if (isScrollable) {
                    const isAtTop = textElement.scrollTop <= 1;
                    const isAtBottom =
                      textElement.scrollTop >=
                      textElement.scrollHeight - textElement.clientHeight - 1;

                    // If primarily vertical scroll and not at boundary, stop it
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                      if (!isAtTop && !isAtBottom) {
                        e.stopPropagation();
                      } else if (
                        (isAtTop && e.deltaY > 0) ||
                        (isAtBottom && e.deltaY < 0)
                      ) {
                        // Scrolling within text bounds, stop propagation
                        e.stopPropagation();
                      }
                    }
                  }
                }}
              >
                {rec.text.split('\n\n').map((paragraph, pIndex, array) => (
                  <React.Fragment key={pIndex}>
                    {paragraph.trim()}
                    {pIndex < array.length - 1 && <><br /><br /></>}
                  </React.Fragment>
                ))}
              </p>
              <div className={styles.author}>— {rec.author}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.indicators}>
        {recommendations.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === activeIndex ? styles.active : ''
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to recommendation ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
