'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/atoms/checkItem/button'
import MobileMultiDropdown, {
  type MobileMultiDropdownTab,
} from '@/components/molecules/multiDropDown/MobileMultiDropdown'
import type { Group } from '@/components/molecules/multiDropDown/MultiDropDown'
import type { TabOption } from '@/components/molecules/tab/Tab'
import { cn } from '@/shared/utils/cn'

function summarize(labels: string[], maxShown = 1, empty = '선택') {
  if (labels.length === 0) return empty
  if (labels.length <= maxShown) return labels.join(',')
  return `${labels.slice(0, maxShown).join(',')} 외 ${labels.length - maxShown}`
}

type MobileFilterBarProps = {
  tabs: MobileMultiDropdownTab[]
  onReset?: () => void
}

export default function MobileFilterBar({
  tabs,
  onReset,
}: MobileFilterBarProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<string | undefined>(
    undefined,
  )

  const valueToLabelMaps = React.useMemo(() => {
    const maps: Record<string, Map<string, string>> = {}
    tabs.forEach((tab) => {
      if (tab.type === 'multi') {
        const map = new Map<string, string>()
        ;(tab.options as Group[]).forEach((group) => {
          group.options.forEach((option: { value: string; label: string }) => {
            map.set(option.value, option.label)
          })
        })
        maps[tab.id] = map
      }
    })
    return maps
  }, [tabs])

  const buttonLabels = React.useMemo(() => {
    const labels: Record<string, string> = {}
    tabs.forEach((tab) => {
      if (tab.type === 'sort') {
        if (tab.value === tab.defaultValue) {
          labels[tab.id] = tab.label
        } else {
          const option = (tab.options as TabOption[]).find(
            (o) => o.value === tab.value,
          )
          labels[tab.id] = option?.label || tab.label
        }
      } else {
        const valueArray = tab.value as string[]
        if (valueArray.length === 0) {
          labels[tab.id] = tab.label
        } else if (valueArray.includes('all')) {
          labels[tab.id] = '전체'
        } else {
          const map = valueToLabelMaps[tab.id]
          const labelArray = valueArray.map((v) => map?.get(v) || v)
          labels[tab.id] = summarize(labelArray, 1, tab.label)
        }
      }
    })
    return labels
  }, [tabs, valueToLabelMaps])

  const hasSelected = React.useMemo(() => {
    const selected: Record<string, boolean> = {}
    tabs.forEach((tab) => {
      if (tab.type === 'sort') {
        selected[tab.id] = tab.value !== tab.defaultValue
      } else {
        selected[tab.id] = (tab.value as string[]).length > 0
      }
    })
    return selected
  }, [tabs])

  const handleButtonClick = React.useCallback((tabId: string) => {
    setActiveTab(tabId)
    setDrawerOpen(true)
  }, [])

  return (
    <>
      <div className="flex items-center gap-2 flex-nowrap overflow-x-auto w-full">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => handleButtonClick(tab.id)}
            className={cn(
              'justify-between border py-2 px-3 rounded-full gap-1 typo-button-m shrink-0',
              hasSelected[tab.id]
                ? 'bg-main-color-3 border-main-color-1 text-main-color-1'
                : 'border-light-color-3 bg-light-color-2 text-black-color',
            )}
          >
            {buttonLabels[tab.id]}
            <ChevronDown
              className={cn(
                'typo-button-m',
                hasSelected[tab.id] ? 'text-main-color-1' : 'text-grey-color-2',
              )}
            />
          </Button>
        ))}
      </div>
      <MobileMultiDropdown
        tabs={tabs}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        defaultTab={activeTab}
        onReset={onReset}
      />
    </>
  )
}
