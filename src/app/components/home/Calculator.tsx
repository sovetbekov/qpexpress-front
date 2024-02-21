'use client'

import React, { useState } from 'react'
import DropdownInput from '@/app/components/input/DropdownInput/DropdownInput'
import Image from 'next/image'
import { useGetCountriesQuery } from '@/redux/reducers/countriesApi'
import { useAuthenticationActions } from '@/hooks/client/useAuthenticationActions'
import { useTranslation } from '@/app/i18n/client'
import {
    CalculatorFormData,
    useCalculatorEffect,
} from '@/hooks/client/calculator'
import { CountryData } from '@/types'
import TextInput from '@/app/components/input/TextInput'
import NumericInput from '@/app/components/input/NumericInput'

type Props = {
    language: string,
}

export default function Calculator({language}: Readonly<Props>) {
    const {data: countries} = useGetCountriesQuery()
    const {t} = useTranslation(language, 'calculator')
    const [formData, setFormData] = useState<CalculatorFormData>({
        country: undefined,
        weight: 0,
        price: '',
    })
    const {onSignUpClick} = useAuthenticationActions()
    useCalculatorEffect(formData, setFormData, 300)

    const countryOptions = countries?.map(country => {
        return {
            id: country.id,
            value: country,
            label: country.name,
        }
    }) ?? []

    return (
        <div className={'p-5 w-full flex flex-col md:py-4 md:px-20 md:gap-x-14'} id={'calculator'}>
            <h2 className={'text-[1.5rem] md:text-[3rem]'}>
                {t('title')}
            </h2>
            <div className={'flex flex-col md:flex-row md:items-center md:col-gap-12'}>
                <div className={'flex flex-col items-left gap-y-4'}>
                    <p className={'text-[1rem]'}>
                        {t('description')}
                    </p>
                    <div className={'flex flex-col w-full items-center gap-4'}>
                        <DropdownInput<CountryData> id={'country'}
                                                    options={countryOptions}
                                                    wrapperClassname={'w-full'}
                                                    inputClassname={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-[25rem] p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                                                    dropdownClassname={'w-[calc(100vw-2.5rem)] z-50 md:max-h-60 md:w-[25rem] overflow-auto bg-white border my-4 rounded-3xl border-solid border-black'}
                                                    dropdownItemClassname={'cursor-pointer px-8 py-4 border-b-black border-b border-solid last:border-b-0 hover:bg-gray'}
                                                    label={t('country')}
                                                    selected={formData.country}
                                                    setSelected={(country) => setFormData({
                                                        ...formData,
                                                        country: country?.value,
                                                    })}
                                                    searchable={true}
                                                    readOnly={true}
                                                    nullable={true}/>
                        <NumericInput label={t('weight')} id={'weight'} thousandSeparator={','}
                               onValueChange={(value) => setFormData({
                                   ...formData,
                                   weight: value.floatValue ?? 0,
                               })}
                               disabled={!formData.country} value={formData.weight === 0 ? '' : formData.weight}
                               className={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-[25rem] p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}/>
                        <TextInput type={'text'} label={t('price')} id={'weight'}
                                   disabled={!formData.country} value={formData.price}
                                   className={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-[25rem] p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                                   readOnly/>
                        <button
                            className={'bg-blue text-white cursor-pointer w-full md:w-[25rem] mt-4 md:px-8 py-4 rounded-full border-0'}
                            onClick={onSignUpClick}>
                            {t('sign_up')}
                        </button>
                    </div>
                </div>
                <div
                    className={'relative object-cover object-center w-full h-32 order-first md:h-[25rem] md:order-last'}>
                    <Image src={'/assets/calculator.svg'} alt={'calculator'} fill={true} placeholder={'empty'}
                           objectFit={'contain'}/>
                </div>
            </div>
        </div>
    )
}