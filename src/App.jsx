import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import {
  Sun,
  Moon,
  Clock,
  Phone,
  Mail,
  LifeBuoy,
  MapPin,
  Tag,
  Crosshair,
  Truck,
  Hammer,
  Gauge,
  Disc,
  Cog,
  MessageCircle,
  Star,
  Quote,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react'
import './App.css'
import logoDark from './assets/darkmode.png'
import logoLight from './assets/lightmode.png'
import shopPhoto from './assets/download.jpg'

// Single source of truth for the shop's phone number. It used to be spelled
// out in five places, which is how the displayed number and the dialled one
// drifted apart.
const PHONE = {
  local: '70 428 165',        // as shown to visitors
  intl: '+961 70 428 165',    // international, for the WhatsApp row
  e164: '96170428165',        // digits only, for tel: and wa.me
}

// Real reviews left on the shop's Google listing, copied verbatim. The Arabic
// wording is a translation of the same review, the way Google shows one.
const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps?cid=17945674084077065066'

const REVIEWS = [
  {
    author: 'milena najeeb',
    rating: 5,
    en: '"The best service, the owner is very friendly and the staff is very professional."',
    ar: '"أفضل خدمة، صاحب المحل لطيف جداً والفريق محترف جداً."',
  },
  {
    author: 'Houssein Al Shami Abboud',
    rating: 5,
    en: '"Excellent service."',
    ar: '"خدمة ممتازة."',
  },
  {
    author: 'Rami Bnc',
    rating: 4,
    en: '"Great service, helpful & kind people, they will do the job."',
    ar: '"خدمة ممتازة، أشخاص لطيفون ومتعاونون، ينجزون العمل كما يجب."',
  },
]

const EMAIL = {
  info: 'info@zeintyres.com',        // general enquiries
  support: 'support@zeintyres.com',  // after-sales / help
}

// Facebook Logo Component
const FacebookLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

// Instagram Logo Component
const InstagramLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/>
    <circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
)

// TikTok Logo Component
const TikTokLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1 0-5.18c.27 0 .52.04.77.12v-3.2a5.8 5.8 0 0 0-.77-.05A5.72 5.72 0 0 0 4.14 15.3 5.72 5.72 0 0 0 9.86 21a5.72 5.72 0 0 0 5.72-5.72V9.01a7.35 7.35 0 0 0 4.28 1.37V7.3a4.28 4.28 0 0 1-3.26-1.48z"/>
  </svg>
)

// Translations
const translations = {
  en: {
    welcome: 'Welcome to',
    tagline: 'Your Trusted Tire Solution in Amchit, Lebanon',
    description: 'Professional tire sales, repairs, maintenance & wheel alignment.',
    hours24: 'Open 24/7 • Always Ready to Serve You',
    location: 'Facing McDonald\'s, Amchit, Lebanon',
    liveNow: 'Open now · 24/7',
    servicesEyebrow: 'What we do',
    galleryEyebrow: 'Inside the shop',
    reviewsEyebrow: 'Testimonials',
    contactEyebrow: 'Contact',
    socialEyebrow: 'Social',
    googleReview: 'Google review',
    quickLinks: 'Quick links',
    contactBtn: 'Contact Us',
    whatsappBtn: 'WhatsApp Now',
    open24: '24/7 Open',
    alwaysReady: 'Always Ready',
    callWhatsapp: 'Call & WhatsApp',
    emailUs: 'Email Us',
    roadsideService: 'Roadside Service',
    weComeToYou: 'We Come to You',
    ourServices: 'Our Services',
    servicesDesc: 'Comprehensive tire and automotive solutions',
    tireSales: 'Tire Sales',
    tireSalesDesc: 'Wide selection of premium tires for all vehicle types and budgets.',
    tireRepairs: 'Tire Repairs',
    tireRepairsDesc: 'Professional puncture repairs and tire restoration services.',
    maintenance: 'Maintenance',
    maintenanceDesc: 'Regular maintenance to keep your tires in perfect condition.',
    wheelAlignment: 'Wheel Alignment',
    wheelAlignmentDesc: 'Precision wheel alignment for optimal performance and safety.',
    rimSales: 'Rim Sales',
    rimSalesDesc: 'Quality alloy and steel rims in a wide range of sizes and styles.',
    rimRepairs: 'Rim Repairs',
    rimRepairsDesc: 'Straightening, welding and refinishing for bent or damaged rims.',
    ourShop: 'Our Shop',
    shopDesc: 'Quality service and professional expertise',
    professionalSetup: 'Professional Setup',
    customerReviews: 'Customer Reviews',
    reviewsDesc: 'What our customers say on Google',
    seeAllReviews: 'Read all our reviews on Google →',
    getInTouch: 'Get in Touch',
    helpDesc: 'We\'re here to help 24/7',
    phoneLabel: 'Phone',
    whatsappLabel: 'WhatsApp',
    emailLabel: 'Email',
    supportLabel: 'Support',
    locationLabel: 'Location',
    amchitLeb: 'Amchit, Lebanon',
    facingMcDonald: 'Facing McDonald\'s',
    hoursLabel: 'Hours',
    ambitLabel: 'Amchit, Lebanon Facing McDonald\'s',
    followUs: 'Follow Us',
    socialDesc: 'Stay connected on social media',
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    copyright: '© 2026 Zein Tyres. All rights reserved.',
    professionalService: 'Professional tire service in Amchit, Lebanon',
    services: 'Services',
    gallery: 'Gallery',
    reviews: 'Reviews',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    darkModeLabel: 'Switch to dark mode',
    lightModeLabel: 'Switch to light mode'
  },
  ar: {
    welcome: 'أهلا و سهلا ب',
    tagline: 'محلك الموثوق للإطارات في عمشيت، لبنان',
    description: 'بيع وإصلاح وصيانة إطارات وضبط عجلات احترافي.',
    hours24: 'مفتوح 24/7 • جاهز دائماً لخدمتك',
    location: 'مقابل ماكدونالدز، عمشيت، لبنان',
    liveNow: 'مفتوح الآن · 24/7',
    servicesEyebrow: 'ماذا نقدم',
    galleryEyebrow: 'داخل المحل',
    reviewsEyebrow: 'آراء العملاء',
    contactEyebrow: 'اتصل بنا',
    socialEyebrow: 'تواصل اجتماعي',
    googleReview: 'تقييم على جوجل',
    quickLinks: 'روابط سريعة',
    contactBtn: 'تواصل معنا',
    whatsappBtn: 'واتس أب الآن',
    open24: 'مفتوح 24/7',
    alwaysReady: 'جاهز دائماً',
    callWhatsapp: 'اتصل أو واتس أب',
    emailUs: 'راسلنا بالبريد',
    roadsideService: 'خدمة على الطريق',
    weComeToYou: 'نأتي إليك أينما كنت',
    ourServices: 'خدماتنا',
    servicesDesc: 'حلول شاملة للإطارات والسيارات',
    tireSales: 'بيع الإطارات',
    tireSalesDesc: 'تشكيلة واسعة من الإطارات عالية الجودة لجميع أنواع السيارات والميزانيات.',
    tireRepairs: 'إصلاح الإطارات',
    tireRepairsDesc: 'إصلاح احترافي للثقوب وتجديد الإطارات.',
    maintenance: 'الصيانة',
    maintenanceDesc: 'صيانة دورية للحفاظ على إطاراتك في أفضل حالة.',
    wheelAlignment: 'ضبط العجلات',
    wheelAlignmentDesc: 'ضبط دقيق للعجلات لأداء وسلامة أفضل.',
    rimSales: 'بيع الجنوط',
    rimSalesDesc: 'جنوط ألمنيوم وحديد عالية الجودة بمقاسات وأشكال متنوعة.',
    rimRepairs: 'إصلاح الجنوط',
    rimRepairsDesc: 'تعديل ولحام وتلميع الجنوط المعوجة أو المتضررة.',
    ourShop: 'متجرنا',
    shopDesc: 'خدمة عالية الجودة وخبرة احترافية',
    professionalSetup: 'إعداد احترافي',
    customerReviews: 'تقييمات العملاء',
    reviewsDesc: 'ما يقوله عملاؤنا على جوجل',
    seeAllReviews: '← اقرأ كل التقييمات على جوجل',
    getInTouch: 'تواصل معنا',
    helpDesc: 'نحن هنا لمساعدتك 24/7',
    phoneLabel: 'الهاتف',
    whatsappLabel: 'واتس أب',
    emailLabel: 'البريد الإلكتروني',
    supportLabel: 'الدعم الفني',
    locationLabel: 'الموقع',
    amchitLeb: 'عمشيت، لبنان',
    facingMcDonald: 'مقابل ماكدونالد',
    hoursLabel: 'ساعات العمل',
    ambitLabel: 'عمشيت، لبنان مقابل ماكدونالد',
    followUs: 'تابعنا',
    socialDesc: 'ابق متصلاً معنا على وسائل التواصل الاجتماعي',
    facebook: 'فيسبوك',
    instagram: 'إنستجرام',
    tiktok: 'تيك توك',
    copyright: '© 2026 زين تايرز. جميع الحقوق محفوظة.',
    professionalService: 'خدمة إطارات احترافية في عمشيت، لبنان',
    services: 'الخدمات',
    gallery: 'المعرض',
    reviews: 'التقييمات',
    contact: 'تواصل',
    openMenu: 'افتح القائمة',
    closeMenu: 'أغلق القائمة',
    darkModeLabel: 'التبديل إلى الوضع الليلي',
    lightModeLabel: 'التبديل إلى الوضع النهاري'
  }
}

// Reversible reveal-on-scroll, in the spirit of GSAP's "play / reverse".
// A [data-reveal] element plays in when its top rises past SHOW_LINE and plays
// back out when scrolling up drops it below HIDE_LINE; the gap between the two
// stops it flickering if you park the page right on the line. Elements that
// leave through the top stay shown, so scrolling up finds them already there.
//
// Everything runs on the Web Animations API rather than CSS classes because
// every transition starts from the element's *current* computed state: reverse
// mid-reveal and it turns around from where it is instead of snapping.
// Elements that cross together - a row of cards - cascade in DOM order on the
// way in and in reverse order on the way out.
const SHOW_LINE = 0.88 // fraction of the viewport height, from the top
const HIDE_LINE = 0.94
const SHOW_MS = 900
const HIDE_MS = 450
const SHOW_STAGGER_MS = 90
const HIDE_STAGGER_MS = 50
const MAX_STAGGER_STEPS = 5

// Hidden pose per data-reveal variant. Horizontal ones take the text
// direction so "start" always comes from the reading side.
const REVEAL_FROM = {
  up: () => ({ opacity: 0, translate: '0 2rem' }),
  zoom: () => ({ opacity: 0, scale: '0.94' }),
  start: (dir) => ({ opacity: 0, translate: `${-2 * dir}rem 0` }),
  end: (dir) => ({ opacity: 0, translate: `${2 * dir}rem 0` }),
}

// Resting value for each animated property.
const AT_REST = { opacity: '1', translate: '0px 0px', scale: '1', rotate: '0deg' }

// Secondary beats that land just after their card does, and leave with it.
const POP = { opacity: 0, scale: '0.4', rotate: '-25deg' }
const REVEAL_BEATS = [
  { selector: ':scope > .eyebrow', pseudoElement: '::before', from: { scale: '0 1' }, delay: 200, duration: 800, easing: 'out' },
  { selector: ':scope > .service-icon, :scope > .info-icon, :scope > .contact-icon', from: POP, delay: 200, duration: 700, easing: 'spring' },
  // No opacity on stars: the empty ones rest at 0.45, not 1.
  { selector: ':scope .stars > .star-icon', from: { scale: '0', rotate: '-25deg' }, delay: 250, step: 60, duration: 500, easing: 'spring' },
]

// Preferences survive a reload. Storage can throw (private mode, blocked
// cookies), in which case the site just falls back to its defaults.
const readPref = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const writePref = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Not persisted; the choice still applies for this visit.
  }
}

// Inertial wheel scrolling. Touch keeps the phone's native scrolling, and
// Lenis itself drops to 1:1 scrolling under prefers-reduced-motion. Anchor
// links go through it too, and it honours each section's scroll-margin-top,
// so they still stop below the fixed navbar.
function useSmoothScroll(paused) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (paused) lenis.stop()
    else lenis.start()
  }, [paused])
}

// A soft glow that follows the pointer across [data-spotlight] cards. It only
// writes two CSS variables; the glow itself is drawn in App.css.
function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const onMove = (e) => {
      const card = e.target.closest?.('[data-spotlight]')
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}

// Which section is under the middle of the screen, for the nav highlight.
function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  const key = ids.join(',')

  useEffect(() => {
    const sections = key.split(',').map((id) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((section) => observer.observe(section))

    // Above the first section there is nothing to highlight.
    const first = sections[0]
    const onScroll = () => {
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.5) setActive(null)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [key])

  return active
}

function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    const rootStyle = getComputedStyle(root)
    const EASING = {
      out: rootStyle.getPropertyValue('--ease-out').trim(),
      spring: rootStyle.getPropertyValue('--ease-spring').trim(),
      // Exits accelerate away but must start moving at once, or a quick
      // reverse feels like it lagged.
      in: 'cubic-bezier(0.4, 0, 1, 1)',
    }

    const targets = [...document.querySelectorAll('[data-reveal]')]
    const shown = new Map()
    const running = new Map()

    // Animate from wherever the element is right now to `to`. A transition
    // to the resting pose drops itself when done, so a settled element is back
    // on its own CSS; a transition to hidden holds (fill) until replaced.
    const animateTo = (el, to, timing, pseudoElement) => {
      const now = getComputedStyle(el, pseudoElement)
      const from = Object.fromEntries(Object.keys(to).map((prop) => [prop, now[prop]]))
      const key = pseudoElement ?? ''
      const slots = running.get(el) ?? {}
      slots[key]?.cancel()
      const anim = el.animate([from, to], { fill: 'both', pseudoElement, ...timing })
      slots[key] = anim
      running.set(el, slots)
      return anim
    }

    const atRest = (pose) => Object.fromEntries(Object.keys(pose).map((prop) => [prop, AT_REST[prop]]))

    const play = (el, visible, delay, instant) => {
      const dir = root.dir === 'rtl' ? -1 : 1
      const hidden = (REVEAL_FROM[el.dataset.reveal] ?? REVEAL_FROM.up)(dir)
      const run = (node, pose, timing, pseudoElement) => {
        const anim = animateTo(node, visible ? atRest(pose) : pose, instant ? { duration: 0 } : timing, pseudoElement)
        if (visible) anim.onfinish = () => anim.cancel()
      }

      run(el, hidden, visible
        ? { duration: SHOW_MS, delay, easing: EASING.out }
        : { duration: HIDE_MS, delay, easing: EASING.in })

      for (const beat of REVEAL_BEATS) {
        el.querySelectorAll(beat.selector).forEach((node, i) => {
          run(node, beat.from, visible
            ? { duration: beat.duration, delay: delay + beat.delay + i * (beat.step ?? 0), easing: EASING[beat.easing] }
            : { duration: HIDE_MS * 0.6, delay, easing: EASING.in }, beat.pseudoElement)
        })
      }
    }

    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      const entering = []
      const leaving = []

      for (const el of targets) {
        const { top, bottom } = el.getBoundingClientRect()
        const was = shown.get(el)
        let next = was
        if (top < vh * SHOW_LINE) next = true
        else if (top > vh * HIDE_LINE || was === undefined) next = false
        if (next === was) continue

        shown.set(el, next)
        // Nothing to watch off-screen, or on the first pass for anything not
        // already on its way in - just set the pose.
        const offscreen = bottom <= 0 || top >= vh
        if (offscreen || (was === undefined && !next)) play(el, next, 0, true)
        else (next ? entering : leaving).push(el)
      }

      entering.forEach((el, i) => play(el, true, Math.min(i, MAX_STAGGER_STEPS) * SHOW_STAGGER_MS))
      leaving.reverse().forEach((el, i) => play(el, false, Math.min(i, MAX_STAGGER_STEPS) * HIDE_STAGGER_MS))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    // From here the animations own visibility; drop the CSS pre-hide.
    root.setAttribute('data-reveal-ready', '')
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    // Switching language flips the text direction; anything still waiting
    // off-screen has to be re-posed on the new reading side.
    const dirWatch = new MutationObserver(() => {
      shown.forEach((isShown, el) => {
        if (!isShown) play(el, false, 0, true)
      })
    })
    dirWatch.observe(root, { attributes: true, attributeFilter: ['dir'] })

    return () => {
      dirWatch.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      root.removeAttribute('data-reveal-ready')
      running.forEach((slots) => Object.values(slots).forEach((anim) => anim.cancel()))
    }
  }, [])
}

const SECTION_IDS = ['services', 'gallery', 'testimonials', 'contact', 'social']

// "Milena Najeeb" -> "MN", for the reviewer avatars.
const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

function App() {
  // An explicit choice wins; otherwise follow the device's light/dark setting.
  const [darkMode, setDarkMode] = useState(() => {
    const saved = readPref('zt-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [scrolled, setScrolled] = useState(false)
  const [language, setLanguage] = useState(() => (readPref('zt-lang') === 'ar' ? 'ar' : 'en'))
  const [menuOpen, setMenuOpen] = useState(false)
  const t = translations[language]
  const activeSection = useActiveSection(SECTION_IDS)
  useScrollReveal()
  useSmoothScroll(menuOpen)
  useSpotlight()

  const toggleTheme = () => {
    writePref('zt-theme', darkMode ? 'light' : 'dark')
    setDarkMode(!darkMode)
  }

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en'
    writePref('zt-lang', next)
    setLanguage(next)
  }

  const navItems = [
    { href: '#services', label: t.services },
    { href: '#gallery', label: t.gallery },
    { href: '#testimonials', label: t.reviews },
    { href: '#contact', label: t.contact },
    { href: '#social', label: t.followUs },
  ]
  const isActive = (href) => href === `#${activeSection}`

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile menu on Escape, and whenever the viewport grows to desktop
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 769px)')
    const onChange = (e) => {
      if (e.matches) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onChange)
    document.body.classList.add('menu-open')
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onChange)
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [darkMode])

  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl')
      document.documentElement.lang = 'ar'
    } else {
      document.documentElement.setAttribute('dir', 'ltr')
      document.documentElement.lang = 'en'
    }
  }, [language])

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi Zein Tyres! I need tire services.')
    window.open(`https://wa.me/${PHONE.e164}?text=${message}`, '_blank')
  }

  return (
    <div className="app">
      {/* Header/Navigation */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="navbar-container">
          <div className="logo-section">
            <img src={darkMode ? logoDark : logoLight} alt="Zein Tyres Logo" className="logo" />
            <h1 className="brand-name">Zein Tyres</h1>
          </div>
          <nav className="nav-links">
            {navItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={isActive(href) ? 'active' : undefined}
                aria-current={isActive(href) ? 'true' : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="navbar-buttons">
            <button
              className="language-toggle"
              onClick={toggleLanguage}
            >
              {language === 'en' ? 'العربية' : 'EN'}
            </button>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={darkMode ? t.lightModeLabel : t.darkModeLabel}
            >
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button
              className="nav-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <nav id="mobile-nav" className="mobile-nav" hidden={!menuOpen}>
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={isActive(href) ? 'active' : undefined}
              aria-current={isActive(href) ? 'true' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="scroll-progress" aria-hidden="true" />
      </header>
      {menuOpen && (
        <button
          className="nav-scrim"
          onClick={() => setMenuOpen(false)}
          aria-label={t.closeMenu}
          tabIndex={-1}
        />
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-pill">
            <span className="live-dot" aria-hidden="true" />
            {t.liveNow}
          </p>
          <h2 className="hero-subtitle">{t.welcome}</h2>
          <h1 className="hero-title">Zein Tyres</h1>
          <p className="hero-tagline">{t.tagline}</p>
          <p className="hero-description">
            {t.description}
            <br />
            <strong>{t.hours24}</strong>
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary">
              {t.contactBtn}
              <ArrowRight size={20} className="btn-arrow" aria-hidden="true" />
            </a>
            <button className="btn btn-secondary" onClick={handleWhatsApp}>
              <MessageCircle size={20} aria-hidden="true" />
              {t.whatsappBtn}
            </button>
          </div>
          <p className="location-badge">
            <MapPin size={18} aria-hidden="true" />
            {t.location}
          </p>
        </div>
        <div className="hero-visual">
          <div className="hero-image">
            <img src={shopPhoto} alt="Zein Tyres Shop" width="1024" height="768" fetchPriority="high" />
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="quick-info" data-reveal="zoom">
        <div className="info-card" data-reveal>
          <span className="info-icon"><Clock size={26} aria-hidden="true" /></span>
          <h3>{t.open24}</h3>
          <p>{t.alwaysReady}</p>
        </div>
        <div className="info-card" data-reveal>
          <span className="info-icon"><Phone size={26} aria-hidden="true" /></span>
          <h3><a href={`tel:+${PHONE.e164}`} className="info-link" dir="ltr">{PHONE.local}</a></h3>
          <p>{t.callWhatsapp}</p>
        </div>
        <div className="info-card" data-reveal>
          <span className="info-icon"><Mail size={26} aria-hidden="true" /></span>
          <h3>{t.emailUs}</h3>
          <p><a href={`mailto:${EMAIL.info}`} className="info-link">{EMAIL.info}</a></p>
        </div>
        <div className="info-card" data-reveal>
          <span className="info-icon"><Truck size={26} aria-hidden="true" /></span>
          <h3>{t.roadsideService}</h3>
          <p>{t.weComeToYou}</p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="section-header" data-reveal>
          <span className="eyebrow">{t.servicesEyebrow}</span>
          <h2>{t.ourServices}</h2>
          <p>{t.servicesDesc}</p>
        </div>
        <div className="services-grid">
          {[
            [Tag, t.tireSales, t.tireSalesDesc],
            [Hammer, t.tireRepairs, t.tireRepairsDesc],
            [Gauge, t.maintenance, t.maintenanceDesc],
            [Crosshair, t.wheelAlignment, t.wheelAlignmentDesc],
            [Disc, t.rimSales, t.rimSalesDesc],
            [Cog, t.rimRepairs, t.rimRepairsDesc],
          ].map(([Icon, title, desc]) => (
            <div className="service-card" data-reveal data-spotlight key={title}>
              <span className="service-icon"><Icon size={28} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery">
        <div className="section-header" data-reveal>
          <span className="eyebrow">{t.galleryEyebrow}</span>
          <h2>{t.ourShop}</h2>
          <p>{t.shopDesc}</p>
        </div>
        <div className="gallery-grid">
          <div className="gallery-item" data-reveal="zoom">
            <img src={shopPhoto} alt="Shop Interior" loading="lazy" decoding="async" />
            <p>{t.professionalSetup}</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="section-header" data-reveal>
          <span className="eyebrow">{t.reviewsEyebrow}</span>
          <h2>{t.customerReviews}</h2>
          <p>{t.reviewsDesc}</p>
        </div>
        <div className="testimonials-scroll" tabIndex={0} data-lenis-prevent>
          {REVIEWS.map((review) => (
            <figure className="testimonial-card" key={review.author} data-reveal data-spotlight>
              <div className="testimonial-top">
                <div className="stars" aria-label={`${review.rating} / 5`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={star <= review.rating ? 'star-icon' : 'star-icon star-empty'}
                      fill={star <= review.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <Quote size={32} className="quote-mark" aria-hidden="true" />
              </div>
              <blockquote>{language === 'ar' ? review.ar : review.en}</blockquote>
              <figcaption className="author">
                <span className="avatar" aria-hidden="true">{initials(review.author)}</span>
                <span className="author-text">
                  <strong>{review.author}</strong>
                  <small>{t.googleReview}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="reviews-link" data-reveal>
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
            {t.seeAllReviews}
          </a>
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="section-header" data-reveal>
          <span className="eyebrow">{t.contactEyebrow}</span>
          <h2>{t.getInTouch}</h2>
          <p>{t.helpDesc}</p>
        </div>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item" data-reveal="start" data-spotlight>
              <span className="contact-icon"><Phone size={22} aria-hidden="true" /></span>
              <div className="contact-text">
                <h3>{t.phoneLabel}</h3>
                <a href={`tel:+${PHONE.e164}`} dir="ltr">{PHONE.local}</a>
              </div>
            </div>
            <div className="contact-item" data-reveal="start" data-spotlight>
              <span className="contact-icon"><MessageCircle size={22} aria-hidden="true" /></span>
              <div className="contact-text">
                <h3>{t.whatsappLabel}</h3>
                <button onClick={handleWhatsApp} className="link-button" dir="ltr">
                  {PHONE.intl}
                </button>
              </div>
            </div>
            <div className="contact-item" data-reveal="start" data-spotlight>
              <span className="contact-icon"><Mail size={22} aria-hidden="true" /></span>
              <div className="contact-text">
                <h3>{t.emailLabel}</h3>
                <a href={`mailto:${EMAIL.info}`}>{EMAIL.info}</a>
              </div>
            </div>
            <div className="contact-item" data-reveal="start" data-spotlight>
              <span className="contact-icon"><LifeBuoy size={22} aria-hidden="true" /></span>
              <div className="contact-text">
                <h3>{t.supportLabel}</h3>
                <a href={`mailto:${EMAIL.support}`}>{EMAIL.support}</a>
              </div>
            </div>
            <div className="contact-item" data-reveal="start" data-spotlight>
              <span className="contact-icon"><MapPin size={22} aria-hidden="true" /></span>
              <div className="contact-text">
                <h3>{t.locationLabel}</h3>
                <p>{t.amchitLeb}<br />{t.facingMcDonald}</p>
              </div>
            </div>
            <div className="contact-item" data-reveal="start" data-spotlight>
              <span className="contact-icon"><Clock size={22} aria-hidden="true" /></span>
              <div className="contact-text">
                <h3>{t.hoursLabel}</h3>
                <p>{t.open24}<br />{t.alwaysReady}</p>
              </div>
            </div>
          </div>
          <div className="map-container" data-reveal="end">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.5235848748753!2d35.59088!3d34.13333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f5db3b7c5d5ad%3A0xf90bd77fcc58d36a!2sZein%20Tyres!5e0!3m2!1sen!2slb!4v1"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zein Tyres Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section id="social" className="social-media">
        <div className="section-header" data-reveal>
          <span className="eyebrow">{t.socialEyebrow}</span>
          <h2>{t.followUs}</h2>
          <p>{t.socialDesc}</p>
        </div>
        <div className="social-links">
          <a href="https://www.facebook.com/profile.php?id=61593747883398" target="_blank" rel="noopener noreferrer" data-reveal className="social-link facebook">
            <FacebookLogo size={40} />
            <span>{t.facebook}</span>
          </a>
          <a href="https://www.instagram.com/zein_tyres/" target="_blank" rel="noopener noreferrer" data-reveal className="social-link instagram">
            <InstagramLogo size={40} />
            <span>{t.instagram}</span>
          </a>
          <a href="https://www.tiktok.com/@zein.tires" target="_blank" rel="noopener noreferrer" data-reveal className="social-link tiktok">
            <TikTokLogo size={40} />
            <span>{t.tiktok}</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logoDark} alt="" width="56" height="48" loading="lazy" />
              <span>Zein Tyres</span>
            </div>
            <p>{t.professionalService}</p>
            <p className="footer-live">
              <span className="live-dot" aria-hidden="true" />
              {t.liveNow}
            </p>
          </div>
          <nav className="footer-col" aria-label={t.quickLinks}>
            <h3>{t.quickLinks}</h3>
            {navItems.map(({ href, label }) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>
          <div className="footer-col">
            <h3>{t.contact}</h3>
            <a href={`tel:+${PHONE.e164}`} dir="ltr">{PHONE.local}</a>
            <a href={`mailto:${EMAIL.info}`}>{EMAIL.info}</a>
            <span>{t.facingMcDonald}<br />{t.amchitLeb}</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.copyright}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
