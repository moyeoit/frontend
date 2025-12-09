import type { SideOption } from '@/components/atoms/sideBar/Sidebar'

export const CATEGORY_OPTIONS: SideOption[] = [
  { label: '전체', value: 'all' },
  { label: '기획', value: '기획' },
  { label: '디자인', value: '디자인' },
  { label: '개발', value: '개발' },
]
export const HERO_IMAGES = {
  all: '/images/heroAll.svg',
} as const
