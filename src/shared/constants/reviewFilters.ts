import type { SideOption } from '@/components/atoms/sideBar/Sidebar'
import type { Group } from '@/components/molecules/multiDropDown/MultiDropDown'
import type { TabOption } from '@/components/molecules/tab/Tab'

export const REVIEW_CATEGORY_OPTIONS: SideOption[] = [
  { label: '전체', value: 'all' },
  { label: '서류/면접 후기', value: 'DOCUMENT' },
  { label: '활동 후기', value: 'ACTIVITY' },
  { label: '블로그 후기', value: 'BLOG' },
]

export const REVIEW_SORT_OPTIONS: TabOption[] = [
  { label: '인기순', value: '인기순' },
  { label: '최신순', value: '최신순' },
]

export const RESULT_FILTER_OPTIONS: Group[] = [
  {
    title: '결과',
    options: [
      { label: '전체', value: 'all' },
      { label: '합격', value: 'PASS' },
      { label: '불합격', value: 'FAIL' },
      { label: '대기', value: 'READY' },
    ],
  },
]
