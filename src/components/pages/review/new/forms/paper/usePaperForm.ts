import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import z from 'zod'
import { usePostBasicReview } from '@/features/review/mutations'
import {
  ReviewCategory,
  QuestionType,
  type BasicReviewCreateRequest,
  type ReviewAnswerRequest,
  ResultType,
} from '@/features/review/types'
import AppPath from '@/shared/configs/appPath'
import { appValidation } from '@/shared/configs/appValidation'

// 서류 결과 옵션
export const PAPER_RESULT_OPTIONS = [
  { id: ResultType.Pass, label: '합격' },
  { id: ResultType.Failure, label: '불합격' },
  { id: ResultType.NotParticipateAfterPass, label: '합격 후 참여하지않음' },
  { id: ResultType.Waiting, label: '결과 대기중' },
] as const

// Q1: 지원서 작성에 있어 가장 중요하게 어필한 것은 무엇이었나요?
export const Q1_IMPORTANT_APPEAL_OPTIONS = [
  { id: 1, label: '지원 동기' },
  { id: 2, label: '목표/커리어 계획' },
  { id: 3, label: '협업/커뮤니케이션' },
  { id: 4, label: '직무 지식' },
  { id: 5, label: '실무 경험' },
  { id: 6, label: '대외활동 경험' },
  { id: 7, label: '진정성/열정' },
  { id: 8, label: '합격 후 포부' },
]

// Q2: 지원서 작성 시 가장 참고한 정보는 무엇이었나요?
export const Q2_REFERENCE_INFO_OPTIONS = [
  { id: 1, label: '공식 공고 / SNS' },
  { id: 2, label: '동아리 합격자 후기' },
  { id: 3, label: '파트 트렌드 / 이슈' },
  { id: 4, label: '지인/ 멘토의 도움' },
]

// Q3: 지원서 혹은 포트폴리오 제작 시 기술 역량에 대한 서술은 어떤 방식으로 작성하셨나요?
export const Q3_TECH_DESCRIPTION_OPTIONS = [
  { id: 1, label: '데이터 성과 수치 서술' },
  { id: 2, label: '정량적 서술 중심 서술' },
  { id: 3, label: '기술 경험 중심 서술' },
  { id: 4, label: '서술하지 않음' },
]

// 동적 QA 항목 스키마
const qaItemSchema = z.object({
  question: z.string().min(1, '질문을 입력해주세요'),
  answer: z.string().min(1, '답변을 입력해주세요'),
})

const PaperFormSchema = z.object({
  // 공통 헤더
  clubId: appValidation.requiredNumber('IT 동아리명을 선택해주세요'),
  generation: appValidation.requiredNumber('지원 기수를 선택해주세요'),
  jobId: appValidation.requiredNumber('지원 파트를 선택해주세요'),

  // Step 1
  resultType: z.string().min(1, '서류 결과를 선택해주세요'),
  rate: appValidation.rating('서류 총평을 선택해주세요'),
  q1ImportantAppeal: z
    .array(z.number())
    .min(1, '최소 1개 이상 선택해주세요')
    .max(4, '최대 4개까지 선택 가능합니다'),
  q2ReferenceInfo: appValidation.requiredNumber('참고한 정보를 선택해주세요'),
  q3TechDescription: appValidation.requiredNumber(
    '기술 역량 서술 방식을 선택해주세요',
  ),

  // Step 2
  oneLineComment: appValidation.oneLineText(20, '한줄평을 입력해주세요'),
  qaItems: z.array(qaItemSchema).min(1, '최소 1개의 항목을 입력해주세요'),
  tip: z.string().max(300, '300자 이내로 입력해주세요').optional(),
  freeReview: z.string().max(300, '300자 이내로 입력해주세요').optional(),
})

export type PaperFormType = z.infer<typeof PaperFormSchema>

export const usePaperForm = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const postBasicReviewMutation = usePostBasicReview()

  const form = useForm<PaperFormType>({
    resolver: zodResolver(PaperFormSchema),
    defaultValues: {
      clubId: undefined,
      generation: undefined,
      jobId: undefined,
      resultType: '',
      rate: undefined,
      q1ImportantAppeal: [],
      q2ReferenceInfo: undefined,
      q3TechDescription: undefined,
      oneLineComment: '',
      qaItems: [{ question: '', answer: '' }],
      tip: '',
      freeReview: '',
    },
    mode: 'onBlur',
  })

  const goToNextStep = async () => {
    // Step 1 필드들만 검증
    const step1Fields = [
      'clubId',
      'generation',
      'jobId',
      'resultType',
      'rate',
      'q1ImportantAppeal',
      'q2ReferenceInfo',
      'q3TechDescription',
    ] as const

    const isValid = await form.trigger(step1Fields)
    if (isValid) {
      setCurrentStep(2)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else {
      router.back()
    }
  }

  const transformToApiRequest = (
    data: PaperFormType,
  ): BasicReviewCreateRequest => {
    const answers: ReviewAnswerRequest[] = [
      {
        sequence: 1,
        question_id: 1, // Q1: 중요 어필 (MULTIPLE_CHOICE)
        question_type: QuestionType.MultipleChoice,
        value: data.q1ImportantAppeal,
      },
      {
        sequence: 2,
        question_id: 2, // Q2: 참고 정보 (SINGLE_CHOICE)
        question_type: QuestionType.SingleChoice,
        value: data.q2ReferenceInfo,
      },
      {
        sequence: 3,
        question_id: 3, // Q3: 기술 역량 서술 (SINGLE_CHOICE)
        question_type: QuestionType.SingleChoice,
        value: data.q3TechDescription,
      },
      {
        sequence: 4,
        question_id: 6, // 한줄평 (SINGLE_SUBJECTIVE)
        question_type: QuestionType.SingleSubjective,
        value: data.oneLineComment,
      },
    ]

    // 동적 QA 항목 추가 (MULTIPLE_SUBJECTIVE)
    data.qaItems.forEach((qa) => {
      answers.push({
        sequence: answers.length + 1,
        question_id: 4,
        question_type: QuestionType.MultipleSubjective,
        value: [`Q: ${qa.question}`, `A: ${qa.answer}`],
      })
    })

    if (data.tip) {
      answers.push({
        sequence: answers.length + 1,
        question_id: 5, // TIP (SINGLE_SUBJECTIVE)
        question_type: QuestionType.SingleSubjective,
        value: data.tip,
      })
    }

    if (data.freeReview) {
      answers.push({
        sequence: answers.length + 1,
        question_id: 6, // 자유후기 (SINGLE_SUBJECTIVE)
        question_type: QuestionType.SingleSubjective,
        value: data.freeReview,
      })
    }

    // resultType 변환
    let result: ResultType = ResultType.Waiting
    if (data.resultType === ResultType.Pass) {
      result = ResultType.Pass
    } else if (data.resultType === ResultType.Failure) {
      result = ResultType.Failure
    } else if (data.resultType === ResultType.NotParticipateAfterPass) {
      result = ResultType.NotParticipateAfterPass
    }

    return {
      title: data.oneLineComment,
      category: ReviewCategory.Document,
      rate: data.rate,
      result,
      clubId: data.clubId,
      generation: data.generation,
      jobId: data.jobId,
      answers,
    }
  }

  const onSubmit = async (data: PaperFormType) => {
    try {
      const apiData = transformToApiRequest(data)
      await postBasicReviewMutation.mutateAsync(apiData)
      router.push(AppPath.reviewSubmitted())
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return {
    form,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    onSubmit,
    isSubmitting: postBasicReviewMutation.isPending,
  }
}
