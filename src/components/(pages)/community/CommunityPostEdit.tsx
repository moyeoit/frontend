'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ImageIcon, X } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
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
  usePostDetail,
  usePatchPost,
  CATEGORY_MAP,
  PostImage,
} from '@/features/community'
import { useUploadFile } from '@/features/file'
import AppPath from '@/shared/configs/appPath'
import { cn } from '@/shared/utils/cn'

const TITLE_MAX_LENGTH = 60
const IMAGE_MAX_COUNT = 10

const CATEGORIES = [
  { value: 'free', label: '자유' },
  { value: 'it-club', label: 'IT 동아리' },
  { value: 'university', label: '대학생활' },
  { value: 'work', label: '직장생활' },
  { value: 'career', label: '이직/커리어' },
  { value: 'job-prep', label: '취업준비' },
]

interface UploadedImage {
  file: File
  preview: string
}

interface ExistingImage {
  url: string
  orderIndex: number
}

export default function CommunityPostEdit() {
  const params = useParams()
  const router = useRouter()
  const postId = params?.postId as string | undefined

  if (!postId) notFound()

  const { data: post, isLoading, error } = usePostDetail(postId)
  const { mutate: patchPost, isPending: isSubmitting } = usePatchPost(postId, {
    onSuccess: () => {
      router.push(`/community/post/detail/${postId}`)
    },
  })
  const uploadFileMutation = useUploadFile()

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
      const cat = CATEGORIES.find((c) => c.label === post.categoryName)
      setSelectedCategory(cat?.value ?? '')
      if (post.image_url?.length) {
        setExistingImages(
          post.image_url.map((url, i) => ({ url, orderIndex: i + 1 })),
        )
      }
    }
  }, [post])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const total = existingImages.length + uploadedImages.length
    Array.from(files).forEach((file) => {
      if (total >= IMAGE_MAX_COUNT) return
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
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleImageRemove = (index: number) => {
    setUploadedImages((prev) => {
      const next = [...prev]
      URL.revokeObjectURL(next[index].preview)
      next.splice(index, 1)
      return next
    })
  }

  const handleExistingImageRemove = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!selectedCategory || !title.trim() || !content.trim() || isSubmitting)
      return

    if (!post) return

    try {
      const imageUrls: PostImage[] = []
      existingImages.forEach((img, i) => {
        imageUrls.push({ url: img.url, orderIndex: i + 1 })
      })
      const offset = existingImages.length
      for (let i = 0; i < uploadedImages.length; i++) {
        const result = await uploadFileMutation.mutateAsync(
          uploadedImages[i].file,
        )
        imageUrls.push({ url: result.fileUrl, orderIndex: offset + i + 1 })
      }

      patchPost({
        categoryId: CATEGORY_MAP[selectedCategory],
        title: title.trim(),
        content: content.trim(),
        postType: post.post_type,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      })
    } catch (err) {
      console.error('게시글 수정 실패:', err)
      alert('게시글 수정에 실패했습니다.')
    }
  }

  if (isLoading || !post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="typo-body-2-r text-grey-color-3">로딩 중...</p>
      </div>
    )
  }

  if (error) notFound()

  const totalImages = existingImages.length + uploadedImages.length

  return (
    <div className="fixed inset-0 bg-white-color z-100 overflow-y-auto">
      <header className="border-b border-light-color-4 bg-white-color sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="block">
            <MoyeoitFullLogo
              width={110}
              height={17}
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
            {isSubmitting ? '수정 중...' : '수정 완료'}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <label className="block mb-2 typo-body-3-b text-black-color">
            카테고리 선택(필수)
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex w-fit h-11 items-center justify-between gap-2 whitespace-nowrap rounded-full border px-3 py-3 typo-body-3-3-r transition-colors outline-none',
                  selectedCategory
                    ? 'bg-main-color-3 text-main-color-1 border-main-color-3'
                    : 'bg-white-color text-black-color border-light-color-4 hover:border-grey-color-1',
                )}
              >
                <span className={selectedCategory ? 'text-main-color-1' : ''}>
                  {selectedCategory
                    ? CATEGORIES.find((c) => c.value === selectedCategory)
                        ?.label
                    : '카테고리 선택'}
                </span>
                <ChevronDown className="size-4 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) z-200">
              {CATEGORIES.map((cat) => (
                <DropdownMenuCheckboxItem
                  key={cat.value}
                  checked={selectedCategory === cat.value}
                  onCheckedChange={(checked) =>
                    setSelectedCategory(checked ? cat.value : '')
                  }
                  className="px-3 py-2 pl-8"
                >
                  {cat.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-6">
          <div className="relative flex items-center gap-2 border-b border-light-color-4">
            {post.post_type === 'QUESTION' && (
              <span className="shrink-0 typo-body-1-2-sb text-main-color-1">
                Q.
              </span>
            )}
            <div className="flex-1 min-w-0 [&_input]:text-(length:--text-body-1) [&_input]:font-medium [&_input]:leading-normal">
              <Input
                placeholder="제목을 입력해주세요"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= TITLE_MAX_LENGTH)
                    setTitle(e.target.value)
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
              onClick={() => fileInputRef.current?.click()}
              disabled={totalImages >= IMAGE_MAX_COUNT}
              className="aspect-square bg-light-color-1 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-light-color-2 disabled:opacity-50"
            >
              <ImageIcon className="w-6 h-6 text-grey-color-3" />
              <span className="typo-caption-r text-grey-color-3">
                {totalImages}/{IMAGE_MAX_COUNT}
              </span>
            </button>
            {existingImages.map((img, i) => (
              <div key={`ex-${i}`} className="aspect-square relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleExistingImageRemove(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3 text-white-color" />
                </button>
              </div>
            ))}
            {uploadedImages.map((img, i) => (
              <div key={`up-${i}`} className="aspect-square relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3 text-white-color" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <Textarea
            placeholder="글 내용을 작성해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-100 border-0 rounded-none px-0 resize-none"
          />
        </div>
      </main>
    </div>
  )
}
