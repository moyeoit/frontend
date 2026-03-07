export interface ClubDetailsData {
  clubId: number
  clubName: string
  imageUrl: string | null
  detailContent: string
  homepageUrl: string | null
}

export interface ClubsListItem {
  clubId: number
  clubName: string
  description: string
  categories: string[]
  logoUrl: string
  isRecruiting: boolean
}

export interface PageableSort {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: PageableSort
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface ClubsPage {
  content: ClubsListItem[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: PageableSort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface ClubRecruitsData {
  recruitmentPart: string[]
  qualification: string
  recruitmentSchedule: string
  activityPeriod: string
  activityMethod: string
  activityFee: string
  homepageUrl: string
  noticeUrl: string | null
}

export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR'
  message: string
  data: T
}

export type ClubRecruitsResponse = ApiResponse<ClubRecruitsData>

// Subscription types
export interface SubscriptionRequest {
  clubId: number
}

export interface SubscriptionResponse {
  data: boolean
  message: string
  status: string
}

export type ClubSubscriptionResponse = ApiResponse<SubscriptionResponse>

// User subscription check types
export interface UserSubscriptionCheckData {
  subscribed: boolean
}

export type UserSubscriptionCheckResponse =
  ApiResponse<UserSubscriptionCheckData>
// Search types
export interface ClubSearchRequest {
  keyword?: string
}

export interface ClubSearchDatum {
  clubId: number
  imgUrl: string
  name: string
}

export interface ClubSearchResponse {
  data: ClubSearchDatum[]
  message: string
  status: string
}
