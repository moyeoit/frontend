'use client'

import React from 'react'
import { cn } from '@/shared/utils/cn'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  maxStars?: number
  className?: string
  disabled?: boolean
  size?: number
  showLabel?: boolean
  ratingLabels?: Partial<Record<number, string>>
  labelClassName?: string
}

export function StarRating({
  value,
  onChange,
  maxStars = 5,
  className,
  disabled = false,
  size = 24,
  showLabel = false,
  ratingLabels,
  labelClassName,
}: StarRatingProps) {
  const mergedLabels: Record<number, string> = {
    1: '매우 어려움',
    2: '어려움',
    3: '보통',
    4: '쉬움',
    5: '매우 쉬움',
    ...ratingLabels,
  }

  const ratingLabel =
    showLabel && value > 0 ? (mergedLabels[value] ?? null) : null

  return (
    <div className={cn('flex items-center gap-6', className)}>
      <div className="flex gap-2">
        {Array.from({ length: maxStars }, (_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= value

          return (
            <button
              key={index}
              type="button"
              onClick={() => !disabled && onChange(starValue)}
              disabled={disabled}
              aria-label={`${starValue}점 선택`}
              title={`${starValue}점`}
              className={cn(
                'transition-colors',
                !disabled && 'hover:scale-110',
                disabled && 'cursor-not-allowed',
              )}
            >
              <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                className={cn(
                  'transition-colors',
                  isFilled
                    ? 'fill-[#F6BF18] stroke-[#F6BF18]'
                    : 'fill-transparent stroke-light-color-3',
                  !disabled && 'hover:fill-[#F6BF18] hover:stroke-[#F6BF18]',
                )}
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )
        })}
      </div>
      {ratingLabel && (
        <p className={cn('typo-button-m text-black-color', labelClassName)}>
          {ratingLabel}
        </p>
      )}
    </div>
  )
}

export default StarRating
