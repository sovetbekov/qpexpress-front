'use client'

import React, { useState } from 'react'
import DropdownInput from '@/app/components/input/DropdownInput'
import { useGetCountriesQuery } from '@/redux/reducers/countriesApi'
import Input from '@/app/components/input/Input'
import {
    CalculatorFormData,
    useCalculatorEffect
} from "@/hooks/client/calculator";
import { CountryData } from '@/types'

export default function CalculatorModal() {
    const [formData, setFormData] = useState<CalculatorFormData>({
        country: undefined,
        weight: 0,
        price: '',
    })
    const {data: countries} = useGetCountriesQuery()
    useCalculatorEffect(formData, setFormData, 300)

    return (
        <div className={'md:flex md:flex-col md:gap-y-5 md:p-20 md:items-center'}>
            <p className={'md:text-2xl'}>Калькулятор</p>
            <DropdownInput<CountryData>
                id={'country'}
                options={countries ?? []}
                wrapperClassname={'md:w-full md:relative'}
                inputClassname={'md:border md:border-black md:rounded-full md:p-4 md:cursor-pointer md:text-black'}
                dropdownClassname={'md:max-h-60 md:w-full z-50 md:overflow-auto md:bg-white md:border md:mx-0 md:my-4 md:rounded-3xl md:border-black'}
                dropdownItemClassname={'md:cursor-pointer w-full text-left md:px-8 md:py-4 md:border-b md:border-b-gray md:hover:bg-gray md:last:border-0'}
                label={'Страна отправления'}
                getOptionValue={(option) => option.name}
                getOptionId={(option) => option.id}
                selected={formData.country}
                setSelected={(country) => setFormData({
                    ...formData,
                    country: country,
                })}
                searchable={true}
                readOnly={true}
                nullable={true}/>
            <Input
                id={'weight'}
                inputType={'numeric'}
                thousandSeparator={','}
                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                inputClassname={'md:w-full md:p-4 md:placeholder-black md:rounded-full md:border md:border-black md:text-black md:disabled:bg-white md:disabled:text-light-gray md:disabled:placeholder-light-gray md:disabled:cursor-not-allowed md:disabled:border-0'}
                label={'Вес (кг)'}
                value={formData.weight}
                onValueChange={(value) => setFormData({
                    ...formData,
                    weight: value.floatValue ?? 0,
                })}
                disabled={!formData.country}/>
            <Input
                id={'price'}
                inputType={'text'}
                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                inputClassname={'md:w-full md:p-4 md:placeholder-black md:rounded-full md:border md:border-black md:text-black md:disabled:bg-white md:disabled:text-light-gray md:disabled:placeholder-light-gray md:disabled:cursor-not-allowed md:disabled:border-gray'}
                label={'Цена'}
                value={formData.price}
                disabled={!formData.country}
                readOnly/>
        </div>
    )
}