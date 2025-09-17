import React from 'react'
import styles from './Rating.module.css'

interface RatingProps {
  value: number
  readonly?: boolean
}

const Rating: React.FC<RatingProps> = ({ value, readonly = true }) => {
  const totalStars = 5
  const fullStars = Math.floor(value)
  const hasHalfStar = value % 1 !== 0

  const renderStar = (index: number) => {
    const isFull = index < fullStars
    const isHalf = !isFull && hasHalfStar && index === fullStars

    return (
      <span
        key={index}
        className={`${styles.star} ${isFull ? styles.full : ''} ${isHalf ? styles.half : ''}`}
        role={readonly ? 'presentation' : 'radio'}
        aria-checked={isFull || isHalf}
        tabIndex={readonly ? -1 : 0}
      >
        <svg
          className={styles.emptyStar}
          width="16"
          height="15"
          viewBox="0 0 16 15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.50526 13.6081L3.86977 16L4.75526 10.9338L1 7.34629L6.18226 6.60917L8.5 2L10.8177 6.60917L16 7.34629L12.2447 10.9338L13.1302 16L8.50526 13.6081Z"
            stroke="#EC9759"
            fill="#F1F1F2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className={styles.filledStar}
          width="16"
          height="15"
          viewBox="0 0 16 15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.50526 13.6081L3.86977 16L4.75526 10.9338L1 7.34629L6.18226 6.60917L8.5 2L10.8177 6.60917L16 7.34629L12.2447 10.9338L13.1302 16L8.50526 13.6081Z"
            fill="#EC9759"
            stroke="#EC9759"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }

  return (
    <div className={styles.ratingContainer}>
      <div
        className={styles.stars}
        role={readonly ? 'img' : 'radiogroup'}
        aria-label={`Rating: ${value} out of ${totalStars} stars`}
      >
        <span className={styles.ratingText}>{value.toFixed(1)}</span>
        {[...Array(totalStars)].map((_, index) => renderStar(index))}
      </div>
    </div>
  )
}

export default Rating
