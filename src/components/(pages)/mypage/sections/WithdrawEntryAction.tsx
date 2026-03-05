import React from 'react'
import { cn } from '@/shared/utils/cn'

interface WithdrawEntryActionProps {
  onOpen: () => void
  className?: string
}

export function WithdrawEntryAction({
  onOpen,
  className,
}: WithdrawEntryActionProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'h-[27px] px-4 rounded-[100px] bg-light-color-3 text-white-color typo-caption-1',
        className,
      )}
    >
      회원 탈퇴
    </button>
  )
}
