import Link from 'next/link'
import styles from './Pagination.module.css'

interface PaginationProps {
  totalPages: number
  currentPage: number
  basePath: string
}

function Pagination({ totalPages, currentPage, basePath }: PaginationProps) {
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <nav className={styles.paginationSplit} aria-label="Pagination">
      <ol className={styles.paginationList}>
        <li>
          {prevPage ? (
            <Link
              href={
                currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`
              }
              className={styles.paginationItem}
              aria-label="Go to previous page"
            >
              <svg className={`${styles.icon} ${styles.prevIcon}`} viewBox="0 0 16 16">
                <polyline
                  points="6 2 12 8 6 14"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>Anterior</span>
            </Link>
          ) : (
            <span
              className={`${styles.paginationItem} ${styles.disabled}`}
              aria-label="Go to previous page"
            >
              <svg className={`${styles.icon} ${styles.prevIcon}`} viewBox="0 0 16 16">
                <polyline
                  points="6 2 12 8 6 14"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>Anterior</span>
            </span>
          )}
        </li>

        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <li key={pageNumber} className="hidden md:inline-flex">
                <Link
                  href={pageNumber === 1 ? `/${basePath}/` : `/${basePath}/page/${pageNumber}`}
                  className={`${styles.paginationItem} ${pageNumber === currentPage ? styles.selected : ''}`}
                  aria-label={`${pageNumber === currentPage ? 'Current Page, page ' : 'Go to page '}${pageNumber}`}
                  aria-current={pageNumber === currentPage ? 'page' : undefined}
                >
                  {pageNumber}
                </Link>
              </li>
            )
          } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
            return (
              <li key={pageNumber} className="hidden md:inline-flex" aria-hidden="true">
                <span className={`${styles.paginationItem} ${styles.ellipsis}`}>...</span>
              </li>
            )
          }
          return null
        })}

        <li>
          {nextPage ? (
            <Link
              href={`/${basePath}/page/${currentPage + 1}`}
              className={styles.paginationItem}
              aria-label="Go to next page"
            >
              <span>Siguiente</span>
              <svg className={`${styles.icon} ${styles.nextIcon}`} viewBox="0 0 16 16">
                <polyline
                  points="6 2 12 8 6 14"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </Link>
          ) : (
            <span
              className={`${styles.paginationItem} ${styles.disabled}`}
              aria-label="Go to next page"
            >
              <span>Siguiente</span>
              <svg className={`${styles.icon} ${styles.nextIcon}`} viewBox="0 0 16 16">
                <polyline
                  points="6 2 12 8 6 14"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
          )}
        </li>
      </ol>
    </nav>
  )
}

export default Pagination
