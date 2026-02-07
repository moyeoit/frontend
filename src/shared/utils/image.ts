export const isValidImageSrc = (src?: string | null): src is string => {
  if (!src) return false
  const value = src.trim()
  if (value.length === 0) return false
  if (value.startsWith('/')) return true
  if (value.startsWith('http://') || value.startsWith('https://')) return true
  if (value.startsWith('data:') || value.startsWith('blob:')) return true
  return false
}

export const resolveImageSrc = (
  src?: string | null,
  fallback?: string | null,
): string => {
  if (isValidImageSrc(src)) return src.trim()
  if (isValidImageSrc(fallback)) return fallback.trim()
  return '/images/default.svg'
}
