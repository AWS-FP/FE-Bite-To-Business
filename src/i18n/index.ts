import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import vi from './locales/vi/auth.json'
import en from './locales/en/auth.json'
import viCommon from './locales/vi/common.json'
import enCommon from './locales/en/common.json'
import viStorefront from './locales/vi/storefront.json'
import enStorefront from './locales/en/storefront.json'
import viAdmin from './locales/vi/admin.json'
import enAdmin from './locales/en/admin.json'
import viRegistrations from './locales/vi/registrations.json'
import enRegistrations from './locales/en/registrations.json'

const storageKey = 'bitetobusiness.language'
let language = 'vi'
try {
  if (localStorage.getItem(storageKey) === 'en') language = 'en'
} catch { /* Language selection works even when browser storage is unavailable. */ }

void i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi, common: viCommon, storefront: viStorefront },
    en: { translation: en, common: enCommon, storefront: enStorefront },
    vi: { translation: vi, common: viCommon, admin: { ...viAdmin, ...viRegistrations } },
    en: { translation: en, common: enCommon, admin: { ...enAdmin, ...enRegistrations } },
  },
  lng: language,
  fallbackLng: 'vi',
  supportedLngs: ['vi', 'en'],
  interpolation: { escapeValue: false },
})

document.documentElement.lang = language
i18n.on('languageChanged', (nextLanguage) => {
  document.documentElement.lang = nextLanguage
  try { localStorage.setItem(storageKey, nextLanguage) } catch { /* Optional preference. */ }
})

export default i18n
