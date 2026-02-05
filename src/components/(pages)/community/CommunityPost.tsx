'use client'

import React, { useState, useRef } from 'react'
import { ChevronDown, ChevronUp, ImageIcon, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { CommunityIcon } from '@/assets/icons'
import { MoyeoitFullLogo } from '@/assets/images'
import { Button } from '@/components/atoms/Button/button'
import { Input } from '@/components/atoms/Input/Input'
import { Textarea } from '@/components/atoms/Textarea/Textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdownMenu/DropdownMenu'
import {
  useCreatePost,
  CATEGORY_MAP,
  PostImage,
  type PostType,
} from '@/features/community'
import { useUploadFile } from '@/features/file'
import { cn } from '@/shared/utils/cn'

const TITLE_MAX_LENGTH = 60
const IMAGE_MAX_COUNT = 10

const ROUTE_POST_TYPES = ['general', 'question'] as const
type RoutePostType = (typeof ROUTE_POST_TYPES)[number]

const ROUTE_TO_API_POST_TYPE: Record<RoutePostType, PostType> = {
  general: 'GENERAL',
  question: 'QUESTION',
}

const CATEGORIES = [
  { value: 'free', label: '자유' },
  { value: 'it-club', label: 'IT 동아리' },
  { value: 'university', label: '대학생활' },
  { value: 'work', label: '직장생활' },
  { value: 'career', label: '이직/커리어' },
  { value: 'job-prep', label: '취업준비' },
]

/** 일반글/질문글별 가이드 섹션 타입 */
interface GuideSection {
  title: string
  items: string[]
}

/** 유형별 설정 - 가이드, placeholder 등 */
const POST_TYPE_CONFIG: Record<
  RoutePostType,
  {
    guideTitle: string
    guideSections: GuideSection[]
    titlePlaceholder: string
    contentPlaceholder: string
    submitButtonText: string
  }
> = {
  general: {
    guideTitle: '커뮤니티 일반글 작성 가이드',
    guideSections: [
      {
        title: '공통 운영 정책',
        items: [
          '운영 정책에 맞지 않거나, 금의 맥락이 불분명한 경우 커뮤니티 매인 노출이 제한될 수 있습니다.',
          '작성된 글로 내부 기준에 따라 운영팀의 의해 판단 또는 비공개 처리될 수 있습니다.',
          '상업적 목적의 글, 명확한 설명 없이 갑작한 표출한 글로 사전 안내 없이 삭제될 수 있습니다.',
        ],
      },
      {
        title: '일반글을 작성할 때는 다음을 지켜주세요',
        items: [
          '정보 공유, 후기, 팁 등에 대한 내용은 되도록 직접 경험 기반으로 작성해주세요.',
          '단, 작성 경험이 아닌 경우에는 출처를 함께 기재해 주세요.',
          '게시글 제목은 내용이 잘 드러나도록 구체적으로 작성해주세요.',
        ],
      },
      {
        title: '이미지 및 파일 업로드',
        items: [
          '장당 20MB 이하의 이미지(JPG, PNG, GIF, WEBP, HEIC 등)만 업로드할 수 있습니다.',
          '글/이미지 작성 시 타인의 저작권을 침해하지 않도록 주의해 주세요.',
        ],
      },
    ],
    titlePlaceholder: '제목을 입력해주세요',
    contentPlaceholder: '글 내용을 작성해주세요',
    submitButtonText: '글 올리기',
  },
  question: {
    guideTitle: '커뮤니티 질문글 작성 가이드',
    guideSections: [
      {
        title: '공통 운영 정책',
        items: [
          '운영 정책에 맞지 않거나, 금의 맥락이 불분명한 경우 커뮤니티 매인 노출이 제한될 수 있습니다.',
          '작성된 글로 내부 기준에 따라 운영팀의 의해 판단 또는 비공개 처리될 수 있습니다.',
          '상업적 목적의 글, 명확한 설명 없이 갑작한 표출한 글로 사전 안내 없이 삭제될 수 있습니다.',
        ],
      },
      {
        title: '질문글을 작성할 때는 다음을 지켜주세요',
        items: [
          '질문의 맥락과 배경을 구체적으로 설명해주세요. (사용 기술, 환경, 시도한 방법 등)',
          '코드나 에러 메시지가 있다면 함께 첨부해주세요.',
          '제목에 질문의 핵심이 드러나도록 작성해주세요.',
        ],
      },
      {
        title: '이미지 및 파일 업로드',
        items: [
          '장당 20MB 이하의 이미지(JPG, PNG, GIF, WEBP, HEIC 등)만 업로드할 수 있습니다.',
          '코드 스니펫이나 에러 로그는 이미지로 첨부 가능합니다.',
        ],
      },
    ],
    titlePlaceholder: '질문 제목을 입력해주세요',
    contentPlaceholder:
      '질문 내용을 구체적으로 작성해주세요. (배경, 시도한 방법, 에러 메시지 등)',
    submitButtonText: '질문 등록',
  },
}

function isValidRoutePostType(
  value: string | undefined,
): value is RoutePostType {
  return (
    value !== undefined && ROUTE_POST_TYPES.includes(value as RoutePostType)
  )
}

interface UploadedImage {
  file: File
  preview: string
}

function CommunityPostGuide({
  postType,
  isOpen,
  onToggle,
}: {
  postType: RoutePostType
  isOpen: boolean
  onToggle: () => void
}) {
  const config = POST_TYPE_CONFIG[postType]

  return (
    <div className="mb-6 w-full min-w-0 bg-light-color-1 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-light-color-2/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CommunityIcon
            className="w-6 h-6 shrink-0"
            role="img"
            aria-label="community"
          />
          <span className="typo-body-2-2-sb text-grey-color-5">
            {config.guideTitle}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-grey-color-3" />
        ) : (
          <ChevronDown className="w-5 h-5 text-grey-color-3" />
        )}
      </button>

      {isOpen && (
        <div className="w-full min-w-0 overflow-hidden px-4 pb-4 pt-0">
          <ul className="space-y-4 list-none p-0 m-0">
            {config.guideSections.map((section) => (
              <li key={section.title} className="min-w-0">
                <p className="typo-body-3-1-sb text-grey-color-5 mb-2 flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>{section.title}</span>
                </p>
                <ul className="space-y-1 list-none pl-4 m-0 break-words text-grey-color-5 typo-body-3-3-r">
                  {section.items.map((item) => (
                    <li key={item} className="flex min-w-0 gap-2">
                      <span className="shrink-0">•</span>
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function CommunityPost() {
  const router = useRouter()
  const params = useParams()
  const postTypeParam = params?.postType as string | undefined

  if (!isValidRoutePostType(postTypeParam)) {
    notFound()
  }

  const postType = postTypeParam
  const apiPostType = ROUTE_TO_API_POST_TYPE[postType]
  const config = POST_TYPE_CONFIG[postType]

  const [isGuideOpen, setIsGuideOpen] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFileMutation = useUploadFile()
  const createPostMutation = useCreatePost({
    onSuccess: () => {
      alert('게시글이 성공적으로 등록되었습니다.')
      router.push('/community')
    },
    onError: (error) => {
      alert('게시글 등록에 실패했습니다.')
      console.error(error)
      setIsSubmitting(false)
    },
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (uploadedImages.length >= IMAGE_MAX_COUNT) return

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }

      if (file.size > 20 * 1024 * 1024) {
        alert('파일 크기는 20MB 이하여야 합니다.')
        return
      }

      const preview = URL.createObjectURL(file)
      setUploadedImages((prev) => [...prev, { file, preview }])
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageRemove = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!selectedCategory || !title.trim() || !content.trim()) return
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const imageUrls: PostImage[] = []

      for (let i = 0; i < uploadedImages.length; i++) {
        const result = await uploadFileMutation.mutateAsync(
          uploadedImages[i].file,
        )
        imageUrls.push({
          url: result.fileUrl,
          orderIndex: i + 1,
        })
      }

      await createPostMutation.mutateAsync({
        categoryId: CATEGORY_MAP[selectedCategory],
        title: title.trim(),
        content: content.trim(),
        postType: apiPostType,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      })
    } catch (error) {
      console.error('Error submitting post:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white-color z-100 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <header className="border-b border-light-color-4 bg-white-color sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="block">
            <MoyeoitFullLogo
              width={132}
              height={20}
              role="img"
              aria-label="moyeoit logo"
            />
          </Link>
          <Button
            variant="solid"
            size="medium"
            disabled={
              !selectedCategory ||
              !title.trim() ||
              !content.trim() ||
              isSubmitting
            }
            onClick={handleSubmit}
          >
            {isSubmitting ? '등록 중...' : config.submitButtonText}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <CommunityPostGuide
          postType={postType}
          isOpen={isGuideOpen}
          onToggle={() => setIsGuideOpen(!isGuideOpen)}
        />

        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex w-1/5 h-11 items-center justify-between gap-2 whitespace-nowrap rounded-full border px-3 py-3 typo-body-3-3-r transition-colors outline-none',
                  selectedCategory
                    ? 'bg-main-color-3 text-main-color-1 hover:bg-main-color-3/90 w-fit'
                    : 'bg-white-color text-black-color border-light-color-4 hover:border-grey-color-1',
                )}
              >
                <span
                  className={
                    selectedCategory ? 'text-main-color-1' : 'text-black-color'
                  }
                >
                  {selectedCategory
                    ? CATEGORIES.find((cat) => cat.value === selectedCategory)
                        ?.label
                    : '카테고리 선택(필수)'}
                </span>
                <ChevronDown
                  className={cn(
                    'size-4',
                    selectedCategory ? 'text-main-color-1' : 'opacity-50',
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) z-200">
              {CATEGORIES.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.value}
                  checked={selectedCategory === category.value}
                  onCheckedChange={(checked) => {
                    setSelectedCategory(checked ? category.value : '')
                  }}
                  className="px-3 py-2 pl-8"
                >
                  {category.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-6">
          <div className="relative flex items-center gap-2 border-b border-light-color-4">
            {postType === 'question' && (
              <span className="shrink-0 typo-body-1-2-sb text-main-color-1">
                Q.
              </span>
            )}
            <div className="flex-1 min-w-0 [&_input]:text-(length:--text-title-1) [&_input]:font-medium [&_input]:leading-normal">
              <Input
                placeholder={config.titlePlaceholder}
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= TITLE_MAX_LENGTH) {
                    setTitle(e.target.value)
                  }
                }}
                className="h-11 w-full pr-16 border-0 border-none rounded-none px-0 focus:border-0 focus-visible:ring-0"
                maxLength={TITLE_MAX_LENGTH}
              />
            </div>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 typo-body-2-3-m text-grey-color-2">
              {title.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />

          <div className="grid grid-cols-8 gap-2">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploadedImages.length >= IMAGE_MAX_COUNT}
              className="aspect-square bg-light-color-1 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-light-color-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ImageIcon className="w-6 h-6 text-grey-color-3" />
              <span className="typo-caption-r text-grey-color-3">
                {uploadedImages.length}/{IMAGE_MAX_COUNT}
              </span>
            </button>

            {uploadedImages.map((image, index) => (
              <div key={index} className="aspect-square relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.preview}
                  alt={`업로드 이미지 ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white-color" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <Textarea
            placeholder={
              selectedCategory
                ? config.contentPlaceholder
                : '카테고리를 먼저 선택해주세요'
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-100 border-0 rounded-none px-0 resize-none"
            disabled={!selectedCategory}
          />
        </div>
      </main>
    </div>
  )
}
