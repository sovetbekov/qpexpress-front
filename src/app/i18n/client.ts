'use client'

import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import { useCookies } from 'react-cookie'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages, cookieName } from './settings'

const runsOnServerSide = typeof window === 'undefined'

//
i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init({
        ...getOptions(),
        lng: undefined, // let detect the language on client side
        detection: {
            order: ['path', 'htmlTag', 'cookie', 'navigator'],
        },
        preload: runsOnServerSide ? languages : []
    })

export function useTranslation(language: string, ns: string, options?: any) {
    const [cookies, setCookie] = useCookies([cookieName])
    const ret = useTranslationOrg(ns, options)
    const { i18n } = ret
    const cookie = cookies['next-i18n-locale']
    if (runsOnServerSide && language && i18n.resolvedLanguage !== language) {
        i18n.changeLanguage(language)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (activeLng === i18n.resolvedLanguage) return
            setActiveLng(i18n.resolvedLanguage)
        }, [activeLng, i18n.resolvedLanguage])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (!language || i18n.resolvedLanguage === language) return
            i18n.changeLanguage(language)
        }, [language, i18n])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (cookie === language) return
            setCookie(cookieName, language, { path: '/' })
        }, [language, setCookie])
    }
    return ret
}