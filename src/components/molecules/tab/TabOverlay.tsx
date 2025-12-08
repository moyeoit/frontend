'use client'

import * as React from 'react'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import MobileTab from './MobileTab'
import { Tab, type TabOption } from './Tab'

export type TabOverlayProps = {
  options?: TabOption[]
  value?: Tab
  defaultValue?: Tab
  onChange?: (value: Tab) => void
  className?: string
  // Mobile only
  trigger?: React.ReactNode
  onReset?: () => void
}

export default function TabOverlay({
  options,
  value,
  defaultValue,
  onChange,
  className,
  trigger,
  onReset,
}: TabOverlayProps) {
  const { isDesktop } = useMediaQuery()

  return isDesktop ? (
    <Tab
      options={options}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className={className}
    />
  ) : (
    <MobileTab
      options={options}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className={className}
      trigger={trigger}
      onReset={onReset}
    />
  )
}
