import { Suspense } from 'react'
import WithdrawPage from '@/components/(pages)/mypage/withdraw/WithdrawPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WithdrawPage />
    </Suspense>
  )
}
