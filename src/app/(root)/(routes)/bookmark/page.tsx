import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Bookmark } from '@/components/(pages)/bookmark/Bookmark'

export const metadata: Metadata = {
  title: '북마크',
  description:
    '관심있는 IT 동아리와 후기를 북마크하여 쉽게 확인하세요. 저장한 동아리 정보와 후기를 한눈에 모아볼 수 있습니다.',
  keywords: [
    'IT 동아리 북마크',
    '동아리 후기 저장',
    '관심 동아리',
    '북마크한 후기',
  ],
  openGraph: {
    title: '북마크 | 모여잇',
    description:
      '관심있는 IT 동아리와 후기를 북마크하여 쉽게 확인하세요. 저장한 동아리 정보와 후기를 한눈에 모아볼 수 있습니다.',
  },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Bookmark />
    </Suspense>
  )
}
