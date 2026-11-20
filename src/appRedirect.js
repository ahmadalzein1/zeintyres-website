// /app/ — the one link for both phones (the QR code on the home page points
// here). Sends an iPhone to the App Store and an Android phone to Google Play
// once that store is live (src/appStores.js); everyone else, and any phone
// whose store isn't live yet, lands on the app section of the home page.
import { APP_STORES, storeForDevice } from './appStores.js'

const store = storeForDevice()
const target = store && APP_STORES[store].live ? APP_STORES[store].url : `${import.meta.env.BASE_URL}#app`

window.location.replace(target)
