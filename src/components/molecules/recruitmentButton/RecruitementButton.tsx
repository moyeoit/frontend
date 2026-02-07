'use client'

import * as React from 'react'
import { BellFilledIcon } from '@/assets/icons'
import { Button } from '@/components/atoms/Button/button'
import { cn } from '@/shared/utils/cn'

export interface RecruitmentButtonsProps {
  homepageUrl?: string
  noticeUrl?: string
  onHomepageClick?: () => void
  onNoticeClick?: () => void
  className?: string
  disabled?: boolean
  isDesktop?: boolean
}

export function RecruitmentButtons({
  homepageUrl,
  noticeUrl,
  onHomepageClick,
  onNoticeClick,
  className,
  disabled = false,
  isDesktop = true,
}: RecruitmentButtonsProps) {
  const handleHomepageClick = () => {
    if (onHomepageClick) {
      onHomepageClick()
    } else if (homepageUrl) {
      window.open(homepageUrl)
    }
  }

  const handleNoticeClick = () => {
    if (onNoticeClick) {
      onNoticeClick()
    } else if (noticeUrl) {
      window.open(noticeUrl)
    }
  }

  return (
    <>
      <Button
        variant="solid"
        size="medium"
        className={cn('w-full', !isDesktop && 'flex-1')}
        onClick={handleHomepageClick}
        disabled={disabled}
      >
        홈페이지 바로가기
      </Button>
      <Button
        variant="outlined-secondary"
        size="medium"
        className={cn('w-full', !isDesktop && 'flex-1', className)}
        onClick={handleNoticeClick}
        disabled={disabled}
      >
        <BellFilledIcon width={20} height={20} role="img" />
        모집 알림 받기
      </Button>
    </>
  )
}
