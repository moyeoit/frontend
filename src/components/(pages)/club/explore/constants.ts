import type { TabOption } from '@/components/molecules/tab/Tab'

export type ExploreSort = '인기순' | '이름순'

export type ExplorePopupStorageState =
  | 'eligible'
  | 'session-dismissed'
  | 'never-show'

export const CLUB_EXPLORE_SORT_OPTIONS: TabOption[] = [
  { label: '이름순', value: '이름순' },
  { label: '인기순', value: '인기순' },
]

export const CLUB_EXPLORE_POPUP_STORAGE_PREFIX = 'club-explore-email-prompt'
