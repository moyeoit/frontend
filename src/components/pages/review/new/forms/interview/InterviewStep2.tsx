'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Textarea } from '@/components/atoms/Textarea'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/molecules/Form'
import { DynamicQASection } from '@/components/molecules/dynamicQaSection'
import { type InterviewFormType } from './useInterviewForm'

interface InterviewStep2Props {
  form: UseFormReturn<InterviewFormType>
}

export default function InterviewStep2({ form }: InterviewStep2Props) {
  return (
    <div className="flex flex-col gap-12">
      {/* 한줄평 */}
      <FormField
        control={form.control}
        name="oneLineComment"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-1 mb-4">
              <FormLabel className="typo-body-1-b text-black-color">
                한줄평
              </FormLabel>
              <span className="text-primary-color">*</span>
            </div>
            <FormControl>
              <Textarea
                {...field}
                placeholder="면접에서 느낀 가장 핵심적인 소감이나 느낌을 요약해 주세요."
                className="min-h-[60px]"
                maxLength={20}
              />
            </FormControl>
            <div className="text-right typo-caption-m text-grey-color-3">
              {field.value?.length || 0}/20
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 면접에서 기억나는 질문과 답변 */}
      <DynamicQASection
        control={form.control}
        name="qaItems"
        title="면접에서 기억나는 질문과 답변"
        questionPlaceholder="면접에서 받은 질문을 작성해주세요."
        answerPlaceholder="질문에 대한 답변을 작성해주세요."
      />

      {/* 다음 지원자들을 위한 면접 TIP */}
      <FormField
        control={form.control}
        name="tip"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="typo-body-1-b text-black-color mb-4">
              다음 지원자들을 위한 면접 TIP
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="면접 당일 합격의 당락을 결정했다고 생각하는 본인만의 전략이나 팁을 공유해 주세요."
                className="min-h-[120px]"
                maxLength={300}
              />
            </FormControl>
            <div className="text-right typo-caption-m text-grey-color-3">
              {field.value?.length || 0}/300
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 자유 후기 */}
      <FormField
        control={form.control}
        name="freeReview"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="typo-body-1-b text-black-color mb-4">
              자유 후기
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="서류 합격 직후부터 면접 준비, 그리고 당일 면접장 입장까지의 과정이나, 현장에서의 느꼈던 분위기, 예상치 못한 상황, 면접관과의 상호작용 등 전체적인 경험을 자유롭게 작성해 주세요."
                className="min-h-[120px]"
                maxLength={300}
              />
            </FormControl>
            <div className="text-right typo-caption-m text-grey-color-3">
              {field.value?.length || 0}/300
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
