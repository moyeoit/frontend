import { Suspense } from 'react'
import type { Metadata } from 'next'
import CommunityDetailView from '@/components/(pages)/community/CommunityDetail'

export const metadata: Metadata = {
  title: '게시글 상세',
  description: '커뮤니티 게시글을 확인하세요.',
}

export default function CommunityDetailPage() {
  return (
    <Suspense fallback={null}>
      <CommunityDetailView />
    </Suspense>
  )
}
