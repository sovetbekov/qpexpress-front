import React from 'react'
import useDebounce from '@/hooks/client/useDebounce'
import { SetStateAction, useCallback, useEffect } from 'react'
import { CountryData } from '@/types/entities'
import { getCalculatorValues } from '@/services/calculator'
import { isError } from '@/app/lib/utils'

export type CalculatorFormData = {
    country?: CountryData
    weight?: number
    priceUSD?: string
    priceKZT?: string
}

export function useCalculatorEffect({
                                        weight,
                                        priceUSD,
                                        priceKZT,
                                        country,
                                    }: CalculatorFormData, setFormData: React.Dispatch<SetStateAction<CalculatorFormData>>, delay: number) {
    const weightDebounce = useDebounce(weight, delay)
    const onCalculatorChange = useCallback(async () => {
        if (!weightDebounce) {
            setFormData({
                weight: weightDebounce, country, priceUSD, priceKZT,
            })
        } else if (country) {
            const response = await getCalculatorValues({
                countryId: country.id,
                weight: weightDebounce ?? null,
            })
            if (isError(response)) {
                return
            }
            setFormData({
                weight: weightDebounce,
                country,
                priceKZT: response.data.priceKZT ? response.data.priceKZT.toString() : '',
                priceUSD: response.data.priceUSD ? response.data.priceUSD.toString() : '',
            })
        }
    }, [country, setFormData, weightDebounce])

    useEffect(() => {
        onCalculatorChange().then()
    }, [onCalculatorChange])
}