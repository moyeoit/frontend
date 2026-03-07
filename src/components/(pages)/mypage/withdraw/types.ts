export type WithdrawalReason =
  | 'NOT_USED_OFTEN'
  | 'NO_LONGER_NEEDED'
  | 'LACK_OF_INFORMATION'
  | 'NOT_ENOUGH_CONTENT'
  | 'HARD_TO_USE'
  | 'PRIVACY_CONCERN'
  | 'USING_OTHER_SERVICE'

export interface WithdrawalReasonOption {
  value: WithdrawalReason
  label: string
}

export interface WithdrawFormState {
  reason?: WithdrawalReason
  feedback: string
  agreed: boolean
}

export const WITHDRAWAL_REASON_OPTIONS: WithdrawalReasonOption[] = [
  { value: 'NOT_USED_OFTEN', label: '자주 사용하지 않아요' },
  { value: 'NO_LONGER_NEEDED', label: '더이상 필요하지 않아요' },
  { value: 'LACK_OF_INFORMATION', label: '원하는 정보가 부족해요' },
  { value: 'NOT_ENOUGH_CONTENT', label: '볼만한 컨텐츠가 없어요' },
  { value: 'HARD_TO_USE', label: '사용 방법이 어려워요 / 복잡해요' },
  { value: 'PRIVACY_CONCERN', label: '개인정보 유출이 걱정돼요' },
  {
    value: 'USING_OTHER_SERVICE',
    label: '다른 유사서비스를 사용하기로 했어요',
  },
]
