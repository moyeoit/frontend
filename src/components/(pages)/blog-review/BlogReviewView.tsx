'use client'

import React from 'react'
import { BlogReviewSearchRequest, SortType } from '@/features/blog-review/types'
import { BlogReviewList } from './BlogReviewList'

export const BlogReviewView: React.FC = () => {
  const [filters, setFilters] = React.useState<BlogReviewSearchRequest>({
    sort: 'POPULAR',
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      title: e.target.value || undefined,
    }))
  }

  const handleSortChange = (sort: SortType) => {
    setFilters((prev) => ({
      ...prev,
      sort,
    }))
  }

  return (
    <main className="w-full min-h-screen bg-white">
      <div className="max-w-275 mx-auto px-5 py-10 desktop:py-16">
        {/* 타이틀 */}
        <h1 className="typo-title-2-1-sb text-black-color mb-8">블로그 후기</h1>

        {/* 검색 및 필터 */}
        <div className="mb-6 space-y-4">
          {/* 검색창 */}
          <div className="relative">
            <input
              type="text"
              placeholder="제목으로 검색..."
              className="w-full px-4 py-3 border border-grey-color-2 rounded-lg typo-body-2-r focus:outline-none focus:border-main-color-1 transition-colors"
              onChange={handleSearchChange}
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-color-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* 정렬 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange('POPULAR')}
              className={`px-4 py-2 rounded-lg typo-body-3-m transition-colors ${
                filters.sort === 'POPULAR'
                  ? 'bg-main-color-1 text-white-color'
                  : 'bg-grey-color-1 text-grey-color-4 hover:bg-grey-color-2'
              }`}
            >
              인기순
            </button>
            <button
              onClick={() => handleSortChange('RECENT')}
              className={`px-4 py-2 rounded-lg typo-body-3-m transition-colors ${
                filters.sort === 'RECENT'
                  ? 'bg-main-color-1 text-white-color'
                  : 'bg-grey-color-1 text-grey-color-4 hover:bg-grey-color-2'
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        {/* 블로그 리뷰 리스트 */}
        <BlogReviewList filters={filters} />
      </div>
    </main>
  )
}

export default BlogReviewView
