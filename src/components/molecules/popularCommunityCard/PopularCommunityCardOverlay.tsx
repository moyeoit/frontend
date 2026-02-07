'use client'

import * as React from 'react'
import { Tag } from '@/components/atoms/tag'
import { CommunityCard } from '@/components/molecules/communityCard'
import { PopularCommunityCard } from '@/components/molecules/popularCommunityCard'
import type {
  CommunityPostItem,
  PopularPostItem,
} from '@/features/community/types'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'
import { formatTimeAgo } from '@/shared/utils/dateFormat'

export interface PopularCommunityCardOverlayProps {
  post: CommunityPostItem | PopularPostItem
}

export default function PopularCommunityCardOverlay({
  post,
}: PopularCommunityCardOverlayProps) {
  const { isDesktop } = useMediaQuery()

  if (isDesktop) {
    return (
      <PopularCommunityCard postType={post.postType} postId={post.postId}>
        <div className="flex flex-row gap-[5px] mb-2">
          <Tag
            label={post.categoryName}
            kind="blogReview"
            size="large"
            className="shrink-0"
          />
          <Tag
            label="인기"
            kind="clubDetail"
            size="large"
            color="lightPurple"
            className="shrink-0"
          />
        </div>
        <PopularCommunityCard.Title>{post.title}</PopularCommunityCard.Title>
        <PopularCommunityCard.Description>
          {post.excerpt}
        </PopularCommunityCard.Description>
        <PopularCommunityCard.Meta
          likes={post.likeCount}
          comments={post.commentCount}
          className="mt-3"
        />
      </PopularCommunityCard>
    )
  }

  return (
    <CommunityCard
      type="horizontal"
      postType={post.postType}
      className={cn(
        'gap-6 group cursor-pointer relative',
        isDesktop ? 'gap-6' : 'gap-4',
      )}
    >
      <CommunityCard.Content className=" flex-col">
        <div className="flex flex-row gap-[5px] mb-2">
          <Tag
            label={post.categoryName}
            kind="blogReview"
            size={isDesktop ? 'large' : 'small'}
            className="shrink-0"
          />
        </div>
        <CommunityCard.Title>{post.title}</CommunityCard.Title>
        <CommunityCard.Description>{post.excerpt}</CommunityCard.Description>
        <CommunityCard.Meta
          {...('authorNickname' in post && {
            nickname: (post as CommunityPostItem).authorNickname,
          })}
          {...('createdAt' in post && {
            timeAgo: formatTimeAgo((post as CommunityPostItem).createdAt),
          })}
          {...('viewCount' in post && {
            views: (post as CommunityPostItem).viewCount,
          })}
          {...('likeCount' in post && {
            likes: (post as CommunityPostItem).likeCount,
          })}
          {...('commentCount' in post && {
            comments: (post as CommunityPostItem).commentCount,
          })}
          likes={post.likeCount}
          comments={post.commentCount}
          className="mt-4"
        />
      </CommunityCard.Content>
      <CommunityCard.Image
        logoUrl={(post as CommunityPostItem).thumbnailUrl}
        alt={post.title}
      />
    </CommunityCard>
  )
}
