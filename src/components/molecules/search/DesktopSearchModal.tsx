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

export interface DesktopSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DesktopSearchModal({
  open,
  onOpenChange,
}: DesktopSearchModalProps) {
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
        className="w-full rounded-2xl border border-light-color-4 bg-white-color p-0 px-5 py-14 shadow-lg top-24 translate-y-0"
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

export default DesktopSearchModal
