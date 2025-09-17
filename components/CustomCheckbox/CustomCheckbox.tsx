import React from 'react'
import styles from './CustomCheckbox.module.css'

interface CustomCheckboxProps {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className: string
  'aria-label': string
  color?: string
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  className,
  'aria-label': ariaLabel,
  color = '#4338ca', // Значение по умолчанию
}) => {
  return (
    <div
      className={styles.customCheckbox}
      style={{ '--checkbox-color': color } as React.CSSProperties}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`${styles.customCheckbox__input} ${className}`}
        aria-label={ariaLabel}
      />
      <div className={styles.customCheckbox__control} aria-hidden="true"></div>
    </div>
  )
}

export default CustomCheckbox
