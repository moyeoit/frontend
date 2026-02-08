export const Environment = {
  apiAddress: () => {
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS ?? ''
    const mockingAddress =
      process.env.NEXT_PUBLIC_API_MOCKING_ADDRESS ?? apiAddress
    const isMockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'

    return isMockingEnabled ? mockingAddress : apiAddress
  },
  apiMocking: () =>
    process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' ? 'enabled' : 'disabled',
  tokenName: () => process.env.NEXT_PUBLIC_API_TOKEN_NAME ?? '',
  refreshTokenName: () => process.env.NEXT_PUBLIC_API_REFRESH_TOKEN_NAME ?? '',
  currentAddress: () => process.env.NEXT_PUBLIC_CURRENT_ADDRESS ?? '',
  gaId: () => process.env.NEXT_PUBLIC_GA_ID?.trim() ?? '',
  clarityId: () => process.env.NEXT_PUBLIC_CLARITY_ID?.trim() ?? '',
}

// FIXME: 사용하는 것으로 한정 및 정리 필요
