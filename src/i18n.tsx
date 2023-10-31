import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './assets/locales/en/translation.json';
import vn from './assets/locales/vn/translation.json';

const resources = {
  en: {
    translation: en
  },
  vn: {
    translation: vn
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  debug: false,
  detection: {
    // Order of detection methods
    order: ['localStorage', 'cookie', 'navigator', 'htmlTag', 'path', 'subdomain'],
    // Keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    // Cache user language on
    caches: ['localStorage', 'cookie']
  },
  backend: {
    // Define the path where your translations are loaded from
    loadPath: '/assets/locales/{{lng}}/translation.json'
  }
});

export default i18n;
