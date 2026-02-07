import AppPath from '@/shared/configs/appPath'
import apiClient from '@/shared/utils/axios'
import {
  OAuthProvider,
  OAuthAuthorizeResponse,
  OAuthLoginRequest,
  OAuthLoginResponse,
} from './types'

export const oauthApi = {
  /**
   * 소셜 로그인 페이지로 리다이렉트
   * @param provider - OAuth 제공자 ('google' | 'kakao')
   */
  authorize: async (provider: OAuthProvider): Promise<void> => {
    // 클라이언트 콜백 URL을 쿼리 파라미터로 전달
    const redirectUri = `${window.location.origin}${AppPath.oauthCallback(provider)}`

    // provider를 대문자로 변환 (GOOGLE, KAKAO)
    const providerUpper = provider.toUpperCase()

    try {
      // 백엔드 API 호출하여 OAuth URL 가져오기
      const response = await apiClient.get<OAuthAuthorizeResponse>(
        `/api/api/v1/auth/${providerUpper}/authorize`,
        {
          params: {
            redirect_uri: redirectUri,
            state: 1,
          },
        },
      )

      if (response.data.status === 'SUCCESS' && response.data.data?.url) {
        // 백엔드에서 반환한 OAuth URL로 리다이렉트
        window.location.href = response.data.data.url
      } else {
        throw new Error('OAuth URL을 가져오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('OAuth 인증 요청 실패:', error)
      throw error
    }
  },

  /**
   * OAuth Provider로부터 받은 authentication_code를 전달하여 로그인/회원가입
   * @param code - OAuth Provider로부터 받은 authentication_code
   * @param state - OAuth 인증 시 전달한 state 값
   * @param redirectUri - OAuth 인증 시 전달한 redirect_uri
   * @param provider - OAuth 제공자 ('google' | 'kakao')
   */
  login: async (
    code: string,
    state: string,
    redirectUri: string,
    provider: OAuthProvider,
  ): Promise<OAuthLoginResponse> => {
    // provider를 대문자로 변환 (GOOGLE, KAKAO)
    const providerType = provider.toUpperCase()

    try {
      const response = await apiClient.post<OAuthLoginResponse>(
        '/api/api/v1/auth/login',
        {
          code,
          state,
          redirectUri,
          providerType,
        } as OAuthLoginRequest,
      )

      if (response.data.accessToken) {
        return response.data
      } else {
        throw new Error('로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('OAuth 로그인 실패:', error)
      throw error
    }
  },
}
