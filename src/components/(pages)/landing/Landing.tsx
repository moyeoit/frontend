import Link from 'next/link'
import { Button } from '@/components/atoms/Button/button'
import Footer from '@/components/molecules/layout/Footer'

export default function Landing() {
  return (
    <>
      <div className="flex items-center justify-center overflow-y-hidden">
        <div className="relative z-10 flex shrink-0 flex-col">
          <h1 className="typo-title-1-b text-black-color">
            IT직군을 위한 정보 플랫폼
          </h1>
          <h1
            className="mb-8 text-[112px] font-bold leading-none"
            style={{ fontFamily: 'Figtree' }}
          >
            <span className="text-black-color">MOYEO-</span>
            <span className="text-main-color-1">IT</span>
          </h1>
          <p className="typo-body-1-3-m text-black-color ">
            관심사가 맞는 사람들이 모여, 함께 성장하는 공간.
            <br />
            모여잇에서 IT 동아리를 탐색하고,
            <br />
            IT 직군 현직자 · 지망생들과 생생한 이야기를 나눠보세요
          </p>
          <Button variant="solid" size="medium" className="w-fit mt-4" asChild>
            <Link href="/club/explore">모여잇 시작하기</Link>
          </Button>
        </div>

        <video
          className="size-[836px] rotate-[5deg]"
          src="/videos/landing.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <Footer />
    </>
  )
}
