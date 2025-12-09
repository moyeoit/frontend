'use client'

import * as React from 'react'
import { Button as ActionButton } from '@/components/atoms/Button'
import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import { CheckItem } from '@/components/atoms/checkItem'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from '@/components/molecules/drawer'
import type { TabOption } from '@/components/molecules/tab/Tab'
import type { Group } from './MultiDropDown'

export type MobileMultiDropdownTab = {
  id: string
  label: string
  type: 'sort' | 'multi'
  options: TabOption[] | Group[]
  value: string | string[]
  defaultValue?: string | string[]
  onChange: (value: string | string[]) => void
  onReset?: () => void
}

export type MobileMultiDropdownProps = {
  tabs: MobileMultiDropdownTab[]
  onReset?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultTab?: string
  className?: string
}

export default function MobileMultiDropdown({
  tabs,
  onReset,
  open: controlledOpen,
  onOpenChange,
  defaultTab,
}: MobileMultiDropdownProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange],
  )

  const [activeTab, setActiveTab] = React.useState<string>(
    defaultTab || tabs[0]?.id || '',
  )

  const [tempValues, setTempValues] = React.useState<
    Record<string, string | string[]>
  >(() => {
    const initial: Record<string, string | string[]> = {}
    tabs.forEach((tab) => {
      initial[tab.id] = tab.defaultValue ?? tab.value
    })
    return initial
  })

  const tabsValuesKey = React.useMemo(
    () => tabs.map((tab) => `${tab.id}:${JSON.stringify(tab.value)}`).join('|'),
    [tabs],
  )

  const prevOpenRef = React.useRef(false)

  React.useEffect(() => {
    const isOpening = open && !prevOpenRef.current
    prevOpenRef.current = open

    if (isOpening) {
      const currentValues: Record<string, string | string[]> = {}
      tabs.forEach((tab) => {
        currentValues[tab.id] = tab.value
      })
      setTempValues(currentValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tabsValuesKey])

  const allOptionsMap = React.useMemo(() => {
    const map: Record<string, string[]> = {}
    tabs.forEach((tab) => {
      if (tab.type === 'multi') {
        const groups = tab.options as Group[]
        map[tab.id] = groups
          .flatMap((g) => g.options.map((o) => o.value))
          .filter((v) => v !== 'all')
      }
    })
    return map
  }, [tabs])

  const toggleMulti = React.useCallback(
    (tabId: string, val: string, next: boolean) => {
      const allOptions = allOptionsMap[tabId] || []

      setTempValues((prev) => {
        const current = (prev[tabId] as string[]) || []

        if (val === 'all' && next) {
          return {
            ...prev,
            [tabId]: [...allOptions, 'all'],
          }
        }

        if (val === 'all' && !next) {
          return {
            ...prev,
            [tabId]: [],
          }
        }

        const isSelecting = next
        let newSelected: string[]

        if (isSelecting) {
          newSelected = [...current.filter((v) => v !== 'all'), val]
        } else {
          newSelected = current.filter((v) => v !== val && v !== 'all')
        }

        const allSelected = newSelected.length === allOptions.length
        if (allSelected) {
          newSelected.push('all')
        }

        return {
          ...prev,
          [tabId]: newSelected,
        }
      })
    },
    [allOptionsMap],
  )

  const handleReset = React.useCallback(() => {
    const resetValues: Record<string, string | string[]> = {}
    tabs.forEach((tab) => {
      const defaultValue = tab.defaultValue ?? (tab.type === 'sort' ? '' : [])
      resetValues[tab.id] = defaultValue
      tab.onReset?.()
    })
    setTempValues(resetValues)
    onReset?.()
  }, [tabs, onReset])

  const handleApply = React.useCallback(() => {
    const currentTab = tabs.find((tab) => tab.id === activeTab)
    if (currentTab) {
      const currentValue = tempValues[currentTab.id]
      if (currentValue !== undefined) {
        currentTab.onChange(currentValue)
      }
    }
    setOpen(false)
  }, [tabs, tempValues, activeTab, setOpen])

  React.useEffect(() => {
    if (open && defaultTab) {
      setActiveTab(defaultTab)
    }
  }, [open, defaultTab])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="w-full rounded-t-2xl bg-white-color border-none mt-2 mb-4">
        <div className="bg-[#d9d9d9] rounded-full mx-auto h-[6px] w-10 shrink-0 mb-5" />

        <DrawerHeader className="px-0">
          <div className="w-full px-5">
            <UnderLineTab
              tabs={tabs.map((tab) => ({
                value: tab.id,
                label: tab.label,
                content: (
                  <div className="flex flex-col gap-6 py-4 w-full">
                    {tab.type === 'sort' ? (
                      <>
                        {([...(tab.options as TabOption[])] as TabOption[])
                          .reverse()
                          .map((option) => {
                            const isChecked =
                              tempValues[tab.id] === option.value
                            return (
                              <div
                                key={option.value}
                                className="flex flex-row items-center gap-6 w-full text-left"
                              >
                                <CheckItem
                                  label={option.label}
                                  checked={isChecked}
                                  onChange={(checked) => {
                                    if (checked) {
                                      setTempValues((prev) => ({
                                        ...prev,
                                        [tab.id]: option.value,
                                      }))
                                    }
                                  }}
                                  className="typo-body-3-2-m"
                                />
                              </div>
                            )
                          })}
                      </>
                    ) : (
                      <>
                        {(tab.options as Group[]).map((group) => (
                          <div
                            key={group.title || 'default'}
                            className="space-y-4"
                          >
                            {group.title && tab.id === 'part' && (
                              <div className="text-grey-color-4 typo-caption-1 text-left">
                                {group.title}
                              </div>
                            )}
                            <div className="space-y-4">
                              {group.options.map((option) => {
                                const current =
                                  (tempValues[tab.id] as string[]) || []
                                const allOptions = allOptionsMap[tab.id] || []
                                const isChecked =
                                  option.value === 'all'
                                    ? current.includes('all')
                                    : current.includes(option.value) ||
                                      (current.includes('all') &&
                                        allOptions.includes(option.value))
                                return (
                                  <div
                                    key={option.value}
                                    className="flex flex-row items-center gap-6 w-full text-left"
                                  >
                                    <CheckItem
                                      label={option.label}
                                      checked={isChecked}
                                      onChange={(checked) =>
                                        toggleMulti(
                                          tab.id,
                                          option.value,
                                          checked as boolean,
                                        )
                                      }
                                      className="typo-body-3-2-m"
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ),
              }))}
              value={activeTab}
              onValueChange={setActiveTab}
              defaultValue={defaultTab || tabs[0]?.id || ''}
              className="w-full"
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
