import type { Metadata } from 'next'
import Link from 'next/link'
import {
  DocumentPencilIcon,
  DocumentDiamondIcon,
  DocumentFileIcon,
} from '@/assets/icons'
import AppPath from '@/shared/configs/appPath'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `후기 작성`,
    description: `IT 동아리 후기를 작성해보세요. 서류, 면접, 활동 후기 중 선택하여 경험을 공유하고 다른 분들에게 도움을 주세요.`,
    keywords: [`IT 동아리 후기`, '동아리 후기 작성', '경험 공유'],
    openGraph: {
      title: `후기 작성 | 모여잇`,
      description: `IT 동아리 후기를 작성해보세요. 서류, 면접, 활동 후기 중 선택하여 경험을 공유하고 다른 분들에게 도움을 주세요.`,
    },
  }
}

export default async function Page() {
  return (
    <main className="w-full bg-light-color-2 min-h-full">
      <div className="max-w-[530px] w-full mx-auto px-5 pt-12 desktop:pt-36 pb-12">
        <h2 className="typo-title-1-3-m text-black-color text-center mb-8">
          후기 작성
        </h2>

        <div className="p-6 rounded-2xl bg-white-color shadow-sm flex flex-col gap-8">
          <p className="typo-body-2-sb text-grey-color-4 text-center">
            작성하실 후기 스타일을 선택해주세요
          </p>

          <div className="w-full flex flex-col gap-4">
            <Link
              href={AppPath.reviewNew('paper')}
              className="w-full border border-light-color-3 rounded-2xl p-4 transition-colors hover:border-main-color-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                  <DocumentPencilIcon role="img" aria-label="서류 후기" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="typo-body-3-b text-black-color mb-1">
                    서류 후기
                  </h3>
                  <p className="typo-button-m text-grey-color-3">
                    공고 확인부터 서류 작성까지의 열정적인 경험을 공유해주세요
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={AppPath.reviewNew('interview')}
              className="w-full border border-light-color-3 rounded-2xl p-4 transition-colors hover:border-main-color-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                  <DocumentDiamondIcon role="img" aria-label="면접 후기" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="typo-body-3-b text-black-color mb-1">
                    면접 후기
                  </h3>
                  <p className="typo-button-m text-grey-color-3">
                    서류 합격부터 면접까지의 생생한 경험을 공유 해주세요
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={AppPath.reviewNew('activity')}
              className="w-full border border-light-color-3 rounded-2xl p-4 transition-colors hover:border-main-color-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                  <DocumentFileIcon role="img" aria-label="활동 후기" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="typo-body-3-b text-black-color mb-1">
                    활동 후기
                  </h3>
                  <p className="typo-button-m text-grey-color-3">
                    면접 합격부터 활동 종료까지의 의미있는 경험을 공유해주세요
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
