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
    // Fallback if no language is detected
    fallbackLng: 'en',
    debug: true,

    detection: {
      // Language detection order
      order: ['localStorage', 'cookie', 'querystring', 'navigator', 'htmlTag'],
      // Enable caching in localStorage and cookies
      caches: ['localStorage', 'cookie'],
      // Cookie expiration time (7 days)
      cookieMinutes: 10080,
    },

    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    interpolation: {
      // React already escapes output
      escapeValue: false,
    },
  });

export default i18n;
