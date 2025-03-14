import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'pt'];

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'en', // Fallback if no language is detected
    debug: true,

    detection: {
      order: ['localStorage', 'cookie', 'querystring', 'navigator', 'htmlTag'], // Language detection order
      caches: ['localStorage', 'cookie'], // Enable caching in localStorage and cookies
      cookieMinutes: 10080, // Cookie expiration time (7 days)
    },

    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    interpolation: {
      escapeValue: false, // React already escapes output
    },
  });

export default i18n;
