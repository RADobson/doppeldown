export const ADMIN_EMAIL_DOMAINS = ['dobsondevelopment.com.au', 'doppeldown.com']

export function isAllowedAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const at = email.lastIndexOf('@')
  if (at < 0) return false
  const domain = email.slice(at + 1).toLowerCase()
  return ADMIN_EMAIL_DOMAINS.includes(domain)
}
