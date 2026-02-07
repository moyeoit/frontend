'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/atoms/popover'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'

export interface PostButtonProps {
  className?: string
  onGeneralPostClick?: () => void
  onQuestionPostClick?: () => void
}

export function PostButton({ className }: PostButtonProps) {
  const { isDesktop } = useMediaQuery()
  const router = useRouter()

  const handleClick = (postType: 'general' | 'question') => {
    router.push(`/community/post/${postType}`)
  }

  const popoverContent = (
    <PopoverContent
      className={cn('w-35 h-28 border-light-color-4 p-0', className)}
      align="end"
      sideOffset={isDesktop ? 15 : 11}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <button
          type="button"
          className="w-full text-left pl-4 py-2 typo-body-3-r text-grey-color-5 hover:text-black-color hover:bg-light-color-2 active:text-black-color active:bg-light-color-2"
          onClick={() => handleClick('general')}
        >
          일반글 작성
        </button>
        <button
          type="button"
          className="w-full text-left pl-4 py-2 typo-body-3-r text-grey-color-5 hover:text-black-color hover:bg-light-color-2 active:text-black-color active:bg-light-color-2"
          onClick={() => handleClick('question')}
        >
          질문글 작성
        </button>
      </div>
    </PopoverContent>
  )

  return (
    <div
      className={cn(
        isDesktop ? 'shrink-0 ml-auto mr-0' : 'fixed bottom-5 right-5 z-10',
      )}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="solid"
            size={isDesktop ? 'small' : 'medium'}
            className="shrink-0"
          >
            글 작성
          </Button>
        </PopoverTrigger>
        {popoverContent}
      </Popover>
    </div>
  )
}
