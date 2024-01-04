import { createInstance, i18n } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { getOptions } from './settings'

const initI18next = async (language: string, ns: string): Promise<i18n> => {
    const i18nInstance = createInstance()
    await i18nInstance
        .use(initReactI18next)
        .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
        .init(getOptions(language, ns))
    return i18nInstance
}

export async function useTranslation(language: string, ns: string, options?: {keyPrefix?: string}) {
    const i18nextInstance = await initI18next(language, ns)
    return {
        t: i18nextInstance.getFixedT(language, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix),
        i18n: i18nextInstance
    }
}