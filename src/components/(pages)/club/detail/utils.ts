export type ClubDetailEmailPromptState = 'seen'

export const CLUB_DETAIL_EMAIL_PROMPT_STORAGE_PREFIX =
  'club-detail-email-prompt'

export function buildClubDetailEmailPromptKey(
  userId: string | number,
  state: ClubDetailEmailPromptState = 'seen',
): string {
  return `${CLUB_DETAIL_EMAIL_PROMPT_STORAGE_PREFIX}:${state}:${String(userId)}`
}

export function shouldOpenClubDetailEmailPrompt(seen: boolean): boolean {
  return !seen
}

export function resolveClubDetailPromptOnAlertClick(seen: boolean): {
  shouldOpenDialog: boolean
  nextSeen: boolean
} {
  if (shouldOpenClubDetailEmailPrompt(seen)) {
    return {
      shouldOpenDialog: true,
      nextSeen: true,
    }
  }

  return {
    shouldOpenDialog: false,
    nextSeen: true,
  }
}
