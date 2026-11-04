import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi/auth.json';
import en from './locales/en/auth.json';
import viCommon from './locales/vi/common.json';
import enCommon from './locales/en/common.json';
import viStorefront from './locales/vi/storefront.json';
import enStorefront from './locales/en/storefront.json';
import viAdmin from './locales/vi/admin.json';
import enAdmin from './locales/en/admin.json';
import viRegistrations from './locales/vi/registrations.json';
import enRegistrations from './locales/en/registrations.json';
import viStaff from './locales/vi/staff.json';
import enStaff from './locales/en/staff.json';
import viSystem from './locales/vi/system.json';
import enSystem from './locales/en/system.json';
import viWorkspace from './locales/vi/workspace.json';
import enWorkspace from './locales/en/workspace.json';
import viProfile from './locales/vi/profile.json';
import enProfile from './locales/en/profile.json';

const storageKey = 'bitetobusiness.language';
let language = 'en';
try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'vi' || saved === 'en') language = saved;
} catch {
    /* Language selection works even when browser storage is unavailable. */
}

void i18n.use(initReactI18next).init({
    resources: {
        vi: {
            translation: vi,
            common: viCommon,
            storefront: viStorefront,
            admin: { ...viAdmin, ...viRegistrations, ...viStaff, ...viSystem },
            workspace: viWorkspace,
            profile: viProfile,
        },
        en: {
            translation: en,
            common: enCommon,
            storefront: enStorefront,
            admin: { ...enAdmin, ...enRegistrations, ...enStaff, ...enSystem },
            workspace: enWorkspace,
            profile: enProfile,
        },
    },
    lng: language,
    fallbackLng: 'en',
    supportedLngs: ['vi', 'en'],
    interpolation: { escapeValue: false },
});

document.documentElement.lang = language;
i18n.on('languageChanged', (nextLanguage) => {
    document.documentElement.lang = nextLanguage;
    try {
        localStorage.setItem(storageKey, nextLanguage);
    } catch {
        /* Optional preference. */
    }
});

export default i18n;
