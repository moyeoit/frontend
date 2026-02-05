export const communityKeys = {
  all: () => ['community'] as const,
  posts: () => [...communityKeys.all(), 'posts'] as const,
  post: (params?: {
    categoryName?: string
    page?: number
    size?: number
    sort?: string
  }) => [...communityKeys.posts(), params ?? {}] as const,
  popular: () => [...communityKeys.all(), 'popular'] as const,
  popularPosts: (params?: { page?: number; size?: number; sort?: string }) =>
    [...communityKeys.popular(), params ?? {}] as const,
  // 게시글 상세 조회
  postDetails: () => [...communityKeys.all(), 'post-details'] as const,
  postDetail: (postId: string) =>
    [...communityKeys.postDetails(), postId] as const,
  // 댓글
  commentLists: () => [...communityKeys.all(), 'comments'] as const,
  commentList: (postId: string) =>
    [...communityKeys.commentLists(), postId] as const,
} as const

export type CommunityKeys = typeof communityKeys
