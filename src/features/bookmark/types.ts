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

// 북마크한 후기 아이템 (공통)
export interface BookmarkedReview {
  reviewId: number
  clubName: string
  generation: number
  jobName: string
  rate: number
  title: string
  answerSummaries: {
    questionTitleSummary: string
    answerSummary: string
  }[]
  likeCount: number
  commentCount: number
}

// 북마크한 후기 페이지 응답 (공통)
export interface BookmarkedReviewsPage {
  content: BookmarkedReview[]
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

// 북마크한 후기 API 응답 래퍼 (공통)
export interface BookmarkedReviewsResponse {
  status: string
  message: string
  data: BookmarkedReviewsPage
}

// 북마크한 후기 조회 파라미터 (공통)
export interface BookmarkedReviewsParams {
  page?: number
  size?: number
  sort?: string[]
}

// Type aliases for clarity
export type BookmarkedInterviewReview = BookmarkedReview
export type BookmarkedActivityReview = BookmarkedReview

export type BookmarkedInterviewReviewsPage = BookmarkedReviewsPage
export type BookmarkedActivityReviewsPage = BookmarkedReviewsPage

export type BookmarkedInterviewReviewsResponse = BookmarkedReviewsResponse
export type BookmarkedActivityReviewsResponse = BookmarkedReviewsResponse

export type BookmarkedInterviewReviewsParams = BookmarkedReviewsParams
export type BookmarkedActivityReviewsParams = BookmarkedReviewsParams
