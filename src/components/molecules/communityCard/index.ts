import {
  CommunityCard as CommunityCardRoot,
  CommunityCardContent,
  CommunityCardDescription,
  CommunityCardImage,
  CommunityCardMeta,
  CommunityCardTitle,
} from './communityCard'

export type CommunityCardCompound = typeof CommunityCardRoot & {
  Content: typeof CommunityCardContent
  Title: typeof CommunityCardTitle
  Description: typeof CommunityCardDescription
  Image: typeof CommunityCardImage
  Meta: typeof CommunityCardMeta
}

export const CommunityCard = Object.assign(CommunityCardRoot, {
  Content: CommunityCardContent,
  Title: CommunityCardTitle,
  Description: CommunityCardDescription,
  Image: CommunityCardImage,
  Meta: CommunityCardMeta,
}) as CommunityCardCompound

export {
  CommunityCardContent,
  CommunityCardTitle,
  CommunityCardDescription,
  CommunityCardImage,
  CommunityCardMeta,
}
