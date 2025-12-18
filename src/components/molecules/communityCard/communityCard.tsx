'use client'

import * as React from 'react'
import Image from 'next/image'
import { ThumbsUpEmptyIcon, MessageIcon } from '@/assets/icons'
import { cn } from '@/shared/utils/cn'

type CommunityCardType = 'vertical' | 'horizontal'

export const CommunityCardCtx = React.createContext<{
  type: CommunityCardType
}>({
  type: 'horizontal',
})

export interface CommunityCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type?: CommunityCardType
}

export function CommunityCard({
  type = 'horizontal',
  className,
  children,
  ...props
}: CommunityCardProps) {
  return (
    <CommunityCardCtx.Provider value={{ type }}>
      <div
        data-slot="community-card"
        className={cn(
          'w-full',
          type === 'vertical' ? 'flex flex-col' : 'flex flex-row items-start',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CommunityCardCtx.Provider>
  )
}

export function CommunityCardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { type } = React.useContext(CommunityCardCtx)

  return (
    <div
      data-slot="community-card-content"
      className={cn(
        type === 'vertical' ? 'flex flex-col' : 'flex-1 flex flex-col ',
        className,
      )}
      {...props}
    />
  )
}

export function CommunityCardDescription({
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="community-card-description"
      className={cn(
        'typo-body-2-3-m text-grey-color-5 text-ellipsis overflow-hidden line-clamp-2 flex-col mt-2',
      )}
      {...props}
    />
  )
}

export interface CommunityCardImageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  logoUrl?: string | null
  alt?: string
}

export function CommunityCardImage({
  logoUrl,
  alt,
  className,
  ...props
}: CommunityCardImageProps) {
  const [failed, setFailed] = React.useState(false)
  const src = failed || !logoUrl ? '/images/default.svg' : logoUrl

  return (
    <div
      data-slot="community-card-image"
      className={cn(
        'relative object-cover overflow-hidden border border-light-color-3 rounded-[12px]',
        'w-[120px] h-[120px]',
        className,
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt || ''}
        fill
        sizes="120px"
        className="object-cover transition-transform duration-300 ease-out will-change-transform transform-gpu group-hover:scale-105"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

export function CommunityCardMeta({
  nickname,
  timeAgo,
  views,
  likes,
  comments,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  nickname?: string
  timeAgo?: string
  views?: number
  likes?: number
  comments?: number
}) {
  const leftParts = [nickname?.trim(), timeAgo?.trim()].filter(Boolean)
  const hasViews = views !== undefined

  if (leftParts.length === 0 && !hasViews && !likes && !comments) return null

  return (
    <div
      data-slot="community-card-meta"
      className={cn(
        'flex items-center typo-body-3-3-r text-grey-color-3 mt-4',
        className,
      )}
      {...props}
    >
      {leftParts.length > 0 && <span>{leftParts.join('\u2009·\u2009')}</span>}
      {hasViews && (
        <>
          {leftParts.length > 0 && <span className="mx-1">·</span>}
          <span>조회 {views}</span>
        </>
      )}
      {(likes !== undefined || comments !== undefined) && (
        <>
          {(leftParts.length > 0 || hasViews) && (
            <span className="text-grey-color-3 mx-2">|</span>
          )}
          <div className="flex items-center gap-1">
            {likes !== undefined && (
              <div className="flex items-center gap-1">
                <ThumbsUpEmptyIcon />
                <span>{likes}</span>
              </div>
            )}
            {comments !== undefined && (
              <div className="flex items-center gap-1">
                <MessageIcon />
                <span>{comments}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export function CommunityCardTitle({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="community-card-title"
      className={cn(
        'desktop:typo-body-1-b phone:typo-body-3-1-sb text-black-color text-ellipsis overflow-hidden line-clamp-1 flex-col',
      )}
      {...props}
    />
  )
}
