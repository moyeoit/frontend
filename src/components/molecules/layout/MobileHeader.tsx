'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  MenuIcon,
  SearchIcon,
  BookmarkMobileEmptyIcon,
  XIcon,
} from '@/assets/icons'
import { MoyeoitMiniLogo } from '@/assets/images'
import { Button } from '@/components/atoms/Button'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
} from '@/components/molecules/drawer'
import AppPath from '@/shared/configs/appPath'
import useSearchUrlState from '@/shared/hooks/useSearchUrlState'
import { useAuth } from '@/shared/providers/auth-provider'
import { cn } from '@/shared/utils/cn'

const MENU_ITEMS = [
  { label: '탐색하기', href: AppPath.clubExplore(), match: '/club' },
  { label: '커뮤니티', href: AppPath.community(), match: '/community' },
  { label: '마이페이지', href: AppPath.myPage(), match: '/mypage' },
] as const

export default function MobileHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { setOpen } = useSearchUrlState()
  const { user } = useAuth()
  const [mounted, setMounted] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="w-full text-grey-color-5 min-w-[320px] desktop:hidden sticky top-0 z-20">
      <header className="mx-auto">
        <h1 className="sr-only">moyeoit 모여잇</h1>
        <div className="h-14 w-full bg-white flex items-center justify-between px-6 shadow-xs">
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

            <Drawer
              direction="right"
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
            >
              <DrawerTrigger asChild>
                <Button
                  variant="none"
                  aria-label="menu"
                  size="none"
                  className="w-full h-full rounded-full grid place-items-center transition-colors hover:opacity-50 focus:opacity-50"
                >
                  <MenuIcon
                    width={24}
                    height={24}
                    role="img"
                    aria-label="menu"
                  />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="w-[263px] bg-white-color p-0 border-none">
                <DrawerTitle className="sr-only">메뉴</DrawerTitle>
                <div className="flex justify-end items-center px-5 py-4">
                  <DrawerClose asChild>
                    <button
                      type="button"
                      className="flex items-center justify-center text-grey-color-5"
                      aria-label="메뉴 닫기"
                    >
                      <XIcon width={24} height={24} />
                    </button>
                  </DrawerClose>
                </div>
                <nav className="flex flex-col">
                  {MENU_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        'typo-body-2-2-sb text-black-color px-6 py-4',
                        pathname.startsWith(item.match) && 'bg-light-color-2',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>
    </div>
  )
}
