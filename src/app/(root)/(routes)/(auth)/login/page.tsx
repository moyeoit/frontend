'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { KakaoIcon, GoogleIcon } from '@/assets/icons'
import { Button } from '@/components/atoms/Button'
import { useOAuthAuthorize } from '@/features/oauth'
import AppPath from '@/shared/configs/appPath'
import { useAuth } from '@/shared/providers/auth-provider'

export default function LoginPage() {
  const { mutate: authorize, isPending } = useOAuthAuthorize()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (user) {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back()
      } else {
        router.push(AppPath.home())
      }
    }
  }, [isLoading, user, router])

  const handleKakaoLogin = () => {
    authorize('kakao')
  }

  const handleGoogleLogin = () => {
    authorize('google')
  }

  return (
    <div className="w-full h-full">
      <main className="flex flex-col gap-2 px-5 h-screen justify-center w-full desktop:max-w-[400px] mx-auto">
        <div className="flex flex-col typo-title-1 text-black-color justify-center items-center mb-4 text-center">
          <div>IT직군을 위한 실전 성장 플랫폼</div>
        </div>
        <div className="typo-body-2-2 text-grey-color-3 text-center mb-16 break-keep whitespace-nowrap">
          IT 직군 현직자 · 지망생들과 생생한 이야기를 나눠보세요
        </div>
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleKakaoLogin}
            disabled={isPending}
            size="medium"
            className="typo-body-3-b bg-kakao-color items-center text-black-color border-none hover:bg-kakao-color/80 gap-2 active:bg-kakao-color/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <KakaoIcon width={25} height={25} role="img" aria-label="kakao" />
            {isPending ? '로그인 중...' : '카카오 계정으로 계속하기'}
          </Button>
          <Button
            onClick={handleGoogleLogin}
            disabled={isPending}
            size="medium"
            className="typo-body-3-b bg-white-color items-center border-light-color-3 text-black-color hover:bg-white-color/80 gap-2 active:bg-white-color/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon width={25} height={25} role="img" aria-label="google" />
            {isPending ? '로그인 중...' : '구글 계정으로 계속하기'}
          </Button>
        </div>
      </main>
    </div>
  )
}
