import { Suspense } from 'react'
import { Metadata } from 'next'
import { Community } from '@/components/(pages)/community/Community'

export const metadata: Metadata = {
  title: '커뮤니티',
  description:
    'IT 동아리 커뮤니티에서 다양한 주제로 토론하고 정보를 공유해보세요. 동아리 활동, 취업 준비, 이직 경험 등 다양한 주제로 토론할 수 있습니다.',
  keywords: [
    'IT 동아리 커뮤니티',
    'IT 동아리',
    '대학 생활',
    '직장 생활',
    '이직/커리어',
    '취업 준비',
    'IT 커뮤니티',
  ],
  openGraph: {
    title: '커뮤니티 | 모여잇',
    description:
      'IT 동아리 커뮤니티에서 다양한 주제로 토론하고 정보를 공유해보세요. 동아리 활동, 취업 준비, 이직 경험 등 다양한 주제로 토론할 수 있습니다.',
  },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Community />
    </Suspense>
  )
}
