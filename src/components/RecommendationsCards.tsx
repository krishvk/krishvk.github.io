import React, {useEffect, useRef, useState} from 'react';
import styles from './RecommendationsCards.module.css';
import {recommendations} from '../data/recommendations';

export default function RecommendationsCards(): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const AUTO_ADVANCE_DURATION = 5000; // 5 seconds
  const PROGRESS_UPDATE_INTERVAL = 50; // Update every 50ms for smooth animation

  // Auto-advance to next card every 5 seconds when not paused
  useEffect(() => {
    if (isPaused) {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
        autoAdvanceTimeoutRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    // Reset progress and start time
    setProgress(0);
    startTimeRef.current = Date.now();

    // Update progress smoothly
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / AUTO_ADVANCE_DURATION) * 100, 100);
      setProgress(newProgress);
    }, PROGRESS_UPDATE_INTERVAL);

    autoAdvanceTimeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % recommendations.length);
      setProgress(0);
    }, AUTO_ADVANCE_DURATION);

    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [activeIndex, isPaused]);

  const goToIndex = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    // Resume auto-advance after 3 seconds
    setTimeout(() => setIsPaused(false), 3000);
  };

  const goToPrevious = () => {
    goToIndex((activeIndex - 1 + recommendations.length) % recommendations.length);
  };

  const goToNext = () => {
    goToIndex((activeIndex + 1) % recommendations.length);
  };

  // Calculate which cards to show (previous, active, next)
  const getVisibleCards = () => {
    const prevIndex = (activeIndex - 1 + recommendations.length) % recommendations.length;
    const nextIndex = (activeIndex + 1) % recommendations.length;
    return [
      { index: prevIndex, position: 'prev' as const },
      { index: activeIndex, position: 'active' as const },
      { index: nextIndex, position: 'next' as const }
    ];
  };

  return (
    <div className={styles.container}>
      <div className={styles.carouselWrapper}>
        {/* Previous Button */}
        <button
          className={styles.navButton}
          onClick={goToPrevious}
          aria-label="Previous recommendation"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Cards Container */}
        <div className={styles.cardsContainer}>
          {getVisibleCards().map(({ index, position }) => {
            const rec = recommendations[index];
            return (
              <div
                key={`${index}-${position}`}
                className={`${styles.card} ${styles[`card${position.charAt(0).toUpperCase() + position.slice(1)}`]}`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => position !== 'active' && goToIndex(index)}
                style={{ cursor: position !== 'active' ? 'pointer' : 'default' }}
              >
                <div className={styles.quoteIcon}>"</div>
                <p className={styles.text}>
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

        {/* Next Button */}
        <button
          className={styles.navButton}
          onClick={goToNext}
          aria-label="Next recommendation"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className={styles.indicators}>
        {recommendations.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === activeIndex ? styles.active : ''
            }`}
            onClick={() => goToIndex(index)}
            aria-label={`Go to recommendation ${index + 1}`}
          >
            {index === activeIndex && !isPaused && (
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
