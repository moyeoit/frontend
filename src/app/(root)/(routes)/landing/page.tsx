import { Suspense } from 'react'
import Landing from '@/components/(pages)/landing/Landing'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Landing />
    </Suspense>
  )
}
