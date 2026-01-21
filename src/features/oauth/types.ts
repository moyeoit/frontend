export type OAuthProvider = 'google' | 'kakao'

// OAuth API 요청/응답 타입
export interface OAuthAuthorizeResponse {
  status: string
  data: {
    url: string
    state?: string
    provider?: string
  }
}

export interface OAuthLoginRequest {
  code: string
  state: string
  redirectUri: string
  providerType: string
}

export interface OAuthLoginResponse {
  accessToken: string
  expiresIn: number
  redirectUri: string
}

// OAuth 콜백 파라미터 타입
export interface OAuthCallbackParams {
  userId: string
  active: string
  accessToken: string
  expiresIn: string
}
