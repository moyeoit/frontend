// Domain types for Community

export interface PostPage {
  content: CommunityPostItem[]
  pageable: Pageable
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: PageableSort
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface CommunityPostItem {
  postId: number
  title: string
  excerpt: string
  thumbnailUrl: string
  categoryId: number
  categoryName: string
  postType: string
  authorNickname: string
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: PageableSort
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface PageableSort {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

export interface PopularPostPage {
  content: PopularPostItem[]
  pageable: Pageable
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: PageableSort
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface PopularPostItem {
  postId: number
  title: string
  excerpt: string
  categoryId: number
  categoryName: string
  postType: string
  likeCount: number
  commentCount: number
}
