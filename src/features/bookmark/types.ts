export type BookmarkType =
  | 'CLUB'
  | 'INTERVIEW_REVIEW'
  | 'ACTIVITY_REVIEW'
  | 'BLOG_REVIEW'

export interface BookmarkRequest {
  targetId: number
  type: BookmarkType
}

export interface BookmarkResponse {
  status: string
  message?: string
}

// 북마크한 동아리 아이템
export interface BookmarkedClub {
  clubId: number
  clubName: string
  description: string
  categories: string[]
  logoUrl: string
  isRecruiting: boolean
}

// 페이지네이션 정보
export interface BookmarkedClubsPageable {
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

// 북마크한 동아리 페이지 응답
export interface BookmarkedClubsPage {
  content: BookmarkedClub[]
  pageable: BookmarkedClubsPageable
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

// API 응답 래퍼
export interface BookmarkedClubsResponse {
  status: string
  data: BookmarkedClubsPage
}
