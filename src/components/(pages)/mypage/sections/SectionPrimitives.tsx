import React from 'react'
import { cn } from '@/shared/utils/cn'

export function SectionShell({
  title,
  description,
  isDesktop,
  children,
  className,
  bodyClassName,
}: {
  title: string
  description?: string
  isDesktop: boolean
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div className={cn('bg-white-color rounded-2xl', className)}>
      <div
        className={cn(
          'border-b border-light-color-2',
          isDesktop ? 'px-[30px] py-[24px]' : 'px-5 py-6',
        )}
      >
        <div className="flex flex-col gap-1">
          <h2 className="typo-body-1-2-sb text-black-color">{title}</h2>
          {description && (
            <p
              className={cn(
                isDesktop ? 'typo-caption-2' : 'typo-caption-1',
                'text-grey-color-1',
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <div
        className={cn(
          isDesktop ? 'px-[30px] py-[40px]' : 'px-5 py-6',
          bodyClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function FormRow({
  label,
  isDesktop,
  children,
  alignTop = false,
}: {
  label: string
  isDesktop: boolean
  children: React.ReactNode
  alignTop?: boolean
}) {
  return (
    <div
      className={cn(
        'flex',
        isDesktop ? 'gap-12' : 'flex-col gap-2',
        alignTop ? 'items-start' : 'items-center',
      )}
    >
      <p
        className={cn(
          'typo-body-3-b text-black-color',
          isDesktop ? 'w-[220px]' : 'w-full',
        )}
      >
        {label}
      </p>
      <div className={cn(isDesktop ? 'flex-1' : 'w-full')}>{children}</div>
    </div>
  )
}

export function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative flex items-center w-[39px] h-[24px] rounded-full transition-colors',
        checked ? 'bg-[#0066FF]' : 'bg-light-color-3',
      )}
    >
      <span
        className={cn(
          'absolute size-[18px] rounded-full bg-white-color transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  )
}
