import { Suspense } from 'react'
import type { Metadata } from 'next'
import SearchView from '@/components/(pages)/search/SearchView'

export const metadata: Metadata = {
  title: '검색',
  description: '모여잇에서 IT 동아리, 후기, 커뮤니티를 검색해보세요.',
  openGraph: {
    title: '검색 | 모여잇',
    description: '모여잇에서 IT 동아리, 후기, 커뮤니티를 검색해보세요.',
  },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchView />
    </Suspense>
  )
}
