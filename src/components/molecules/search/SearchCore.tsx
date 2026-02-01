'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DummyProfileIcon, SearchMainIcon, XIcon } from '@/assets/icons'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { clubQueries } from '@/features/clubs/queries.factory'
import useDebouncedValue from '@/shared/hooks/useDebouncedValue'
import { cn } from '@/shared/utils/cn'

export interface SearchCoreProps {
  className?: string
  placeholder?: string
  autoFocus?: boolean
  /**
   * Callback when a result item is selected.
   */
  onSelect?: (clubId: number) => void
  /**
   * Render prop for each result item. If not provided, a simple row is rendered.
   */
  renderItem?: (item: {
    clubId: number
    clubName: string
    imgUrl?: string | null
  }) => React.ReactNode
  /**
   * Optional empty state node to show when there are no results.
   */
  emptyState?: React.ReactNode
  /**
   * Optional controlled keyword. If omitted, internal state is used.
   */
  keyword?: string
  onKeywordChange?: (value: string) => void
  /**
   * Callback when the search input is submitted (Enter).
   */
  onSubmit?: (keyword: string) => void
  /**
   * Callback when the close button is clicked.
   */
  onClose?: () => void
  /**
   * Whether to show the close button next to the search input.
   */
  showCloseButton?: boolean
}

function SearchResultAvatar({
  src,
  alt,
}: {
  src?: string | null
  alt?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <DummyProfileIcon width={32} height={32} role="img" aria-label={alt} />
    )
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className="size-8 rounded-[8px] border border-light-color-3 object-cover"
      onError={() => setFailed(true)}
    />
  )
}

export function SearchCore(props: SearchCoreProps) {
  const {
    className,
    placeholder = '검색어를 입력해주세요',
    autoFocus,
    onSelect,
    renderItem,
    emptyState,
    keyword: controlledKeyword,
    onKeywordChange,
    onSubmit,
    onClose,
    showCloseButton = true,
  } = props
  const [inputValue, setInputValue] = useState(controlledKeyword ?? '')

  useEffect(() => {
    if (controlledKeyword !== undefined && controlledKeyword !== inputValue) {
      setInputValue(controlledKeyword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledKeyword])

  const debouncedInput = useDebouncedValue(inputValue, 300)
  useEffect(() => {
    if (!onKeywordChange) return
    if (controlledKeyword === debouncedInput) return
    onKeywordChange(debouncedInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  const trimmedInput = debouncedInput.trim()
  const { data, isLoading } = useQuery({
    ...clubQueries.list({
      page: 0,
      size: 8,
      search: trimmedInput,
    }),
    enabled: trimmedInput.length > 0,
  })

  const items = data?.content ?? []

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    onSubmit?.(trimmed)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-6 w-full max-w-[675px] mx-auto',
        className,
      )}
    >
      <div className="flex items-center gap-4 w-full">
        <form
          className="flex-1"
          onSubmit={handleSubmit}
          role="search"
          aria-label="search"
        >
          <div className="h-12 rounded-full bg-white-color flex items-center justify-between border border-main-color-1 px-4 py-3">
            <Input
              autoFocus={autoFocus}
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-label="search"
              className="bg-transparent border-none"
            />
            <SearchMainIcon
              width={24}
              height={24}
              role="img"
              aria-label="search"
            />
          </div>
        </form>
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center size-[34px] text-grey-color-4 hover:text-black-color transition-colors"
            aria-label="close"
          >
            <XIcon width={24} height={24} role="img" aria-label="close" />
          </button>
        )}
      </div>

      <div className="desktop:min-h-[340px] max-desktop:max-h-[calc(100vh-200px)] overflow-auto">
        {isLoading ? (
          <div></div>
        ) : items.length === 0 ? (
          (emptyState ?? (
            <div className="flex flex-col gap-2 items-center justify-center">
              <p className="typo-title-3 max-desktop:typo-body-1-b text-grey-color-5 px-1 py-2">
                검색 결과가 없어요
              </p>
              <div className="flex flex-col items-center justify-center mb-4">
                <p className="typo-button-m max-desktop:typo-caption-m text-grey-color-3">
                  찾으시는 IT 동아리가 없나요?
                </p>
                <p className="typo-button-m max-desktop:typo-caption-m text-grey-color-3">
                  요청해주시면 빠르게 확인해드릴게요.
                </p>
              </div>
              <Button
                variant="solid"
                size="small"
                onClick={() => {
                  window.location.href =
                    'https://docs.google.com/forms/d/e/1FAIpQLSc7dWNU-ghxS1Ajwpk4P2VLMj-6wk7ohOF-BsbqvuvcrZGLKw/viewform'
                }}
              >
                <span className="typo-caption-m">IT 동아리 등록 요청</span>
              </Button>
            </div>
          ))
        ) : (
          <ul className="flex flex-col gap-1">
            {items?.map((it) => (
              <li key={it.clubId}>
                <Button
                  variant="none"
                  className="w-full text-left px-3 py-3 justify-start rounded-[8px] hover:bg-light-color-2 focus:bg-light-color-2 transition-colors hover:ring-0 focus:ring-0 focus:outline-none focus:ring-offset-0 [&:hover_.typo-body-3-2-m]:text-black-color [&:focus_.typo-body-3-2-m]:text-black-color"
                  onClick={() => onSelect?.(it.clubId)}
                >
                  {renderItem ? (
                    renderItem({
                      clubId: it.clubId,
                      clubName: it.clubName,
                      imgUrl: it.logoUrl,
                    })
                  ) : (
                    <div className="flex flex-row items-center gap-2">
                      <SearchResultAvatar src={it.logoUrl} alt={it.clubName} />
                      <span className="typo-body-3-2-m text-grey-color-4">
                        {it.clubName}
                      </span>
                    </div>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SearchCore
