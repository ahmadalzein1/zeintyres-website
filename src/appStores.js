// Where to get the Zein Tyres app. Used by the home page's app section, the
// hero's "Get the app" link and the /app/ redirect page (app/index.html), so
// a store link only ever lives here.
//
// ▶ GOING LIVE: when the app is published on a store, set that store's
//   `live` to true and deploy. Until then its badge looks the same but
//   isn't a link (the store page would 404), and /app/ sends that phone to
//   the app section of the home page instead of the store.
export const APP_STORES = {
  ios: {
    live: false,
    // App Store Connect app ID 6802574620.
    url: 'https://apps.apple.com/app/id6802574620',
  },
  android: {
    live: false,
    url: 'https://play.google.com/store/apps/details?id=com.zeintyres.app',
  },
}

// One link for both phones — what the QR code and any shared post point to.
export const APP_LINK = 'https://www.zeintyres.com/app/'

export const ANY_STORE_LIVE = APP_STORES.ios.live || APP_STORES.android.live

// 'ios', 'android', or null for anything else (desktop, unknown). iPadOS
// reports itself as a Mac, so a Mac with a touch screen counts as iOS.
export function storeForDevice() {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return null
}
