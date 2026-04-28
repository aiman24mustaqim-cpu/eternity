export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Eternity',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  inviteBaseUrl: typeof window !== 'undefined' ? window.location.origin : '',
}