import { Suspense } from 'react'
import type { Metadata } from 'next'
// import HomePage from '@/components/(pages)/(home)/HomePage'
import Landing from '@/components/(pages)/landing/Landing'

// import { Footer } from '@/components/molecules/layout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '홈',
  description:
    '관심사가 맞는 사람들이 모여, 함께 성장하는 공간. 모여잇에서 IT 동아리 탐색과 IT 직군 커뮤니티에서 현직자·지망생들과 생생한 이야기를 나눠보세요!',
  openGraph: {
    title: '모여잇 - IT 직군을 위한 실전 성장 플랫폼',
    description:
      'IT 동아리 탐색부터 현직자·지망생들과 커뮤니티까지! 기획자, 디자이너, 개발자를 위한 실전 성장 플랫폼',
  },
}

export default function Home() {
  return (
    <div>
      <Suspense fallback={null}>
        <Landing />
      </Suspense>
      {/* <Footer /> */}
    </div>
  )
}
