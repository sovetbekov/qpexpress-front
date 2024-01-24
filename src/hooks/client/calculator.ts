import React from 'react'
import useDebounce from '@/hooks/client/useDebounce'
import { SetStateAction, useCallback, useEffect } from 'react'
import { CountryData } from '@/types/entities'
import { getCalculatorValues } from '@/services/calculator'
import { isError } from '@/app/lib/utils'

export type CalculatorFormData = {
    country?: CountryData
    weight?: number
    price?: string
}

export function useCalculatorEffect({
                                        weight,
                                        price,
                                        country,
                                    }: CalculatorFormData, setFormData: React.Dispatch<SetStateAction<CalculatorFormData>>, delay: number) {
    const weightDebounce = useDebounce(weight, delay)
    const onCalculatorChange = useCallback(async () => {
        if (!weightDebounce) {
            setFormData({
                weight: weightDebounce, country, price: '',
            })
        } else if (country) {
            const response = await getCalculatorValues({
                countryId: country.id,
                weight: weightDebounce ?? null,
                price: null,
            })
            if (isError(response)) {
                return
            }
            setFormData({
                weight: weightDebounce,
                country,
                price: response.data.price ? response.data.price.toString() : '',
            })
        }
    }, [country, setFormData, weightDebounce])

    useEffect(() => {
        onCalculatorChange().then()
    }, [onCalculatorChange])
}