import type { Meta, StoryObj } from '@storybook/nextjs-vite'

type IconItem = { name: string; src: string }
type ColorItem = { group: string; name: string; hex: string }
type TypographyItem = { name: string; className: string; value: string }

const iconItems: IconItem[] = [
  { name: 'Search', src: '/icons/main.svg' },
  { name: 'Community', src: '/icons/clubMatching.svg' },
  { name: 'Bell', src: '/icons/bell.svg' },
  { name: 'Subscribe', src: '/icons/subscribe.svg' },
  { name: 'Reset', src: '/icons/reset.svg' },
  { name: 'Designer', src: '/icons/designer.svg' },
  { name: 'Planner', src: '/icons/planner.svg' },
  { name: 'Developer', src: '/icons/developer.svg' },
]

const colorItems: ColorItem[] = [
  { group: 'Colors/White', name: 'white', hex: '#ffffff' },
  { group: 'Colors/main', name: 'main 1', hex: '#6e58fe' },
  { group: 'Colors/main', name: 'main 2', hex: '#5846cb' },
  { group: 'Colors/main', name: 'main 3', hex: '#f1eeff' },
  { group: 'Colors/black', name: 'black', hex: '#0b0b0b' },
  { group: 'Colors/light', name: 'light 1', hex: '#fafafc' },
  { group: 'Colors/light', name: 'light 2', hex: '#f7f7f9' },
  { group: 'Colors/light', name: 'light 3', hex: '#ebecef' },
  { group: 'Colors/light', name: 'light 4', hex: '#d4d4d7' },
  { group: 'Colors/gray', name: 'gray 1', hex: '#bcbdbf' },
  { group: 'Colors/gray', name: 'gray 2', hex: '#b0b1b3' },
  { group: 'Colors/gray', name: 'gray 3', hex: '#8d8e8f' },
  { group: 'Colors/gray', name: 'gray 4', hex: '#6a6a6c' },
  { group: 'Colors/gray', name: 'gray 5', hex: '#3c3d3e' },
  { group: 'Colors/state', name: 'failure', hex: '#f44336' },
]

const typographySmallMid: TypographyItem[] = [
  {
    name: 'smallbody3',
    className: 'typo-caption-3',
    value: 'Pretendard / 9 / 150% / 500',
  },
  {
    name: 'smallbody2',
    className: 'typo-caption-2',
    value: 'Pretendard / 11 / 150% / 600',
  },
  {
    name: 'smallbody1.5',
    className: 'typo-button-m',
    value: 'Pretendard / 12 / 150% / 500',
  },
  {
    name: 'smallbody1',
    className: 'typo-caption-1',
    value: 'Pretendard / 13 / 150% / 600',
  },
  {
    name: 'medibody(M3)',
    className: 'typo-body-2-3-m',
    value: 'Pretendard / 16 / 190% / 500',
  },
  {
    name: 'medibody(M2)',
    className: 'typo-button-m',
    value: 'Pretendard / 14 / 170% / 500',
  },
  {
    name: 'medibody(M)',
    className: 'typo-button-m',
    value: 'Pretendard / 14 / 150% / 500',
  },
  {
    name: 'medibody(B)',
    className: 'typo-button-b',
    value: 'Pretendard / 14 / 150% / 600',
  },
]

const typographyBody: TypographyItem[] = [
  {
    name: 'body3-3(R)',
    className: 'typo-body-3-3-r',
    value: 'Pretendard / 15 / 150% / 400',
  },
  {
    name: 'body3-2(m)',
    className: 'typo-body-3-2-m',
    value: 'Pretendard / 15 / 150% / 500',
  },
  {
    name: 'body3-1(SB)',
    className: 'typo-body-3-1-sb',
    value: 'Pretendard / 15 / 150% / 600',
  },
  {
    name: 'body3(B)',
    className: 'typo-body-3-b',
    value: 'Pretendard / 15 / 150% / 700',
  },
  {
    name: 'body2-3(M)',
    className: 'typo-body-2-3-m',
    value: 'Pretendard / 16 / 150% / 500',
  },
  {
    name: 'body2-2(SB)',
    className: 'typo-body-2-2-sb',
    value: 'Pretendard / 16 / 150% / 600',
  },
  {
    name: 'body2(B)',
    className: 'typo-body-2-b',
    value: 'Pretendard / 16 / 150% / 700',
  },
  {
    name: 'body1-3(M)',
    className: 'typo-body-1-3-m',
    value: 'Pretendard / 18 / 150% / 500',
  },
  {
    name: 'body1-2(SB)',
    className: 'typo-body-1-2-sb',
    value: 'Pretendard / 18 / 150% / 600',
  },
  {
    name: 'body1(B)',
    className: 'typo-body-1-b',
    value: 'Pretendard / 18 / 150% / 700',
  },
]

const typographyTitle: TypographyItem[] = [
  {
    name: 'title3',
    className: 'typo-title-3',
    value: 'Pretendard / 20 / 150% / 700',
  },
  {
    name: 'title2-1(SB)',
    className: 'typo-title-2-1-sb',
    value: 'Pretendard / 22 / 150% / 600',
  },
  {
    name: 'title2(B)',
    className: 'typo-title-2-b',
    value: 'Pretendard / 22 / 150% / 700',
  },
  {
    name: 'title1-3(M)',
    className: 'typo-title-1-3-m',
    value: 'Pretendard / 24 / 150% / 500',
  },
  {
    name: 'title1-2(SB)',
    className: 'typo-title-1-2-sb',
    value: 'Pretendard / 24 / 150% / 600',
  },
  {
    name: 'title1(B)',
    className: 'typo-title-1-b',
    value: 'Pretendard / 24 / 150% / 700',
  },
  {
    name: 'main title',
    className: 'typo-main-title',
    value: 'Pretendard / 32 / 150% / 700',
  },
  {
    name: 'REVIEW title',
    className: 'typo-review-title',
    value: 'Pretendard / 38 / 150% / 700',
  },
]

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-light-color-3 bg-white-color p-5 shadow-sm">
      <h2 className="typo-title-2-1-sb text-black-color">{title}</h2>
      {description && (
        <p className="mt-1 typo-body-3-r text-grey-color-4">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function TypographyTable({ rows }: { rows: TypographyItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-light-color-3">
      <table className="w-full border-collapse">
        <thead className="bg-light-color-2">
          <tr className="typo-caption-2 text-grey-color-4">
            <th className="border-b border-light-color-3 px-4 py-3 text-left">
              Text Styles
            </th>
            <th className="border-b border-light-color-3 px-4 py-3 text-left">
              Value
            </th>
            <th className="border-b border-light-color-3 px-4 py-3 text-left">
              Preview
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-b border-light-color-3 last:border-b-0"
            >
              <td className="px-4 py-3 typo-button-m text-black-color">
                {row.name}
              </td>
              <td className="px-4 py-3 typo-sm-body-1-5 text-grey-color-4">
                {row.value}
              </td>
              <td className={`px-4 py-3 text-black-color ${row.className}`}>
                The quick brown fox jumps over the lazy dog
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const meta = {
  title: 'Design Token',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fafcfe_0%,#f5f7fb_100%)] px-6 py-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-light-color-3 bg-white-color px-6 py-5 shadow-sm">
          <p className="typo-caption-2 text-main-color-1">STORYBOOK MAIN</p>
          <h1 className="mt-2 typo-title-2-m text-black-color">
            디자인 요소 안내
          </h1>
        </header>

        <div className="grid gap-4">
          <SectionCard
            title="아이콘"
            description="공용 아이콘 세트를 컴포넌트로 렌더링한 영역"
          >
            <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
              {iconItems.map((icon) => (
                <div
                  key={icon.name}
                  className="flex flex-col items-center rounded-xl border border-light-color-3 bg-light-color-1 px-2 py-3"
                >
                  <img src={icon.src} alt={icon.name} className="h-8 w-8" />
                  <span className="mt-2 typo-caption-3 text-grey-color-4">
                    {icon.name}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="컬러 토큰"
            description="Colors/White, Main, Black, Light, Gray, State"
          >
            <div className="overflow-hidden rounded-xl border border-light-color-3">
              <table className="w-full border-collapse">
                <thead className="bg-light-color-2">
                  <tr className="typo-caption-2 text-grey-color-4">
                    <th className="border-b border-light-color-3 px-4 py-3 text-left">
                      Group
                    </th>
                    <th className="border-b border-light-color-3 px-4 py-3 text-left">
                      Name
                    </th>
                    <th className="border-b border-light-color-3 px-4 py-3 text-left">
                      Preview
                    </th>
                    <th className="border-b border-light-color-3 px-4 py-3 text-left">
                      Hex
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {colorItems.map((color) => (
                    <tr
                      key={`${color.group}-${color.name}`}
                      className="border-b border-light-color-3 last:border-b-0"
                    >
                      <td className="px-4 py-3 typo-button-m text-black-color">
                        {color.group}
                      </td>
                      <td className="px-4 py-3 typo-button-m text-black-color">
                        {color.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="block h-6 w-14 rounded-md border border-light-color-3"
                          style={{ backgroundColor: color.hex }}
                        />
                      </td>
                      <td className="px-4 py-3 typo-sm-body-1-5 text-grey-color-4">
                        {color.hex}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard
            title="스몰/미들 바디 타이포"
            description="smallbody + medibody 타입 스케일"
          >
            <TypographyTable rows={typographySmallMid} />
          </SectionCard>

          <SectionCard
            title="바디 타이포"
            description="body1 / body2 / body3 계열"
          >
            <TypographyTable rows={typographyBody} />
          </SectionCard>

          <SectionCard
            title="타이틀 타이포"
            description="title + main title + review title"
          >
            <TypographyTable rows={typographyTitle} />
          </SectionCard>

          <SectionCard
            title="그래픽 요소"
            description="빈 상태, 에러, 완료 및 직군별 프로필 이미지"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-light-color-3 bg-light-color-1 p-4">
                <p className="typo-body-2-sb text-black-color">상태 그래픽</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <img
                    src="/images/cheerup.svg"
                    alt="프리미엄 후기 완료"
                    className="h-28 w-full rounded-lg bg-white-color p-2 object-contain"
                  />
                  <img
                    src="/images/construction.svg"
                    alt="서비스 제작중"
                    className="h-28 w-full rounded-lg bg-white-color p-2 object-contain"
                  />
                  <img
                    src="/images/sorry.svg"
                    alt="서비스 오류"
                    className="h-28 w-full rounded-lg bg-white-color p-2 object-contain"
                  />
                  <img
                    src="/images/dance.svg"
                    alt="음악 그래픽"
                    className="h-28 w-full rounded-lg bg-white-color p-2 object-contain"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-light-color-3 bg-light-color-1 p-4">
                <p className="typo-body-2-sb text-black-color">직군별 프로필</p>
                <p className="mt-1 typo-sm-body-1-5 text-grey-color-4">
                  네비 상단, 댓글, 일반/프리미엄 후기 유저 이미지에 사용
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center rounded-lg bg-white-color p-3">
                    <img
                      src="/icons/designer.svg"
                      alt="디자인"
                      className="h-16 w-16"
                    />
                    <span className="mt-2 typo-caption-2 text-grey-color-4">
                      디자인
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-white-color p-3">
                    <img
                      src="/icons/planner.svg"
                      alt="기획"
                      className="h-16 w-16"
                    />
                    <span className="mt-2 typo-caption-2 text-grey-color-4">
                      기획
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-white-color p-3">
                    <img
                      src="/icons/developer.svg"
                      alt="개발"
                      className="h-16 w-16"
                    />
                    <span className="mt-2 typo-caption-2 text-grey-color-4">
                      개발
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </section>
    </main>
  ),
}
