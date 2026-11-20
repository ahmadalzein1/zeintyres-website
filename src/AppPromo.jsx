import { useMemo } from 'react'
import { ArrowRight, CalendarCheck, Lock, Siren, Truck } from 'lucide-react'
import { ANY_STORE_LIVE, APP_STORES, storeForDevice } from './appStores.js'
import handPhone from './assets/hand-phone.webp'
import handPhone640 from './assets/hand-phone-640.webp'
import welcomePhoto from './assets/app-welcome.webp'
import logoDarkHd from './assets/logo-dark-hd.webp'
import './AppPromo.css'

// The "get the app" section on the home page, and the small link to it in the
// hero. Store links and their live switches are in appStores.js.

// ─── Store logos ─────────────────────────────────────────────────────────────
const AppleLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
)

// The four-colour Play triangle; `mono` draws it in the current text colour.
const PlayLogo = ({ size = 24, mono = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill={mono ? 'currentColor' : '#00D7FE'} d="M1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924z" />
    <path fill={mono ? 'currentColor' : '#00F076'} d="M13.544 10.989l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973z" />
    <path fill={mono ? 'currentColor' : '#FFD400'} d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594z" />
    <path fill={mono ? 'currentColor' : '#FF3A44'} d="M13.544 13.056l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
  </svg>
)

// ─── Store badge ─────────────────────────────────────────────────────────────
// Black, like the official badges. Every badge looks the same; one only
// becomes a link once its store is live (appStores.js), so nobody is sent
// to a store page that doesn't exist yet.
function StoreBadge({ store, t }) {
  const { live, url } = APP_STORES[store]
  const isApple = store === 'ios'
  const content = (
    <>
      {isApple ? <AppleLogo size={26} /> : <PlayLogo size={24} />}
      <span className="store-badge-text">
        <small>{isApple ? t.appStoreSmall : t.playSmall}</small>
        <strong>{isApple ? 'App Store' : 'Google Play'}</strong>
      </span>
    </>
  )
  const label = `${isApple ? t.appStoreSmall : t.playSmall} ${isApple ? 'App Store' : 'Google Play'}`
  return live ? (
    <a className="store-badge" href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {content}
    </a>
  ) : (
    <span className="store-badge" role="img" aria-label={label}>
      {content}
    </span>
  )
}

// iPhones see the App Store first, Android phones Google Play first.
function useStoreOrder() {
  return useMemo(() => (storeForDevice() === 'android' ? ['android', 'ios'] : ['ios', 'android']), [])
}

// ─── QR code ─────────────────────────────────────────────────────────────────
// https://www.zeintyres.com/app/ (generated once; /app/ picks the right store
// for the phone that scans it). Shown on big screens, once a store is live.
const QR_PATH =
  'M0 0.5h7m4 0h1m1 0h3m2 0h3m1 0h7M0 1.5h1m5 0h1m3 0h1m1 0h7m3 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h1m1 0h1m3 0h2m1 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h1m1 0h1m3 0h2m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h2m1 0h1m3 0h5m2 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m1 0h1m1 0h3m4 0h1m2 0h1m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h1m2 0h1m2 0h1m1 0h1m2 0h1M0 8.5h1m1 0h5m5 0h1m3 0h2m2 0h1m1 0h5M0 9.5h3m1 0h2m1 0h1m4 0h4m1 0h4m1 0h3m3 0h1M0 10.5h1m1 0h2m2 0h3m2 0h6m3 0h3M1 11.5h2m1 0h2m4 0h1m1 0h2m1 0h1m4 0h4m1 0h1m1 0h1M1 12.5h1m3 0h2m1 0h3m3 0h2m1 0h2m6 0h2M1 13.5h2m2 0h1m2 0h1m6 0h8m1 0h1m3 0h1M0 14.5h1m1 0h2m2 0h3m2 0h2m4 0h1m5 0h1m1 0h2M0 15.5h2m1 0h3m4 0h1m3 0h1m1 0h1m2 0h1m3 0h2m2 0h1M0 16.5h1m5 0h1m1 0h1m1 0h2m4 0h2m2 0h1m2 0h1m1 0h2M0 17.5h2m1 0h3m1 0h3m2 0h4m2 0h7m1 0h1m1 0h1M0 18.5h1m1 0h1m3 0h1m2 0h2m2 0h4m1 0h1m1 0h4m2 0h1M0 19.5h1m2 0h2m2 0h1m1 0h2m1 0h2m1 0h1m7 0h2m2 0h1M0 20.5h1m4 0h2m1 0h1m2 0h2m1 0h2m1 0h1m1 0h6m1 0h3M8 21.5h3m4 0h2m2 0h2m3 0h5M0 22.5h7m2 0h4m5 0h3m1 0h1m1 0h3M0 23.5h1m5 0h1m1 0h1m5 0h1m1 0h1m1 0h3m3 0h1m2 0h2M0 24.5h1m1 0h3m1 0h1m1 0h2m2 0h1m4 0h1m2 0h5m1 0h1m1 0h1M0 25.5h1m1 0h3m1 0h1m1 0h5m1 0h2m7 0h1m1 0h2M0 26.5h1m1 0h3m1 0h1m1 0h4m1 0h1m1 0h2m1 0h2m1 0h7M0 27.5h1m5 0h1m2 0h3m1 0h1m2 0h1m1 0h3m1 0h2m1 0h1m1 0h1M0 28.5h7m1 0h1m2 0h1m1 0h2m2 0h3m1 0h6'

function QrCard({ t }) {
  return (
    <div className="app-qr">
      <svg className="app-qr-code" viewBox="-2 -2 33 33" shapeRendering="crispEdges" role="img" aria-label={t.appScanTitle}>
        <rect x="-2" y="-2" width="33" height="33" fill="#fff" />
        <path stroke="#0d0d10" d={QR_PATH} />
      </svg>
      <div>
        <strong>{t.appScanTitle}</strong>
        <span>{t.appScanText}</span>
      </div>
    </div>
  )
}

// ─── The hand and phone ──────────────────────────────────────────────────────
// A real photo of a hand holding a phone with its screen off. The app's
// welcome screen - the wet-road photo, the Zein Tyres logo and "Premium
// Quality" - is laid over the black screen in HTML, so the logo stays sharp
// and the photo needs no editing. Screen and island positions are measured
// from the photo (see AppPromo.css). In English in both languages, because
// the app is.
function HandPhone() {
  return (
    <div className="app-hand">
      <div className="app-hand-float">
        <img
          className="app-hand-img"
          src={handPhone}
          srcSet={`${handPhone640} 640w, ${handPhone} 791w`}
          sizes="(max-width: 640px) 360px, 460px"
          width="791"
          height="1336"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="app-hand-screen" dir="ltr">
          <img className="app-hand-photo" src={welcomePhoto} alt="" loading="lazy" decoding="async" />
          <div className="app-hand-scrim" />
          <div className="app-hand-status">
            <span>9:41</span>
            <span className="app-hand-status-icons">
              <i className="app-hand-signal" />
              <i className="app-hand-battery" />
            </span>
          </div>
          <div className="app-hand-welcome">
            <img className="app-hand-logo" src={logoDarkHd} alt="" width="560" height="369" loading="lazy" decoding="async" />
            <b>Premium Quality</b>
            <span>
              Experience the smoothest ride
              <br />
              with Zein Tyres.
            </span>
          </div>
          {/* An iOS notification banner: drops in, waits, slides away. */}
          <div className="app-hand-notif">
            <img src="/apple-touch-icon.png" alt="" width="40" height="40" />
            <span>
              <small>
                ZEIN TYRES <em>now</em>
              </small>
              <b>Your technician is on the way</b>
              <span>Tap to watch them arrive on the map.</span>
            </span>
          </div>
          <div className="app-hand-glare" />
          <div className="app-hand-island" />
          <i className="app-hand-home-bar" />
        </div>
      </div>
    </div>
  )
}

// ─── The section ─────────────────────────────────────────────────────────────
const FEATURE_ICONS = [Siren, CalendarCheck, Truck, Lock]

export function AppPromo({ t }) {
  const order = useStoreOrder()
  return (
    <section id="app" className="app-promo" aria-labelledby="app-promo-title">
      <div className="app-promo-panel">
        <div className="app-promo-copy">
          <div data-reveal>
            <span className="eyebrow">{t.appEyebrow}</span>
            <h2 id="app-promo-title">
              {t.appTitleA} <span className="app-promo-accent">{t.appTitleB}</span>
            </h2>
            <p className="app-promo-lede">{t.appDesc}</p>
          </div>

          <ul className="app-features">
            {t.appFeatures.map((f, i) => {
              const Icon = FEATURE_ICONS[i]
              return (
                <li key={f.title} data-reveal>
                  <span className="app-feature-icon">
                    <Icon size={28} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="app-cta" data-reveal>
            <div className="store-badges">
              {order.map((store) => (
                <StoreBadge key={store} store={store} t={t} />
              ))}
            </div>
            {ANY_STORE_LIVE ? <QrCard t={t} /> : null}
          </div>
          <p className="app-note" data-reveal>
            {t.appFree}
          </p>
        </div>

        <div className="app-promo-visual" aria-hidden="true" data-reveal="zoom">
          <div className="app-orbit" />
          <HandPhone />
        </div>
      </div>
    </section>
  )
}

// ─── Hero link ───────────────────────────────────────────────────────────────
// Above the fold on the very first screen: a small pill that jumps to the
// app section.
export function HeroAppLink({ t }) {
  return (
    <a href="#app" className="hero-app">
      <span className="hero-app-logos" aria-hidden="true">
        <AppleLogo size={16} />
        <PlayLogo size={14} mono />
      </span>
      <span>{t.appHeroLink}</span>
      <ArrowRight size={16} className="hero-app-arrow" aria-hidden="true" />
    </a>
  )
}
