import { CountryData, CurrencyData } from '@/types'

export function getNameByLanguage(data: CurrencyData | CountryData, language: string) {
    if (language === 'ru') {
        return data.nameRus
    } else if (language === 'en') {
        return data.nameEng
    } else if (language === 'zh') {
        return data.nameChn
    }
    return data.nameRus
}