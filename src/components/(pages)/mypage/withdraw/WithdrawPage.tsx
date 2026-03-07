'use client'

import React, { useMemo, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/Select'
import { Textarea } from '@/components/atoms/Textarea'
import { Checkbox } from '@/components/atoms/checkbox'
import {
  WithdrawFormState,
  WithdrawalReason,
  WITHDRAWAL_REASON_OPTIONS,
} from './types'

const WITHDRAW_NOTICE = [
  "탈퇴 시 '모여잇'을 통해 등록한 서비스의 모든 정보가 영구적으로 삭제되며, 복구가 불가능합니다.",
  "탈퇴 시 '모여잇 지원 이메일'을 통해 진행 된 모든 이메일 알림이 자동 취소됩니다.",
]

export default function WithdrawPage() {
  const [form, setForm] = useState<WithdrawFormState>({
    reason: undefined,
    feedback: '',
    agreed: false,
  })

  const isSubmitEnabled = useMemo(() => Boolean(form.reason), [form.reason])

  const handleSubmit = () => {
    alert('회원탈퇴 API 연동 예정입니다.')
  }

  return (
    <div className="w-full bg-light-color-2">
      <section className="max-w-[680px] mx-auto px-5 pt-10 pb-12 md:pt-20 md:pb-16">
        <h1 className="typo-title-1-3-m text-black-color text-center md:mb-14 mb-8">
          회원 탈퇴
        </h1>

        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-2">
            <p className="typo-button-m text-grey-color-4">탈퇴시 주의사항</p>
            <div className="rounded-lg border border-light-color-4 bg-white-color px-3 py-2">
              <ul className="list-disc pl-5 space-y-1 typo-body-3-3-r text-black-color">
                {WITHDRAW_NOTICE.map((notice) => (
                  <li key={notice}>{notice}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="typo-button-m text-grey-color-4">
              모여잇 계정을 삭제하고자 하는 이유는 무엇인가요?
              <span className="text-failure-color ml-1">*</span>
            </p>
            <Select
              value={form.reason}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  reason: value as WithdrawalReason,
                }))
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="탈퇴 사유를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {WITHDRAWAL_REASON_OPTIONS.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <p className="typo-button-m text-grey-color-4">
              더 나은 서비스 제공을 위해 모여잇의 보완이 필요한 지점을 제안해
              주세요.
            </p>
            <Textarea
              value={form.feedback}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, feedback: event.target.value }))
              }
              className="h-[116px] md:h-[171px] px-3 py-3"
              placeholder={[
                '모여잇을 이용하시면서 가장 불편했거나 아쉬웠던 점은 무엇인가요?',
                '어떤 기능이 추가된다면 모여잇을 더 자주 이용하게 될까요?',
                '모여잇에서 기대와 달랐던 부분이 있다면 자유롭게 들려주세요.',
              ].join('\n')}
            />
          </div>

          <div className="pt-8 md:pt-10">
            <div className="border-b border-light-color-4 pb-3">
              <p className="typo-caption-1 text-black-color">탈퇴 동의</p>
            </div>
            <label className="mt-3 flex items-start gap-2 cursor-pointer">
              <Checkbox
                checked={form.agreed}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, agreed: Boolean(checked) }))
                }
                className="h-5 w-5 rounded-[3px] border-[1.5px] border-light-color-4 mt-[2px]"
              />
              <span className="typo-caption-1 text-grey-color-3">
                회원 탈퇴를 진행하여 ‘모여잇’ 계정에 귀속된 모든 정보를 삭제하는
                데 동의합니다.
              </span>
            </label>
          </div>

          <Button
            variant="solid"
            size="medium"
            className="h-[47px] w-full"
            disabled={!isSubmitEnabled}
            onClick={handleSubmit}
          >
            탈퇴하기
          </Button>
        </div>
      </section>
    </div>
  )
}
