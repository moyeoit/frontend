import { Suspense } from 'react'
import type { Metadata } from 'next'
import CommunityPostEdit from '@/components/(pages)/community/CommunityPostEdit'

export const metadata: Metadata = {
  title: '게시글 수정',
  description: '커뮤니티 게시글을 수정합니다.',
}

export default function CommunityPostEditPage() {
  return (
    <Suspense fallback={null}>
      <CommunityPostEdit />
    </Suspense>
  )
}
