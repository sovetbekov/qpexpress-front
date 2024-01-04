'use client'

import React, { useEffect } from 'react'
import DropdownInput from '@/app/components/input/DropdownInput'
import { useImmer } from 'use-immer'
import { CountryData } from '@/redux/types'
import { useGetCountriesQuery } from '@/redux/reducers/countriesApi'
import Input from '@/app/components/input/Input'
import { useLazyGetCalculatorValuesQuery } from '@/redux/reducers/calculatorApi'
import useDebounce from '@/hooks/client/useDebounce'

type FormData = {
    country?: CountryData
    weight: string
    price: string
}

export default function CalculatorModal() {
    const [triggerCalculatorRequest] = useLazyGetCalculatorValuesQuery()
    const [formData, updateFormData] = useImmer<FormData>({
        country: undefined,
        weight: '',
        price: '',
    })
    const {data: countries} = useGetCountriesQuery()
    const weight = useDebounce(formData.weight, 300)

    useEffect(() => {
        if (!weight) {
            updateFormData(draft => {
                draft.price = ''
            })
        } else if (formData.country) {
            triggerCalculatorRequest({
                countryId: formData.country.id,
                weight: weight ? parseFloat(weight) : null,
                price: null,
            }).then(({data}) => {
                updateFormData(draft => {
                    draft.price = data?.price ? (data.price + ' $') : ''
                })
            })
        }
    }, [formData.country, triggerCalculatorRequest, updateFormData, weight])

    function updateCountry(country: CountryData | undefined) {
        updateFormData(draft => {
            draft.country = country
        })
    }

    function updateWeight(weight: string) {
        updateFormData(draft => {
            draft.weight = weight
        })
    }

    function updatePrice(price: string) {
        updateFormData(draft => {
            draft.price = price
        })
    }

    return (
        <div className={'md:flex md:flex-col md:gap-y-5 md:p-20 md:items-center'}>
            <p className={'md:text-2xl'}>Калькулятор</p>
            <DropdownInput<CountryData>
                id={'country'}
                options={countries ?? []}
                wrapperClassname={'md:w-full md:relative'}
                inputClassname={'md:border md:border-black md:rounded-full md:p-4 md:cursor-pointer md:text-black'}
                dropdownClassname={'md:max-h-60 md:w-full z-50 md:overflow-auto md:bg-white md:border md:mx-0 md:my-4 md:rounded-3xl md:border-black'}
                dropdownItemClassname={'md:cursor-pointer md:px-8 md:py-4 md:border-b md:border-b-gray md:hover:bg-gray md:last:border-0'}
                label={'Страна отправления'}
                getOptionValue={(option) => option.name}
                getOptionId={(option) => option.id}
                selected={formData.country}
                setSelected={updateCountry}
                searchable={true}
                readOnly={true}
                nullable={true}/>
            <Input
                id={'weight'}
                inputType={'text'}
                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                inputClassname={'md:w-full md:p-4 md:placeholder-black md:rounded-full md:border md:border-black md:text-black md:disabled:bg-white md:disabled:text-light-gray md:disabled:placeholder-light-gray md:disabled:cursor-not-allowed md:disabled:border-0'}
                label={'Вес (кг)'}
                value={formData.weight}
                onChange={value => updateWeight(value)}
                disabled={!formData.country}/>
            <Input
                id={'price'}
                inputType={'text'}
                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                inputClassname={'md:w-full md:p-4 md:placeholder-black md:rounded-full md:border md:border-black md:text-black md:disabled:bg-white md:disabled:text-light-gray md:disabled:placeholder-light-gray md:disabled:cursor-not-allowed md:disabled:border-gray'}
                label={'Цена'}
                value={formData.price}
                onChange={value => updatePrice(value)}
                disabled={!formData.country}
                readOnly/>
        </div>
    )
}