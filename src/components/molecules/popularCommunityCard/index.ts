import { CommunityCardMeta } from '@/components/molecules/communityCard'
import {
  PopularCommunityCard as PopularCommunityCardRoot,
  PopularCommunityCardTitle,
  PopularCommunityCardDescription,
} from './PopularCommunityCard'

export type PopularCommunityCardCompound = typeof PopularCommunityCardRoot & {
  Title: typeof PopularCommunityCardTitle
  Description: typeof PopularCommunityCardDescription
  Meta: typeof CommunityCardMeta
}

export const PopularCommunityCard = Object.assign(PopularCommunityCardRoot, {
  Title: PopularCommunityCardTitle,
  Description: PopularCommunityCardDescription,
  Meta: CommunityCardMeta,
}) as PopularCommunityCardCompound

export type { PopularCommunityCardProps } from './PopularCommunityCard'

export { PopularCommunityCardTitle, PopularCommunityCardDescription }

export { default as PopularCommunityCardOverlay } from './PopularCommunityCardOverlay'
export type { PopularCommunityCardOverlayProps } from './PopularCommunityCardOverlay'
