import { Suspense } from 'react'
import { Metadata } from 'next'
import Detail from '@/components/(pages)/club/detail/Detail'

export const metadata: Metadata = {
  title: '동아리 상세정보',
  description:
    'IT 동아리 상세 정보를 확인하고 소개 콘텐츠와 홈페이지 링크를 통해 동아리에 대해 자세히 알아볼 수 있습니다.',
  keywords: ['IT 동아리 상세정보', 'IT 동아리 소개', 'IT 동아리 탐색'],
  openGraph: {
    title: '동아리 상세정보 | 모여잇',
    description:
      'IT 동아리 상세 정보를 확인하고 소개 콘텐츠와 홈페이지 링크를 통해 동아리에 대해 자세히 알아볼 수 있습니다.',
  },
}

export default async function Page({
  params,
}: {
  params: Promise<{ clubId: string | number }>
}) {
  const { clubId } = await params
  const parsedClubId = Number(clubId)

  if (!Number.isFinite(parsedClubId) || parsedClubId <= 0) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <Detail clubId={parsedClubId} />
    </Suspense>
  )
}
