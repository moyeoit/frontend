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

export interface PostImage {
  url: string
  orderIndex: number
}

export interface PostCreateRequest {
  categoryId: number
  title: string
  content: string
  postType: PostType
  images?: PostImage[]
}

export type PostType = 'QUESTION' | 'GENERAL' | 'INFORMATION' | 'TIP'

export interface PostCreateResponse {
  postId: number
}

// 게시글 좋아요 응답
export interface PostLikeResponse {
  postId: number
  liked: boolean
  likeCount: number
}

// 게시글 수정 요청
export interface PostUpdateRequest {
  categoryId: number
  title: string
  content: string
  postType: PostType
  images?: PostImage[]
}

// 게시글 수정 응답
export interface PostUpdateResponse {
  categoryId: number
  title: string
  content: string
  postType: PostType
  images?: PostImage[]
}

// 게시글 상세 응답
export interface PostDetail {
  categoryName: string
  title: string
  nickname: string
  authorProfileImageUrl: string
  content: string
  post_type: PostType
  image_url: string[]
  create_at: string
  view_count: number
  like_count: number
  comment_count: number
  hotPost: boolean
  liked: boolean
}

// 댓글 타입 (API 응답 기준)
export interface PostComment {
  id: number
  userId: number
  postId: number
  parentId: number | null
  content: string
  likeCount: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  // API 확장 응답 (유저 조인 시)
  nickname?: string
  profileImageUrl?: string | null
  children?: PostComment[]
}

export interface PostCommentCreateRequest {
  content: string
  parentId?: number | null
}

export interface PostCommentUpdateRequest {
  parentId?: number | null
  content: string
}

// 카테고리 매핑 (DB 기준)
export const CATEGORY_MAP: Record<string, number> = {
  free: 3, // 자유
  'it-club': 4, // IT동아리
  university: 5, // 대학생활
  work: 6, // 직장생활
  career: 7, // 이직/커리어
  'job-prep': 8, // 취업준비
}

// 카테고리 라벨 -> ID 매핑 (수정 시 사용)
export const CATEGORY_LABEL_TO_ID: Record<string, number> = {
  자유: 3,
  'IT 동아리': 4,
  IT동아리: 4,
  대학생활: 5,
  직장생활: 6,
  '이직/커리어': 7,
  취업준비: 8,
}
