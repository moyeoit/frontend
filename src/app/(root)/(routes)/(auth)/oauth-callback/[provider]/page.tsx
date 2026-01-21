'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { oauthApi } from '@/features/oauth/api'
import { OAuthProvider } from '@/features/oauth/types'
import { userApi } from '@/features/user'
import AppPath from '@/shared/configs/appPath'
import { useAuth } from '@/shared/providers/auth-provider'
import { tokenCookies } from '@/shared/utils/cookies'

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const { login } = useAuth()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // provider는 URL 파라미터에서 추출
  const provider = params.provider as OAuthProvider

  // 유효하지 않은 provider인 경우 처리
  useEffect(() => {
    if (provider && !['google', 'kakao'].includes(provider)) {
      console.error('Invalid OAuth provider:', provider)
      router.push(`${AppPath.login()}?error=invalid_provider`)
      return
    }

    // OAuth Provider로부터 받은 code, state 처리
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      console.error('OAuth error:', errorParam)
      setError('소셜 로그인 중 오류가 발생했습니다.')
      setIsProcessing(false)
      setTimeout(() => router.push(AppPath.login()), 3000)
      return
    }

    if (!code) {
      console.error('No authorization code received')
      setError('유효한 인증코드를 받지 못했습니다.')
      setIsProcessing(false)
      setTimeout(() => router.push(AppPath.login()), 3000)
      return
    }

    // redirectUri는 현재 페이지의 전체 URL (쿼리 파라미터 제외)
    const redirectUri = `${window.location.origin}${AppPath.oauthCallback(provider)}`

    // code를 사용하여 로그인 API 호출
    const handleLogin = async () => {
      try {
        setIsProcessing(true)
        const loginData = await oauthApi.login(
          code!,
          state || '1', // state가 없으면 기본값 '1' 사용
          redirectUri,
          provider,
        )

        // 토큰 저장
        tokenCookies.setAccessToken(loginData.accessToken, loginData.expiresIn)
        tokenCookies.setExpiresAt(Date.now() + loginData.expiresIn * 1000)

        // 사용자 프로필 정보 가져오기
        try {
          const userProfile = await userApi.getProfile()

          // 사용자 ID 저장
          tokenCookies.setUserId(userProfile.id.toString())

          // AuthProvider 상태 업데이트
          login(
            loginData.accessToken,
            {
              id: userProfile.id,
              active: userProfile.active,
              email: userProfile.email,
            },
            loginData.expiresIn,
          )

          // active 상태에 따라 리다이렉트
          if (userProfile.active) {
            // 이미 가입된 사용자인 경우 - 홈으로 이동
            router.push(AppPath.home())
          } else {
            // 회원가입이 필요한 경우 - OAuth 정보를 세션스토리지에 저장하고 signup으로 이동
            sessionStorage.setItem(
              'oauth_data',
              JSON.stringify({
                userId: userProfile.id.toString(),
                active: userProfile.active.toString(),
                accessToken: loginData.accessToken,
                expiresIn: loginData.expiresIn.toString(),
              }),
            )
            router.push(AppPath.signup())
          }
        } catch (profileError) {
          // 프로필 조회 실패 시에도 토큰은 저장하고 홈으로 이동
          console.error('프로필 조회 실패:', profileError)
          login(
            loginData.accessToken,
            {
              id: 0, // 임시 값
              active: true,
            },
            loginData.expiresIn,
          )
          router.push(AppPath.home())
        }
      } catch (err) {
        console.error('OAuth login error:', err)
        setError('소셜 로그인 중 오류가 발생했습니다.')
        setIsProcessing(false)
        // 로그인 실패 시 3초 후 로그인 페이지로 이동 (무한로딩 방지)
        setTimeout(() => router.push(AppPath.login()), 3000)
      }
    }

    handleLogin()
  }, [provider, searchParams, router])

  // 로딩 상태 표시
  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-600">소셜 로그인 처리 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">로그인 처리 중 오류가 발생했습니다.</p>
          <p className="text-gray-600">잠시 후 로그인 페이지로 이동합니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  )
}
