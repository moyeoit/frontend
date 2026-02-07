'use client'

import React from 'react'
import { Form } from '@/components/molecules/Form'
import { ReviewFormHeader, StepNavigation } from '../../shared'
import InterviewStep1 from './InterviewStep1'
import InterviewStep2 from './InterviewStep2'
import { useInterviewForm } from './useInterviewForm'

export default function InterviewForm() {
  const {
    form,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    onSubmit,
    isSubmitting,
    isStep1Complete,
    isStep2Complete,
  } = useInterviewForm()

  const watchedClubId = form.watch('clubId')

  return (
    <div className="w-full">
      <h2 className="typo-title-3 text-black-color px-[10px] py-5">
        면접 후기 작성
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <section className="px-[10px] py-[30px]">
            <ReviewFormHeader
              control={form.control}
              selectedClubId={watchedClubId}
            />
          </section>

          <section className="px-[10px] py-[30px]">
            {currentStep === 1 ? (
              <InterviewStep1 form={form} />
            ) : (
              <InterviewStep2 form={form} />
            )}
          </section>

          <section className="px-[10px] pt-5 pb-10">
            <div className="max-w-[624px] w-full mx-auto">
              <StepNavigation
                currentStep={currentStep}
                onPrevious={goToPreviousStep}
                onNext={goToNextStep}
                isSubmitting={isSubmitting}
                isNextDisabled={
                  currentStep === 1 ? !isStep1Complete : !isStep2Complete
                }
              />
            </div>
          </section>
        </form>
      </Form>
    </div>
  )
}
