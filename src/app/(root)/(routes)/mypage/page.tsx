import { Suspense } from 'react'
import MyPage from '@/components/(pages)/mypage/MyPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MyPage />
    </Suspense>
  )
}
