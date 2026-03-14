'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MoyeoitLandingImage } from '@/assets/images'
import { Button } from '@/components/atoms/Button/button'
import Footer from '@/components/molecules/layout/Footer'
import useMediaQuery from '@/shared/hooks/useMediaQuery'

export default function Landing() {
  const [isVideoReady, setIsVideoReady] = useState(false)
  const { isDesktop } = useMediaQuery()

  return (
    <>
      <div
        className={
          isDesktop
            ? 'flex min-h-[80svh] flex-row items-center justify-center overflow-hidden'
            : 'flex min-h-[80svh] flex-col items-center justify-center overflow-hidden'
        }
      >
        {isDesktop ? (
          <>
            <div className="relative z-10 flex shrink-0 flex-col items-start text-left">
              <h1 className="typo-title-1-b text-black-color">
                IT직군을 위한 실전 성장 플랫폼
              </h1>
              <h1
                className="mb-8 text-[112px] font-bold leading-none"
                style={{ fontFamily: 'Figtree' }}
              >
                <span className="text-black-color">MOYEO-</span>
                <span className="text-main-color-1">IT</span>
              </h1>
              <p className="typo-body-1-3-m text-black-color">
                관심사가 맞는 사람들이 모여, 함께 성장하는 공간.
                <br />
                모여잇에서 IT 동아리를 탐색하고,
                <br />
                IT 직군 현직자 · 지망생들과 생생한 이야기를 나눠보세요
              </p>
              <Button
                variant="solid"
                size="medium"
                className="mt-4 w-fit"
                asChild
              >
                <Link href="/club/explore">모여잇 시작하기</Link>
              </Button>
            </div>

            <div className="relative size-209 rotate-[5deg]">
              {!isVideoReady && (
                <Image
                  src={MoyeoitLandingImage}
                  alt="모여잇 랜딩"
                  fill
                  className="object-cover"
                />
              )}
              <video
                className={`size-full ${isVideoReady ? 'visible' : 'invisible'}`}
                src="/videos/landing.mp4"
                autoPlay
                loop
                muted
                playsInline
                onCanPlayThrough={() => setIsVideoReady(true)}
              />
            </div>
          </>
        ) : (
          <div className="relative z-10 flex shrink-0 flex-col items-center px-5 text-center">
            <h1 className="typo-body-2-b text-black-color">
              IT직군을 위한 실전 성장 플랫폼
            </h1>
            <h1
              className="text-[56px] font-bold leading-none"
              style={{ fontFamily: 'Figtree' }}
            >
              <span className="text-black-color">MOYEO-</span>
              <span className="text-main-color-1">IT</span>
            </h1>

            <div className="relative w-[307px] h-[337px] rotate-[5deg] mt-6">
              {!isVideoReady && (
                <Image
                  src={MoyeoitLandingImage}
                  alt="모여잇 랜딩"
                  fill
                  className="object-cover"
                />
              )}
              <video
                className={`size-full ${isVideoReady ? 'visible' : 'invisible'}`}
                src="/videos/landing.mp4"
                autoPlay
                loop
                muted
                playsInline
                onCanPlayThrough={() => setIsVideoReady(true)}
              />
            </div>

            <p className="mt-6 typo-medibody-m text-black-color">
              관심사가 맞는 사람들이 모여, 함께 성장하는 공간.
              <br />
              모여잇에서 IT 동아리를 탐색하고,
              <br />
              IT 직군 현직자 · 지망생들과 생생한 이야기를 나눠보세요
            </p>
            <Button
              variant="solid"
              size="medium"
              className="mx-auto mt-4 w-fit"
              asChild
            >
              <Link href="/club/explore">모여잇 시작하기</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
