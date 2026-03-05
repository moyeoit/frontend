import { apiClient } from '@/shared/utils'
import { ApiResponse } from '../explore/types'
import {
  PopularPostPage,
  PostPage,
  PostCreateRequest,
  PostCreateResponse,
  PostDetail,
  PostComment,
  PostCommentCreateRequest,
  PostCommentUpdateRequest,
  PostLikeResponse,
  PostUpdateRequest,
  PostUpdateResponse,
} from './types'

export async function getPosts(params?: {
  categoryName?: string
  page?: number
  size?: number
  sort?: string
}): Promise<PostPage> {
  const res = await apiClient.get<ApiResponse<PostPage>>('/api/v2/post/feed', {
    params,
  })
  return res.data.data
}

export async function getPopularPosts(params?: {
  page?: number
  size?: number
  sort?: string
}): Promise<PopularPostPage> {
  const res = await apiClient.get<ApiResponse<PopularPostPage>>(
    '/api/v2/post/popular',
    {
      params,
    },
  )
  return res.data.data
}

export async function getSearchPosts(params: {
  keyword: string
  page?: number
  size?: number
  sort?: string
}): Promise<PostPage> {
  const res = await apiClient.get<ApiResponse<PostPage>>('/api/v2/post/search', {
    params,
  })
  return res.data.data
}

// 커뮤니티 게시글 생성
export async function createPost(
  data: PostCreateRequest,
): Promise<PostCreateResponse> {
  const res = await apiClient.post<ApiResponse<PostCreateResponse>>(
    '/api/v2/post',
    data,
  )
  return res.data.data
}

// 커뮤니티 게시글 상세 조회
export async function getPostDetail(postId: string): Promise<PostDetail> {
  const res = await apiClient.get<ApiResponse<PostDetail>>(
    `/api/v2/post/detail/${postId}`,
  )
  return res.data.data
}

// 게시글 좋아요 토글
export async function togglePostLike(
  postId: string,
): Promise<PostLikeResponse> {
  const res = await apiClient.post<ApiResponse<PostLikeResponse>>(
    `/api/v2/post/detail/${postId}/like`,
  )
  return res.data.data
}

// 게시글 수정
export async function patchPost(
  postId: string,
  data: PostUpdateRequest,
): Promise<PostUpdateResponse> {
  const res = await apiClient.patch<ApiResponse<PostUpdateResponse>>(
    `/api/v2/post/${postId}`,
    data,
  )
  return res.data.data
}

// 게시글 삭제
export async function deletePost(postId: string): Promise<void> {
  await apiClient.delete(`/api/v2/post/${postId}`)
}

// API 댓글 응답 구조: { parent: Comment, children: ApiCommentItem[] }
interface ApiCommentItem {
  parent: Record<string, unknown>
  children?: ApiCommentItem[]
}

// 커뮤니티 게시글 댓글 목록 조회
export async function getPostComments(
  postId: string,
  params?: { page?: number; size?: number; sort?: string[] },
): Promise<PostComment[]> {
  const res = await apiClient.get<unknown>(`/api/v2/posts/${postId}/comments`, {
    params,
  })
  const raw = res.data as
    | { content?: ApiCommentItem[]; data?: ApiCommentItem[] }
    | ApiCommentItem[]
    | null

  if (Array.isArray(raw)) {
    return raw.map((item) => transformCommentItem(item))
  }
  const content = raw?.content ?? raw?.data
  if (Array.isArray(content)) {
    return content.map((item) => transformCommentItem(item ?? {}))
  }
  return []
}

// parent/children 구조를 PostComment 트리로 변환
function transformCommentItem(
  item: ApiCommentItem | Record<string, unknown>,
): PostComment {
  const parent = (item as ApiCommentItem).parent ?? item
  const children = (item as ApiCommentItem).children ?? []
  const comment = normalizeComment(
    typeof parent === 'object' && parent !== null ? parent : {},
  )
  comment.children = children.map((child) => transformCommentItem(child))
  return comment
}

// API 응답을 PostComment 형식으로 정규화 (snake_case → camelCase)
function normalizeComment(raw: Record<string, unknown>): PostComment {
  return {
    id: Number(raw.id ?? raw.commentId ?? 0),
    userId: Number(raw.userId ?? raw.user_id ?? 0),
    postId: Number(raw.postId ?? raw.post_id ?? 0),
    parentId:
      raw.parentId !== undefined && raw.parentId !== null
        ? Number(raw.parentId)
        : raw.parent_id !== undefined && raw.parent_id !== null
          ? Number(raw.parent_id)
          : null,
    content: String(raw.content ?? ''),
    likeCount: Number(raw.likeCount ?? raw.like_count ?? 0),
    isDeleted: Boolean(raw.isDeleted ?? raw.is_deleted ?? false),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
    updatedAt: String(raw.updatedAt ?? raw.updated_at ?? ''),
    nickname: raw.nickname != null ? String(raw.nickname) : undefined,
    profileImageUrl:
      raw.profileImageUrl != null
        ? String(raw.profileImageUrl)
        : raw.profile_image_url != null
          ? String(raw.profile_image_url)
          : undefined,
  }
}

// 커뮤니티 게시글 댓글 생성
export async function postPostComment(
  postId: string,
  data: PostCommentCreateRequest,
): Promise<PostComment> {
  const res = await apiClient.post<ApiResponse<Record<string, unknown>>>(
    `/api/v2/posts/${postId}/comments`,
    data,
  )
  return normalizeComment(res.data.data ?? {})
}

// 커뮤니티 게시글 댓글 수정
export async function putPatchPostComment(
  commentId: number,
  data: PostCommentUpdateRequest,
): Promise<PostComment> {
  const res = await apiClient.patch<ApiResponse<PostComment>>(
    `/api/v2/comments/${commentId}`,
    data,
  )
  return res.data.data
}

// 커뮤니티 게시글 댓글 삭제
export async function deletePostComment(commentId: number): Promise<void> {
  await apiClient.delete(`/api/v2/comments/${commentId}`)
}
