'use client'

import React from 'react'
import { Form } from '@/components/molecules/Form'
import { ReviewFormHeader, StepNavigation } from '../../shared'
import PaperStep1 from './PaperStep1'
import PaperStep2 from './PaperStep2'
import { usePaperForm } from './usePaperForm'

export default function PaperForm() {
  const {
    form,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    onSubmit,
    isSubmitting,
    isStep1Complete,
    isStep2Complete,
  } = usePaperForm()

  const watchedClubId = form.watch('clubId')

  return (
    <div className="w-full">
      <h2 className="typo-title-3 text-black-color px-[10px] py-5">
        서류 후기 작성
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <section className="px-[10px] py-[30px]">
            <ReviewFormHeader
              control={form.control}
              selectedClubId={watchedClubId}
            />
          </section>

          <section className="px-[10px] py-[30px]">
            {currentStep === 1 ? (
              <PaperStep1 form={form} />
            ) : (
              <PaperStep2 form={form} />
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
