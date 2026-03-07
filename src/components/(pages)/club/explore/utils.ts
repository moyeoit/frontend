import {
  CLUB_EXPLORE_POPUP_STORAGE_PREFIX,
  ExplorePopupStorageState,
  ExploreSort,
} from './constants'

type NullableQueryValue = string | null | undefined

type LegacyExploreQueryInput = {
  field?: NullableQueryValue
  sort?: NullableQueryValue
  part?: NullableQueryValue
  way?: NullableQueryValue
  target?: NullableQueryValue
}

type NormalizedExploreQuery = {
  sort: ExploreSort | null
  part: string | null
  way: string | null
  target: string | null
}

type NormalizedLegacyQueryResult = {
  query: NormalizedExploreQuery
  shouldCanonicalize: boolean
}

function normalizeQueryValue(value: NullableQueryValue): string | null {
  if (value == null) return null

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function isSameNullableValue(
  original: NullableQueryValue,
  normalized: string | null,
) {
  return (original ?? null) === normalized
}

export function normalizeSort(sort: NullableQueryValue): ExploreSort {
  return normalizeQueryValue(sort) === '이름순' ? '이름순' : '인기순'
}

export function parseMultiFilterValue(value: NullableQueryValue): string[] {
  const normalized = normalizeQueryValue(value)

  if (!normalized) return []

  const parsed = normalized
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (parsed.includes('all')) {
    return ['all']
  }

  return parsed
}

export function normalizeLegacyQuery(
  query: LegacyExploreQueryInput,
): NormalizedLegacyQueryResult {
  const normalizedPart = normalizeQueryValue(query.part)
  const normalizedWay = normalizeQueryValue(query.way)
  const normalizedTarget = normalizeQueryValue(query.target)
  const trimmedSort = normalizeQueryValue(query.sort)

  let normalizedSort: ExploreSort | null = null
  if (trimmedSort === '인기순' || trimmedSort === '이름순') {
    normalizedSort = trimmedSort
  } else if (trimmedSort) {
    normalizedSort = '인기순'
  }

  const hasFieldQuery = query.field !== null && query.field !== undefined
  const isPartChanged = !isSameNullableValue(query.part, normalizedPart)
  const isWayChanged = !isSameNullableValue(query.way, normalizedWay)
  const isTargetChanged = !isSameNullableValue(query.target, normalizedTarget)
  const isSortWhitespaceChanged = !isSameNullableValue(query.sort, trimmedSort)
  const isSortNormalized = trimmedSort != null && normalizedSort !== trimmedSort

  return {
    query: {
      sort: normalizedSort,
      part: normalizedPart,
      way: normalizedWay,
      target: normalizedTarget,
    },
    shouldCanonicalize:
      hasFieldQuery ||
      isPartChanged ||
      isWayChanged ||
      isTargetChanged ||
      isSortWhitespaceChanged ||
      isSortNormalized,
  }
}

export function buildPopupStorageKey(
  userId: string | number,
  state: ExplorePopupStorageState,
): string {
  return `${CLUB_EXPLORE_POPUP_STORAGE_PREFIX}:${state}:${String(userId)}`
}

export function shouldOpenEmailPrompt({
  eligible,
  neverShow,
  sessionDismissed,
}: {
  eligible: boolean
  neverShow: boolean
  sessionDismissed: boolean
}) {
  return eligible && !neverShow && !sessionDismissed
}
