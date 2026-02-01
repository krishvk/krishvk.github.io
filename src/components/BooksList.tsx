import React, { useState, useEffect } from 'react';
import styles from './BooksList.module.css';

interface Book {
  title: string;
  authors: string;
  narrators: string;
  category: string;
  length: string;
  releaseDate: string;
  cover: string;
  url: string;
  progress: string;
}

interface BooksListProps {
  filter?: 'all' | 'finished' | 'to-read';
  showStats?: boolean;
  showSections?: boolean;
}

export default function BooksList({ filter = 'all', showStats = true, showSections = false }: BooksListProps): React.ReactElement {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'tile'>('tile');
  const [totalHours, setTotalHours] = useState(0);

  // Parse length string like "5h 19m" or "8h 7m" to total minutes
  const parseLength = (length: string): number => {
    if (!length) return 0;
    const hoursMatch = length.match(/(\d+)h/);
    const minutesMatch = length.match(/(\d+)m/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    return hours * 60 + minutes;
  };

  // Group books by progress status
  const finishedBooks = books.filter(book => book.progress.trim() === 'Finished');
  const unreadBooks = books.filter(book => book.progress.trim() !== 'Finished');

  // Filter books based on prop
  const getFilteredBooks = (): Book[] => {
    if (filter === 'finished') {
      return finishedBooks;
    } else if (filter === 'to-read') {
      return unreadBooks;
    }
    return books;
  };

  const displayedBooks = getFilteredBooks();

  // Calculate stats for displayed books
  const displayedTotalHours = displayedBooks.reduce((sum, book) => {
    return sum + parseLength(book.length);
  }, 0) / 60;

  useEffect(() => {
    fetch('/books-library.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load books library');
        }
        return response.text();
      })
      .then(csvText => {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          throw new Error('Invalid CSV format');
        }

        // Simple CSV parser that handles quoted fields
        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
              if (inQuotes && nextChar === '"') {
                current += '"';
                i++; // Skip next quote
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const headers = parseCSVLine(lines[0]);
        const parsedBooks: Book[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);

          if (values.length >= headers.length) {
            const titleIndex = headers.indexOf('Title');
            const authorsIndex = headers.indexOf('Authors');
            const narratorsIndex = headers.indexOf('Narrators');
            const categoryIndex = headers.indexOf('Parent Category');
            const lengthIndex = headers.indexOf('Length');
            const releaseDateIndex = headers.indexOf('Release Date');
            const coverIndex = headers.indexOf('Cover');
            const urlIndex = headers.indexOf('Store Page Url');
            const progressIndex = headers.indexOf('Progress');

            if (titleIndex !== -1 && values[titleIndex]) {
              parsedBooks.push({
                title: values[titleIndex] || '',
                authors: authorsIndex !== -1 ? values[authorsIndex] || '' : '',
                narrators: narratorsIndex !== -1 ? values[narratorsIndex] || '' : '',
                category: categoryIndex !== -1 ? values[categoryIndex] || '' : '',
                length: lengthIndex !== -1 ? values[lengthIndex] || '' : '',
                releaseDate: releaseDateIndex !== -1 ? values[releaseDateIndex] || '' : '',
                cover: coverIndex !== -1 ? values[coverIndex] || '' : '',
                url: urlIndex !== -1 ? values[urlIndex] || '' : '',
                progress: progressIndex !== -1 ? values[progressIndex] || '' : '',
              });
            }
          }
        }

        setBooks(parsedBooks);

        // Calculate total listening hours
        const totalMinutes = parsedBooks.reduce((sum, book) => {
          return sum + parseLength(book.length);
        }, 0);
        setTotalHours(Math.round((totalMinutes / 60) * 10) / 10); // Round to 1 decimal place

        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading books...</div>;
  }

  if (error) {
    return <div>Error loading books: {error}</div>;
  }

  // Render books (without section wrapper)
  const renderBooks = (booksToRender: Book[]) => {
    if (booksToRender.length === 0) {
      return <div>No books found.</div>;
    }

    return viewMode === 'tile' ? (
      <div className={styles.tileView}>
        {booksToRender.map((book, index) => (
          <a
            key={index}
            href={book.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bookTileLink}
            onClick={(e) => {
              if (!book.url) {
                e.preventDefault();
              }
            }}
          >
            <div className={styles.bookTile}>
              {book.cover && (
                <img
                  src={book.cover}
                  alt={book.title}
                  className={styles.bookCover}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className={styles.bookTileContent}>
                <strong className={styles.bookTitle}>{book.title}</strong>
                {book.authors && (
                  <div className={styles.bookMeta}>
                    <strong>Author:</strong> {book.authors}
                  </div>
                )}
                {book.length && (
                  <div className={styles.bookMeta}>
                    <strong>Length:</strong> {book.length}
                  </div>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    ) : (
      <div className={styles.listView}>
        {booksToRender.map((book, index) => (
          <a
            key={index}
            href={book.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bookListLink}
            onClick={(e) => {
              if (!book.url) {
                e.preventDefault();
              }
            }}
          >
            <div className={styles.bookListItem}>
              <div className={styles.bookListContent}>
                {book.cover && (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className={styles.bookListCover}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className={styles.bookListDetails}>
                  <strong className={styles.bookTitle}>{book.title}</strong>
                  {book.authors && (
                    <div className={styles.bookMeta}>
                      <strong>Author:</strong> {book.authors}
                    </div>
                  )}
                  {book.length && (
                    <div className={styles.bookMeta}>
                      <strong>Length:</strong> {book.length}
                    </div>
                  )}
                  {book.releaseDate && (
                    <div className={styles.bookMeta}>
                      <strong>Release Date:</strong> {book.releaseDate}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  };

  // Render book section
  const renderBookSection = (sectionBooks: Book[], sectionTitle: string) => {
    if (sectionBooks.length === 0) return null;

    return (
      <div className={styles.bookSection}>
        <h2 className={styles.sectionTitle}>
          {sectionTitle} <span className={styles.sectionCount}>({sectionBooks.length})</span>
        </h2>
        {renderBooks(sectionBooks)}
      </div>
    );
  };

  return (
    <div className={styles.booksContainer}>
      {showStats && (
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <strong>{displayedBooks.length}</strong> {displayedBooks.length === 1 ? 'Book' : 'Books'}
          </div>
          {filter === 'all' && (
            <>
              <div className={styles.statItem}>
                <strong>{finishedBooks.length}</strong> Finished
              </div>
              <div className={styles.statItem}>
                <strong>{unreadBooks.length}</strong> Unread
              </div>
            </>
          )}
          <div className={styles.statItem}>
            <strong>{displayedTotalHours.toFixed(1)}</strong> Total Listening Hours
          </div>
        </div>
      )}

      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleButton} ${viewMode === 'tile' ? styles.active : ''}`}
          onClick={() => setViewMode('tile')}
          title="Tile view"
        >
          ⬜ Tile
        </button>
        <button
          className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`}
          onClick={() => setViewMode('list')}
          title="List view"
        >
          ☰ List
        </button>
      </div>

      {showSections ? (
        <>
          {renderBookSection(finishedBooks, 'Finished')}
          {renderBookSection(unreadBooks, 'Unread')}
        </>
      ) : (
        renderBooks(displayedBooks)
      )}
    </div>
  );
}
