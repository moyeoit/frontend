'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import VisuallyHidden from '@/components/molecules/a11y/VisuallyHidden'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/molecules/dialog'
import AppPath from '@/shared/configs/appPath'
import useSearchUrlState from '@/shared/hooks/useSearchUrlState'
import SearchCore from './SearchCore'

export interface MobileSearchSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MobileSearchSheet({
  open,
  onOpenChange,
}: MobileSearchSheetProps) {
  const { keyword, setKeyword } = useSearchUrlState()

  const router = useRouter()

  const handleSelect = (clubId: number) => {
    onOpenChange(false)
    router.push(AppPath.clubDetail(clubId.toString()))
  }

  const handleSubmit = (value: string) => {
    onOpenChange(false)
    router.push(`${AppPath.search()}?q=${encodeURIComponent(value)}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        variant="fullscreen"
        className="rounded-none border-0 p-0 pt-6 px-5 pb-10 bg-white-color data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-8 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-8 transition-all duration-300"
      >
        <VisuallyHidden>
          <DialogTitle>검색</DialogTitle>
        </VisuallyHidden>
        <SearchCore
          autoFocus
          placeholder="검색어를 입력해주세요"
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSelect={handleSelect}
          onSubmit={handleSubmit}
          onClose={() => onOpenChange(false)}
          showCloseButton
        />
      </DialogContent>
    </Dialog>
  )
}
