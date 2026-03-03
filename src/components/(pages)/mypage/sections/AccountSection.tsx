import React from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { cn } from '@/shared/utils/cn'
import { FormRow, SectionShell, ToggleSwitch } from './SectionPrimitives'
import { WithdrawEntryAction } from './WithdrawEntryAction'

interface AccountSectionProps {
  isDesktop: boolean
  name: string
  subscriptionEmail: string
  emailNotifications: boolean
  isUpdating: boolean
  showEmailActions: boolean
  emailErrorMessage: string | null
  onChangeEmail: (value: string) => void
  onCancelEmail: () => void
  onSaveEmail: () => void
  onToggleNotifications: (next: boolean) => void
  onLogout: () => void
  onOpenWithdraw: () => void
}

export function AccountSection({
  isDesktop,
  name,
  subscriptionEmail,
  emailNotifications,
  isUpdating,
  showEmailActions,
  emailErrorMessage,
  onChangeEmail,
  onCancelEmail,
  onSaveEmail,
  onToggleNotifications,
  onLogout,
  onOpenWithdraw,
}: AccountSectionProps) {
  return (
    <SectionShell title="계정 관리" isDesktop={isDesktop} bodyClassName="pt-5">
      <div className="flex flex-col gap-8">
        <FormRow label="이름" isDesktop={isDesktop}>
          <Input
            value={name}
            readOnly
            disabled
            className="h-[47px]"
            placeholder="이름"
          />
        </FormRow>

        <FormRow label="소식받을 이메일" isDesktop={isDesktop} alignTop>
          <div className="flex flex-col gap-3 w-full">
            <Input
              value={subscriptionEmail}
              placeholder="알림을 받을 이메일을 입력해주세요"
              disabled={isUpdating}
              onChange={(event) => onChangeEmail(event.target.value)}
              className={cn('h-[47px]', showEmailActions && 'border-main-color-1')}
            />

            {showEmailActions && (
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outlined-primary"
                  size="small"
                  className="w-[77px]"
                  onClick={onCancelEmail}
                  disabled={isUpdating}
                >
                  취소
                </Button>
                <Button
                  variant="outlined-primary"
                  size="small"
                  className="w-[77px] border-main-color-1 text-main-color-1 bg-main-color-3 hover:bg-main-color-3"
                  onClick={onSaveEmail}
                  disabled={isUpdating}
                >
                  저장
                </Button>
              </div>
            )}

            {emailErrorMessage && (
              <p className="typo-caption-1 text-failure-color">{emailErrorMessage}</p>
            )}
          </div>
        </FormRow>

        <FormRow label="이메일 알림 여부" isDesktop={isDesktop}>
          <ToggleSwitch
            checked={emailNotifications}
            onChange={onToggleNotifications}
          />
        </FormRow>

        <div className="flex justify-end gap-2">
          <WithdrawEntryAction onOpen={onOpenWithdraw} />
          <Button
            variant="none"
            className="h-[27px] px-4 rounded-[100px] bg-light-color-3 text-white-color typo-caption-1"
            onClick={onLogout}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </SectionShell>
  )
}
