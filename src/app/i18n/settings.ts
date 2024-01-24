import { TOptions } from 'i18next'

export const fallbackLanguage = 'ru';
export const languages = ['ru', 'en', 'zh'];
export const defaultNS = 'translation'
export const cookieName = 'next-i18n-locale';

export function getOptions (language = fallbackLanguage, ns = defaultNS): TOptions {
  return {
    // debug: true,
    supportedLanguages: languages,
    fallbackLanguage,
    lng: language,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}