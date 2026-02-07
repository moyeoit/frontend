import axios from 'axios'
import AppPath from '@/shared/configs/appPath'
import { tokenCookies } from './cookies'

const baseURL = 'https://dev-api.moyeoit.com'

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  timeout: 10_000,
})

let isAuthRedirecting = false

apiClient.interceptors.request.use(
  (config) => {
    // 쿠키에서 토큰을 가져와서 Authorization 헤더에 추가
    const token = tokenCookies.getAccessToken()
    if (token && tokenCookies.isTokenValid()) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (token) {
      tokenCookies.clearAll()
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      tokenCookies.clearAll()

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('oauth_data')

        const currentPath = window.location.pathname
        const isAuthPage =
          currentPath === AppPath.login() ||
          currentPath === AppPath.signup() ||
          currentPath.startsWith('/oauth-callback/')

        if (!isAuthPage && !isAuthRedirecting) {
          isAuthRedirecting = true
          const nextPath = `${window.location.pathname}${window.location.search}`
          const loginPath = `${AppPath.login()}?expired=1&next=${encodeURIComponent(nextPath)}`
          window.location.replace(loginPath)
        }
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
export const axiosInstance = apiClient
