'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MenuIcon, SearchIcon, BookmarkMobileEmptyIcon } from '@/assets/icons'
import { MoyeoitMiniLogo } from '@/assets/images'
import { Button } from '@/components/atoms/Button'
import AppPath from '@/shared/configs/appPath'
import useSearchUrlState from '@/shared/hooks/useSearchUrlState'
import { useAuth } from '@/shared/providers/auth-provider'

export default function MobileHeader() {
  const router = useRouter()
  const { setOpen } = useSearchUrlState()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="w-full text-grey-color-5 min-w-[320px] desktop:hidden">
      <header className="mx-auto px-4 z-20 relative">
        <h1 className="sr-only">moyeoit 모여잇</h1>
        <div className="h-14 w-full bg-white rounded-full flex items-center justify-between px-6 shadow-sm ">
          {/* Left: Logo placeholder */}
          <div className="flex items-center gap-14">
            <Link href={AppPath.home()} className="block">
              <MoyeoitMiniLogo
                width={24}
                height={25}
                role="img"
                aria-label="moyeoit logo"
              />
            </Link>
          </div>
          {/* Right: search, profile, cta */}
          <div className="flex items-center gap-4">
            {!user && mounted && (
              <Link
                href={AppPath.login()}
                className="typo-caption-m text-main-color-1 whitespace-nowrap hover:underline focus:underline"
              >
                회원가입/로그인
              </Link>
            )}
            <Button
              variant="none"
              size="none"
              aria-label="search"
              className="w-full h-full rounded-full grid place-items-center transition-colors hover:opacity-50 focus:opacity-50"
              onClick={() => setOpen(true)}
            >
              <SearchIcon
                width={24}
                height={24}
                role="img"
                aria-label="search"
              />
            </Button>
            {user && mounted && (
              <Button
                variant="none"
                size="none"
                aria-label="bookmark"
                className="w-full h-full rounded-full grid place-items-center transition-colors hover:opacity-50 focus:opacity-50"
                onClick={() => router.push(AppPath.bookmark())}
              >
                <BookmarkMobileEmptyIcon
                  width={24}
                  height={24}
                  role="img"
                  aria-label="bookmark"
                />
              </Button>
            )}
            <Button
              variant="none"
              aria-label="menu"
              size="none"
              className="w-full h-full rounded-full grid place-items-center transition-colors hover:opacity-50 focus:opacity-50"
            >
              <MenuIcon width={24} height={24} role="img" aria-label="menu" />
            </Button>
          </div>
        </div>
      </header>
    </div>
  )
}
