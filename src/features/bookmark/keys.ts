export const bookmarkKeys = {
  all: ['bookmark'] as const,
  clubs: () => [...bookmarkKeys.all, 'clubs'] as const,
  reviews: () => [...bookmarkKeys.all, 'reviews'] as const,
} as const
