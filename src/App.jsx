import { useState, useEffect } from 'react'
import {
  Sun,
  Moon,
  Clock,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Hammer,
  Gauge,
  Disc,
  Cog,
  MessageCircle,
  Star,
  Image as ImageIcon,
} from 'lucide-react'
import './App.css'
import logoDark from './assets/darkmode.png'
import logoLight from './assets/lightmode.png'
import shopPhoto from './assets/download.jpg'

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

// Translations
const translations = {
  en: {
    welcome: 'Welcome to',
    tagline: 'Your Trusted Tire Solution in Amchit, Lebanon',
    description: 'Professional tire sales, repairs, maintenance & wheel alignment.',
    hours24: 'Open 24/7 • Always Ready to Serve You',
    location: '📍 Facing McDonald\'s, Amchit',
    contactBtn: 'Contact Us',
    whatsappBtn: 'WhatsApp Now',
    open24: '24/7 Open',
    alwaysReady: 'Always Ready',
    phone: '03 436 172',
    callWhatsapp: 'Call & WhatsApp',
    emailUs: 'Email Us',
    email: 'zeintires@gmail.com',
    fullService: 'Full Service',
    allInOne: 'All in One',
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
    morePhotos: 'More Photos Coming Soon',
    customerReviews: 'Customer Reviews',
    reviewsDesc: 'What our satisfied customers say',
    review1: '"Excellent service! Quick, professional, and affordable. Highly recommended!"',
    review2: '"Best tire shop in Amchit. Available 24/7 when you need them most."',
    review3: '"Professional team with fair prices. They really care about customers."',
    author1: '- Ahmed K.',
    author2: '- Maria J.',
    author3: '- Hassan R.',
    getInTouch: 'Get in Touch',
    helpDesc: 'We\'re here to help 24/7',
    phoneLabel: 'Phone',
    whatsappLabel: 'WhatsApp',
    emailLabel: 'Email',
    locationLabel: 'Location',
    amchitLeb: 'Amchit, Lebanon',
    facingMcDonald: 'Facing McDonald\'s',
    hoursLabel: 'Hours',
    ambitLabel: 'Amchit, Lebanon Facing McDonald\'s',
    followUs: 'Follow Us',
    socialDesc: 'Stay connected on social media',
    facebook: 'Facebook',
    instagram: 'Instagram',
    copyright: '© 2026 Zein Tyres. All rights reserved.',
    professionalService: 'Professional tire service in Amchit, Lebanon',
    services: 'Services',
    gallery: 'Gallery',
    reviews: 'Reviews',
    contact: 'Contact'
  },
  ar: {
    welcome: 'أهلا و سهلا ب',
    tagline: 'محلك الموثوق للإطارات في عمشيت، لبنان',
    description: 'بيع وإصلاح وصيانة إطارات وضبط عجلات احترافي.',
    hours24: 'مفتوح 24/7 • جاهز دائماً لخدمتك',
    location: '📍 مقابل ماكدونالد، عمشيت',
    contactBtn: 'تواصل معنا',
    whatsappBtn: 'واتس أب الآن',
    open24: 'مفتوح 24/7',
    alwaysReady: 'جاهز دائماً',
    phone: '03 436 172',
    callWhatsapp: 'اتصل أو واتس أب',
    emailUs: 'راسلنا بالبريد',
    email: 'zeintires@gmail.com',
    fullService: 'خدمات شاملة',
    allInOne: 'الكل في واحد',
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
    morePhotos: 'صور إضافية قريباً',
    customerReviews: 'تقييمات العملاء',
    reviewsDesc: 'ما يقوله عملاؤنا الراضون',
    review1: '"خدمة ممتازة! سريعة واحترافية وبأسعار معقولة. ننصح بها بشدة!"',
    review2: '"أفضل متجر إطارات في عمشيت. مفتوح 24/7 عندما تحتاج إليه."',
    review3: '"فريق احترافي وأسعار عادلة. يهتمون حقاً بالعملاء."',
    author1: '- أحمد خ.',
    author2: '- مارية ج.',
    author3: '- حسن ر.',
    getInTouch: 'تواصل معنا',
    helpDesc: 'نحن هنا لمساعدتك 24/7',
    phoneLabel: 'الهاتف',
    whatsappLabel: 'واتس أب',
    emailLabel: 'البريد الإلكتروني',
    locationLabel: 'الموقع',
    amchitLeb: 'عمشيت، لبنان',
    facingMcDonald: 'مقابل ماكدونالد',
    hoursLabel: 'ساعات العمل',
    ambitLabel: 'عمشيت، لبنان مقابل ماكدونالد',
    followUs: 'تابعنا',
    socialDesc: 'ابق متصلاً معنا على وسائل التواصل الاجتماعي',
    facebook: 'فيسبوك',
    instagram: 'إنستجرام',
    copyright: '© 2026 زين تايرز. جميع الحقوق محفوظة.',
    professionalService: 'خدمة إطارات احترافية في عمشيت، لبنان',
    services: 'الخدمات',
    gallery: 'المعرض',
    reviews: 'التقييمات',
    contact: 'تواصل'
  }
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [language, setLanguage] = useState('en')
  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    window.open(`https://wa.me/96170436172?text=${message}`, '_blank')
  }

  return (
    <div className="app">
      {/* Header/Navigation */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="logo-section">
            <img src={darkMode ? logoDark : logoLight} alt="Zein Tyres Logo" className="logo" />
            <h1 className="brand-name">Zein Tyres</h1>
          </div>
          <nav className="nav-links">
            <a href="#services">{t.services}</a>
            <a href="#gallery">{t.gallery}</a>
            <a href="#testimonials">{t.reviews}</a>
            <a href="#contact">{t.contact}</a>
          </nav>
          <div className="navbar-buttons">
            <button className="language-toggle" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
              {language === 'en' ? 'العربية' : 'English'}
            </button>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-subtitle">{t.welcome}</h2>
          <h1 className="hero-title">Zein Tyres</h1>
          <p className="hero-tagline">{t.tagline}</p>
          <p className="hero-description">
            {t.description}
            <br />
            <strong>{t.hours24}</strong>
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary">{t.contactBtn}</a>
            <button className="btn btn-secondary" onClick={handleWhatsApp}>
              <MessageCircle size={20} style={{display: 'inline', marginRight: '0.5rem'}} /> {t.whatsappBtn}
            </button>
          </div>
          <p className="location-badge">📍 {t.location}</p>
        </div>
        <div className="hero-image">
          <img src={shopPhoto} alt="Zein Tyres Shop" />
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="quick-info">
        <div className="info-card">
          <Clock className="icon" size={32} />
          <h3>{t.open24}</h3>
          <p>{t.alwaysReady}</p>
        </div>
        <div className="info-card">
          <Phone className="icon" size={32} />
          <h3>{t.phone}</h3>
          <p>{t.callWhatsapp}</p>
        </div>
        <div className="info-card">
          <Mail className="icon" size={32} />
          <h3>{t.emailUs}</h3>
          <p>{t.email}</p>
        </div>
        <div className="info-card">
          <Wrench className="icon" size={32} />
          <h3>{t.fullService}</h3>
          <p>{t.allInOne}</p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="section-header">
          <h2>{t.ourServices}</h2>
          <p>{t.servicesDesc}</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <Wrench className="service-icon" size={48} />
            <h3>{t.tireSales}</h3>
            <p>{t.tireSalesDesc}</p>
          </div>
          <div className="service-card">
            <Hammer className="service-icon" size={48} />
            <h3>{t.tireRepairs}</h3>
            <p>{t.tireRepairsDesc}</p>
          </div>
          <div className="service-card">
            <Gauge className="service-icon" size={48} />
            <h3>{t.maintenance}</h3>
            <p>{t.maintenanceDesc}</p>
          </div>
          <div className="service-card">
            <Wrench className="service-icon" size={48} />
            <h3>{t.wheelAlignment}</h3>
            <p>{t.wheelAlignmentDesc}</p>
          </div>
          <div className="service-card">
            <Disc className="service-icon" size={48} />
            <h3>{t.rimSales}</h3>
            <p>{t.rimSalesDesc}</p>
          </div>
          <div className="service-card">
            <Cog className="service-icon" size={48} />
            <h3>{t.rimRepairs}</h3>
            <p>{t.rimRepairsDesc}</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery">
        <div className="section-header">
          <h2>{t.ourShop}</h2>
          <p>{t.shopDesc}</p>
        </div>
        <div className="gallery-grid">
          <div className="gallery-item">
            <img src={shopPhoto} alt="Shop Interior" />
            <p>{t.professionalSetup}</p>
          </div>
          <div className="gallery-item placeholder">
            <ImageIcon size={48} />
            <p>{t.morePhotos}</p>
          </div>
          <div className="gallery-item placeholder">
            <ImageIcon size={48} />
            <p>{t.morePhotos}</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="section-header">
          <h2>{t.customerReviews}</h2>
          <p>{t.reviewsDesc}</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
            </div>
            <p>{t.review1}</p>
            <p className="author">{t.author1}</p>
          </div>
          <div className="testimonial-card">
            <div className="stars">
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
            </div>
            <p>{t.review2}</p>
            <p className="author">{t.author2}</p>
          </div>
          <div className="testimonial-card">
            <div className="stars">
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
              <Star size={20} className="star-icon" fill="currentColor" />
            </div>
            <p>{t.review3}</p>
            <p className="author">{t.author3}</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="section-header">
          <h2>{t.getInTouch}</h2>
          <p>{t.helpDesc}</p>
        </div>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <h3><Phone size={24} className="contact-icon" /> {t.phoneLabel}</h3>
              <a href="tel:+96170436172">03 436 172</a>
            </div>
            <div className="contact-item">
              <h3><MessageCircle size={24} className="contact-icon" /> {t.whatsappLabel}</h3>
              <button onClick={handleWhatsApp} className="link-button">
                +961 70 436 172
              </button>
            </div>
            <div className="contact-item">
              <h3><Mail size={24} className="contact-icon" /> {t.emailLabel}</h3>
              <a href="mailto:zeintires@gmail.com">zeintires@gmail.com</a>
            </div>
            <div className="contact-item">
              <h3><MapPin size={24} className="contact-icon" /> {t.locationLabel}</h3>
              <p>{t.amchitLeb}<br />{t.facingMcDonald}</p>
            </div>
            <div className="contact-item">
              <h3><Clock size={24} className="contact-icon" /> {t.hoursLabel}</h3>
              <p>Open 24/7<br />Always Available</p>
            </div>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.5235848748753!2d35.59088!3d34.13333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f5db3b7c5d5ad%3A0xf90bd77fcc58d36a!2sZein%20Tyres!5e0!3m2!1sen!2slb!4v1"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zein Tyres Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-media">
        <div className="section-header">
          <h2>{t.followUs}</h2>
          <p>{t.socialDesc}</p>
        </div>
        <div className="social-links">
          <a href="https://www.facebook.com/share/1C4nZ8TTMg/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-link facebook">
            <FacebookLogo size={40} />
            <span>{t.facebook}</span>
          </a>
          <a href="https://www.instagram.com/zein_tires/" target="_blank" rel="noopener noreferrer" className="social-link instagram">
            <InstagramLogo size={40} />
            <span>{t.instagram}</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>{t.copyright}</p>
          <p>{t.professionalService}</p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <button className="whatsapp-button" onClick={handleWhatsApp} title="Chat on WhatsApp">
        <MessageCircle size={32} />
      </button>
    </div>
  )
}

export default App
