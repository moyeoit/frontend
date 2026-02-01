import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'
import { Badge } from './badge'

export type TagKind =
  | 'premiumReview'
  | 'generalReview'
  | 'clubDetail'
  | 'blogReview'
export type TagSize = 'small' | 'large' | 'none'
export type TagColor = 'white' | 'lightPurple' | 'purple'

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  label?: string | null
  kind?: TagKind
  color?: TagColor
  map?: Record<string, { className?: string; display?: string }>
}

const tagVariants = cva(['inline-flex items-center justify-center'].join(' '), {
  variants: {
    size: {
      small: 'px-2 py-[2px] rounded-[40px] typo-caption-2',
      large: 'px-3 py-1 rounded-[40px] typo-body-3-b',
      none: 'p-0 m-0',
    },
  },
  defaultVariants: {
    size: 'large',
  },
})

/** 프리미엄 리뷰 - 카테고리별 색상 */
type Category = '기획' | '개발' | '디자인'
const CATEGORY_STYLE: Record<Category, string> = {
  기획: 'bg-[#FE90FF]/20 text-[#FE90FF]',
  개발: 'bg-[#35DDFF]/20 text-[#35BCFF]',
  디자인: 'bg-[#F7F669]/30 text-[#FFA64E]',
}

/** 파트별 색상 스타일 */
type PartType =
  | 'PM/PO'
  | '프로덕트 디자이너'
  | '백엔드 개발자'
  | '프론트엔드 개발자'
  | '안드로이드 개발자'
  | 'iOS 개발자'

const PART_STYLE: Record<PartType, string> = {
  'PM/PO': 'bg-[#FE90FF]/20 text-[#FE90FF]',
  '프로덕트 디자이너': 'bg-[#F7F669]/30 text-[#FFA64E]',
  '백엔드 개발자': 'bg-[#35DDFF]/20 text-[#35BCFF]',
  '프론트엔드 개발자': 'bg-[#35DDFF]/20 text-[#35BCFF]',
  '안드로이드 개발자': 'bg-[#35DDFF]/20 text-[#35BCFF]',
  'iOS 개발자': 'bg-[#35DDFF]/20 text-[#35BCFF]',
}

/** 프리미엄 기타 */
const PREMIUM_ETC = 'bg-light-color-3 text-grey-color-3'

/** 동아리 상세  */
const CLUB_DETAIL: Record<TagColor, string> = {
  white: 'bg-white-color text-black-color',
  lightPurple: 'bg-main-color-3 text-main-color-1',
  purple: 'bg-main-color-1 text-white-color',
}

export const Tag: React.FC<TagProps> = ({
  label,
  kind = 'generalReview',
  size,
  color = 'white',
  className,
}) => {
  const display = (label ?? '').toString() || '—'

  let colorCls = ''
  if (kind === 'premiumReview') {
    if (display === '기획' || display === '개발' || display === '디자인') {
      colorCls = CATEGORY_STYLE[display as '기획' | '개발' | '디자인']
    } else {
      colorCls = PREMIUM_ETC
    }
  } else if (kind === 'blogReview') {
    // 블로그 리뷰 - 파트별 색상 적용
    if (display in PART_STYLE) {
      colorCls = PART_STYLE[display as PartType]
    } else {
      colorCls = PREMIUM_ETC
    }
  } else {
    colorCls = CLUB_DETAIL[color]
  }

  return (
    <Badge
      className={cn(tagVariants({ size }), colorCls, className)}
      title={display}
    >
      {display}
    </Badge>
  )
}
