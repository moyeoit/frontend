'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button as ActionButton } from '@/components/atoms/Button'
import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import { CheckItem } from '@/components/atoms/checkItem'
import { Button } from '@/components/atoms/checkItem/button'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from '@/components/molecules/drawer'
import { cn } from '@/shared/utils/cn'
import type { Tab, TabOption } from './Tab'

export type MobileTabProps = {
  options?: TabOption[]
  value?: Tab
  defaultValue?: Tab
  onChange?: (value: Tab) => void
  className?: string
  /**
   * 트리거 버튼으로 사용할 요소
   */
  trigger?: React.ReactNode
  /**
   * 초기화 핸들러 - 기본값으로 리셋
   */
  onReset?: () => void
}

export default function MobileTab({
  options = [],
  value,
  defaultValue,
  onChange,
  className,
  trigger,
  onReset,
}: MobileTabProps) {
  const [open, setOpen] = React.useState(false)
  const isControlled = value !== undefined
  const [inner, setInner] = React.useState<Tab>(
    defaultValue || ('마감순' as Tab),
  )
  const selected = (isControlled ? value : inner) as Tab

  const [tempSelected, setTempSelected] = React.useState<Tab>(selected)

  React.useEffect(() => {
    setTempSelected(selected)
  }, [selected, open])

  const setSelected = React.useCallback(
    (next: Tab) => {
      if (!isControlled) {
        setInner(next)
      }
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  const defaultTabValue = React.useMemo(() => {
    return defaultValue || ('마감순' as Tab)
  }, [defaultValue])

  const hasSelected = selected !== defaultTabValue

  const selectedLabel = React.useMemo(() => {
    if (!hasSelected) return '정렬'
    return options.find((o) => o.value === selected)?.label || '정렬'
  }, [options, selected, hasSelected])

  const handleReset = React.useCallback(() => {
    setTempSelected(defaultTabValue)
    setSelected(defaultTabValue)
    onReset?.()
  }, [setSelected, defaultTabValue, onReset])

  const handleApply = React.useCallback(() => {
    setSelected(tempSelected)
    setOpen(false)
  }, [tempSelected, setSelected])

  const handleOptionChange = React.useCallback(
    (optionValue: Tab, checked: boolean) => {
      if (checked) {
        setTempSelected(optionValue)
      }
    },
    [],
  )

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger || (
          <Button
            className={cn(
              'justify-between border py-2 px-3 rounded-full gap-1',
              hasSelected
                ? 'bg-main-color-3 border-main-color-1 text-main-color-1'
                : 'border-light-color-3 bg-light-color-2 text-black-color',
              className,
            )}
          >
            <span className="typo-button-m">{selectedLabel}</span>
            <span
              className={cn(
                'typo-button-m',
                hasSelected ? 'text-main-color-1' : 'text-grey-color-2',
              )}
            >
              {open ? <ChevronUp /> : <ChevronDown />}
            </span>
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="w-full rounded-t-2xl bg-white-color border-none mt-2 mb-4">
        <div className="bg-[#d9d9d9] rounded-full mx-auto h-[6px] w-10 shrink-0 mb-5" />

        <DrawerHeader className="px-0">
          <div className="w-full px-5">
            <UnderLineTab
              tabs={[
                {
                  value: '정렬',
                  label: '정렬',
                  content: (
                    <div className="flex flex-col gap-6 py-4 w-full">
                      {[...options].reverse().map((option) => {
                        const isChecked = tempSelected === option.value
                        return (
                          <div
                            key={option.value}
                            className="flex flex-row items-center gap-6 w-full text-left"
                          >
                            <CheckItem
                              label={option.label}
                              checked={isChecked}
                              onChange={(checked) =>
                                handleOptionChange(option.value, checked)
                              }
                              className="typo-body-3-2-m"
                            />
                          </div>
                        )
                      })}
                    </div>
                  ),
                },
              ]}
              defaultValue="정렬"
              className="w-full "
            />
          </div>
        </DrawerHeader>

        <DrawerFooter className="flex-row gap-2 px-5 pb-5">
          <ActionButton
            variant="outlined-secondary"
            size="medium"
            onClick={handleReset}
            className="flex-1"
          >
            초기화
          </ActionButton>
          <ActionButton
            variant="solid"
            size="medium"
            onClick={handleApply}
            className="flex-1"
          >
            적용
          </ActionButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
