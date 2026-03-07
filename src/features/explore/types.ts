export type ExploreSort = '인기순' | '이름순'

// API 요청 타입
export interface ExploreRequest {
  // 필터 파라미터
  part?: string
  way?: string
  target?: string
  sort?: ExploreSort
  // 페이지네이션 파라미터
  page?: number
  size?: number
}

// API 응답 타입
export interface ClubItem {
  clubId: number
  clubName: string
  description: string
  categories: string[]
  logoUrl: string
  isRecruiting: boolean
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface ClubListResponse {
  content: ClubItem[]
  pageable: Pageable
  last: boolean
  totalElements: number
  totalPages: number
  first: boolean
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  empty: boolean
}

export interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

export type ExploreApiResponse = ApiResponse<ClubListResponse>

// 타입 별칭 (하위 호환성)
export type Request = ExploreRequest
