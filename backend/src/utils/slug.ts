export const generateInvitationSlug = (bride: string, groom: string): string => {
  const clean = (str: string) =>
    str.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 20)
  const suffix = Math.random().toString(36).substring(2, 6)
  return `${clean(bride) || 'bride'}-${clean(groom) || 'groom'}-${suffix}`
}

export const generateRandomSlug = (): string => {
  return Math.random().toString(36).substring(2, 12)
}