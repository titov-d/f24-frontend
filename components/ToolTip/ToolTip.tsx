// components/Tooltip/Tooltip.tsx
import React, { useState, useRef, useEffect } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  text: string
  tooltip: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const Tooltip: React.FC<TooltipProps> = ({ text, tooltip, position }) => {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const triggerElement = triggerRef.current
    if (triggerElement) {
      triggerElement.addEventListener('mouseenter', handleMouseEnter)
      triggerElement.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (triggerElement) {
        triggerElement.removeEventListener('mouseenter', handleMouseEnter)
        triggerElement.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 10
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 10
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          break
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.left - tooltipRect.width - 10
          break
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          left = triggerRect.right + 10
          break
      }

      tooltipRef.current.style.top = `${top}px`
      tooltipRef.current.style.left = `${left}px`
    }
  }, [isVisible, position])

  return (
    <>
      <span ref={triggerRef} className={styles.tooltipTrigger}>
        {text}
      </span>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`${styles.tooltip} ${styles[`tooltip--${position}`]}`}
          role="tooltip"
        >
          {tooltip}
        </div>
      )}
    </>
  )
}

export default Tooltip
