import {
  PopularReviewCardRoot,
  PopularReviewCardTag,
  PopularReviewCardProfile,
  PopularReviewCardContent,
  PopularReviewCardLink,
} from './popularReviewCard'

export type PopularReviewCardCompound = typeof PopularReviewCardRoot & {
  Tag: typeof PopularReviewCardTag
  Profile: typeof PopularReviewCardProfile
  Content: typeof PopularReviewCardContent
  Link: typeof PopularReviewCardLink
}

export const PopularReviewCard = Object.assign(PopularReviewCardRoot, {
  Tag: PopularReviewCardTag,
  Profile: PopularReviewCardProfile,
  Content: PopularReviewCardContent,
  Link: PopularReviewCardLink,
}) as PopularReviewCardCompound

export {
  PopularReviewCardRoot,
  PopularReviewCardTag,
  PopularReviewCardProfile,
  PopularReviewCardContent,
  PopularReviewCardLink,
}

export type {
  PopularReviewCardRootProps,
  PopularReviewCardTagProps,
  PopularReviewCardProfileProps,
  PopularReviewCardContentProps,
  PopularReviewCardLinkProps,
} from './popularReviewCard'
