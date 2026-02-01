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
} as const

export type CommunityKeys = typeof communityKeys
