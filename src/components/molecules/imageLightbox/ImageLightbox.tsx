'use client'

import React, { useCallback, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageLightboxProps {
  images: string[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === images.length - 1

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (images.length === 0) return null

  const currentImage = images[currentIndex]

  return (
    <div
      className="fixed inset-0 z-[200] bg-black flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="이미지 확대 보기"
    >
      {/* 닫기 버튼 - 왼쪽 상단 */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-grey-color-1 transition-colors"
        aria-label="닫기"
      >
        <X className="w-5 h-5" strokeWidth={2.5} />
      </button>

      {/* 이미지 영역 */}
      <div className="flex-1 flex items-center justify-center min-h-0 p-4">
        <div className="flex items-center gap-4 w-full h-full justify-center">
          {/* 왼쪽 화살표 - 첫 장이 아닐 때만 */}
          {!isFirst && (
            <button
              type="button"
              onClick={onPrev}
              className="shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:bg-grey-color-1 transition-colors"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>
          )}

          {/* 이미지 - 원본 비율 유지 */}
          <div className="flex-1 flex items-center justify-center min-w-0 max-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={`이미지 ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* 오른쪽 화살표 - 마지막 장이 아닐 때만 */}
          {!isLast && (
            <button
              type="button"
              onClick={onNext}
              className="shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:bg-grey-color-1 transition-colors"
              aria-label="다음 이미지"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* 페이지네이션 인디케이터 - 하단 중앙 */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 pb-6">
          {images.map((_, i) => (
            <span
              key={i}
              className={
                i === currentIndex
                  ? 'w-2 h-2 rounded-full bg-white'
                  : 'w-2 h-2 rounded-full border border-grey-color-3'
              }
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </div>
  )
}
