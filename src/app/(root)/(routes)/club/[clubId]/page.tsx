import { Suspense } from 'react'
import { Metadata } from 'next'
import Detail from '@/components/(pages)/club/detail/Detail'

export const metadata: Metadata = {
  title: '동아리 상세정보',
  description:
    'IT 동아리 상세 정보를 확인하고 후기를 읽어보세요. 동아리 모집 정보, 활동 방식, 후기 등을 통해 동아리에 대해 자세히 알아볼 수 있습니다.',
  keywords: [
    'IT 동아리 상세정보',
    'IT 동아리 활동 후기',
    'IT 동아리 서류 면접 후기',
    'IT 동아리 블로그 후기',
  ],
  openGraph: {
    title: '동아리 상세정보 | 모여잇',
    description:
      'IT 동아리 상세 정보를 확인하고 후기를 읽어보세요. 동아리 상세 내용, 활동 후기, 서류/면접 후기, 블로그 후기 등을 통해 동아리에 대해 자세히 알아볼 수 있습니다.',
  },
}

export default async function Page({
  params,
}: {
  params: Promise<{ clubId: number }>
}) {
  const { clubId } = await params

  return (
    <Suspense fallback={null}>
      <Detail clubId={clubId} />
    </Suspense>
  )
}
