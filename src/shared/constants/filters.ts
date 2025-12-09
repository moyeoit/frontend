import type { Group } from '@/components/molecules/multiDropDown/MultiDropDown'
import type { TabOption } from '@/components/molecules/tab/Tab'

export const SORT_OPTIONS: TabOption[] = [
  { label: '마감순', value: '마감순' },
  { label: '이름순', value: '이름순' },
  { label: '인기순', value: '인기순' },
]

export const PART_OPTIONS: Group[] = [
  {
    title: '전체',
    options: [{ label: '전체', value: 'all' }],
  },
  {
    title: '기획',
    options: [{ label: 'PM/PO', value: 'PM/PO' }],
  },
  {
    title: '디자인',
    options: [{ label: '프로덕트 디자이너', value: '프로덕트 디자이너' }],
  },
  {
    title: '개발자',
    options: [
      { label: '백엔드 개발자', value: '백엔드 개발자' },
      { label: '프론트엔드 개발자', value: '프론트엔드 개발자' },
      { label: '안드로이드 개발자', value: '안드로이드 개발자' },
      { label: 'iOS 개발자', value: 'iOS 개발자' },
    ],
  },
]

export const WAY_OPTIONS: Group[] = [
  {
    title: '활동 방식',
    options: [
      { label: '전체', value: 'all' },
      { label: '온라인', value: '온라인' },
      { label: '오프라인', value: '오프라인' },
    ],
  },
]

export const TARGET_OPTIONS: Group[] = [
  {
    title: '모집 대상',
    options: [
      { label: '전체', value: 'all' },
      { label: '대학생', value: '대학생' },
      { label: '직장인', value: '직장인' },
    ],
  },
]
