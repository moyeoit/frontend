'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/shared/utils/cn'

export const PopularCommunityCardCtx = React.createContext<{
  postType?: string
}>({
  postType: undefined,
})

export interface PopularCommunityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  postType?: string
  postId?: number
}

export function PopularCommunityCard({
  postType,
  postId,
  className,
  children,
  onClick,
  ...props
}: PopularCommunityCardProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (postId) {
      router.push(`/post/detail/${postId}`)
    }
    onClick?.(e)
  }

  return (
    <PopularCommunityCardCtx.Provider value={{ postType }}>
      <div
        data-slot="popular-community-card"
        className={cn(
          'w-full bg-light-color-1 border border-light-color-2 rounded-[16px] p-6 cursor-pointer',
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    </PopularCommunityCardCtx.Provider>
  )
}

export function PopularCommunityCardTitle({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { postType } = React.useContext(PopularCommunityCardCtx)
  const isQuestion = postType === 'QUESTION'

  return (
    <div
      data-slot="popular-community-card-title"
      className={cn(
        'typo-body-2-2-sb text-black-color text-ellipsis overflow-hidden line-clamp-1 flex-col',
        className,
      )}
      {...props}
    >
      {isQuestion && (
        <span className="typo-body-1-b text-main-color-1 mr-2">Q.</span>
      )}
      {children}
    </div>
  )
}

export function PopularCommunityCardDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popular-community-card-description"
      className={cn(
        'typo-body-3-3-r text-grey-color-4 text-ellipsis overflow-hidden line-clamp-2 flex-col',
        className,
      )}
      {...props}
    />
  )
}
