export type BookmarkTargetType =
  | 'CLUB'
  | 'INTERVIEW_REVIEW'
  | 'ACTIVITY_REVIEW'
  | 'BLOG_REVIEW'

export interface BookmarkToggleRequest {
  targetId: number
  type: BookmarkTargetType
}

export interface BookmarkToggleData {
  isBookmarked: boolean
  type: BookmarkTargetType
  targetId: number
}
