import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

import translationUz from "./assets/locales/uz/translation.json";
import translationRu from "./assets/locales/ru/translation.json";
import translationEn from "./assets/locales/en/translation.json";
import translationAr from './assets/locales/ar/translation.json';
const resources = {
  uz: {
    translation: translationUz,
  },
  ru: {
    translation: translationRu,
  },
  en: {
    translation: translationEn,
  },
  ar:{
    translation: translationAr,
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    resources,
    supportedLngs: [ "en",  "uz","ru","ar"],
    fallbackLng: "en",
    detection: {
      order: [
        "cookie",
        "path",
        "htmlTag",
        "localStorage",
        "sessionStorage",
        "subdomain",
      ],
      caches: ["cookie"],
    },
    react: { useSuspense: true },
    // backend: {
    //   loadPath: "/assets/locales/{{lng}}/translation.json",
    // },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
