// Blog Review domain types

export type SortType = 'POPULAR' | 'RECENT'

export interface BlogReviewSearchRequest {
  title?: string
  clubId?: number
  jobId?: number
  generation?: number
  sort?: SortType
  page?: number
  size?: number
}

export interface BlogReviewItem {
  reviewId: number
  clubName: string
  generation: number
  jobName: string
  title: string
  content?: string
  description?: string | null
  url: string
  imageUrl?: string
  blogName: string
  likeCount?: number
  commentCount?: number
  viewCount?: number
  createdAt?: string
  isBookmarked?: boolean
}

export interface BlogReviewPageable {
  offset: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  paged: boolean
  pageNumber: number
  pageSize: number
  unpaged: boolean
}

export interface BlogReviewSearchResponse {
  totalElements: number
  totalPages: number
  size: number
  content: BlogReviewItem[]
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: BlogReviewPageable
  empty: boolean
}
