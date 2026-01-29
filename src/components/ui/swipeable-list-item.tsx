'use client'

import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Trash2 } from 'lucide-react'

interface SwipeableListItemProps {
  children: React.ReactNode
  onDelete: () => void
  disabled?: boolean
}

export function SwipeableListItem({ children, onDelete, disabled = false }: SwipeableListItemProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)

  // Reset swipeOffset when disabled changes to true (cleanup after delete)
  useEffect(() => {
    if (disabled) {
      setSwipeOffset(0)
    }
  }, [disabled])

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (disabled) return

      // Only allow left swipe (negative deltaX)
      if (eventData.deltaX < 0) {
        // Clamp to max -80px
        const offset = Math.max(eventData.deltaX, -80)
        setSwipeOffset(offset)
        setIsSwiping(true)
      }
    },
    onSwipedLeft: (eventData) => {
      if (disabled) return

      setIsSwiping(false)
      // If swiped more than 40px, snap to -80px (reveal delete button)
      // Otherwise snap back to 0
      if (eventData.deltaX < -40) {
        setSwipeOffset(-80)
      } else {
        setSwipeOffset(0)
      }
    },
    onSwiped: () => {
      setIsSwiping(false)
    },
    trackMouse: true, // Enable for desktop testing
    preventScrollOnSwipe: true, // Avoid scroll conflicts
  })

  const handleDeleteClick = () => {
    if (disabled) return
    setSwipeOffset(0)
    onDelete()
  }

  return (
    <div {...handlers} className="relative overflow-hidden">
      {/* Content with swipe transform - z-10 ensures it covers the delete button when not swiped */}
      <div
        className="relative z-10 bg-card"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>

      {/* Delete button (revealed when swiped left) */}
      <button
        onClick={handleDeleteClick}
        disabled={disabled}
        aria-label="Delete"
        className="absolute right-0 top-0 bottom-0 w-20 z-0 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
}
