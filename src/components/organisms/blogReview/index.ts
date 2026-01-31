import {
  BlogReviewRoot,
  BlogReviewThumbnail,
  BlogReviewTags,
  BlogReviewTitle,
  BlogReviewDescription,
  BlogReviewBlogName,
  BlogReviewBookmarkButton,
} from './BlogReview'

export type { BlogReviewData, BlogReviewProps } from './BlogReview'

export const BlogReview = Object.assign(BlogReviewRoot, {
  Thumbnail: BlogReviewThumbnail,
  Tags: BlogReviewTags,
  Title: BlogReviewTitle,
  Description: BlogReviewDescription,
  BlogName: BlogReviewBlogName,
  BookmarkButton: BlogReviewBookmarkButton,
})

export default BlogReview
