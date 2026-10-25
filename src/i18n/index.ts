import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import vi from './locales/vi/auth.json'
import en from './locales/en/auth.json'
import viCommon from './locales/vi/common.json'
import enCommon from './locales/en/common.json'

const storageKey = 'bitetobusiness.language'
let language = 'vi'
try {
  if (localStorage.getItem(storageKey) === 'en') language = 'en'
} catch { /* Language selection works even when browser storage is unavailable. */ }

void i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi, common: viCommon },
    en: { translation: en, common: enCommon },
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
