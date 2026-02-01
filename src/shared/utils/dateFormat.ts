/**
 * 날짜를 'YY.MM.DD' 형식으로 포맷팅
 * @param dateString - ISO 날짜 문자열 (예: '2025-08-28')
 * @returns 포맷팅된 날짜 문자열 (예: '25.08.28')
 */
export function formatDateToYYMMDD(dateString: string): string {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return dateString
    }

    const year = date.getFullYear().toString().slice(-2) // 마지막 2자리
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // 01-12
    const day = date.getDate().toString().padStart(2, '0') // 01-31

    return `${year}.${month}.${day}`
  } catch (error) {
    console.error('Date formatting error:', error)
    return dateString
  }
}

/**
 * 날짜를 상대 시간으로 포맷팅 (예: '30분전', '2시간전', '3일전')
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷팅된 상대 시간 문자열
 */
export function formatTimeAgo(dateString: string): string {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    const now = new Date()

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return dateString
    }

    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) {
      return '방금전'
    } else if (diffMinutes < 60) {
      return `${diffMinutes}분전`
    } else if (diffHours < 24) {
      return `${diffHours}시간전`
    } else if (diffDays < 7) {
      return `${diffDays}일전`
    } else {
      return formatDateToYYMMDD(dateString)
    }
  } catch (error) {
    console.error('Time ago formatting error:', error)
    return dateString
  }
}
