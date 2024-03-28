'use client'

import React, { useState } from 'react'
import DropdownInput from '@/app/components/input/DropdownInput/DropdownInput'
import { useGetCountriesQuery } from '@/redux/reducers/countriesApi'
import {
    CalculatorFormData,
    useCalculatorEffect,
} from '@/hooks/client/calculator'
import { CountryData } from '@/types'
import NumericInput from '@/app/components/input/NumericInput'
import { useTranslation } from '@/app/i18n/client'
import ModalHeader from '@/app/components/modal/ModalHeader'
import ModalBody from '@/app/components/modal/ModalBody'
import { getNameByLanguage } from '@/util'

type Props = {
    language: string,
}

export default function CalculatorModal({language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'calculator')
    const [formData, setFormData] = useState<CalculatorFormData>({
        country: undefined,
        weight: 0,
    })
    const {data: countries} = useGetCountriesQuery()
    const countryOptions = countries?.map(country => {
        return {
            id: country.id,
            value: country,
            label: getNameByLanguage(country, language),
        }
    }) ?? []

    useCalculatorEffect(formData, setFormData, 300)

    return (
        <div className={'md:flex md:flex-col md:gap-y-5 md:p-10 md:items-center'}>
            <ModalHeader>
                <div className={'w-full'}>
                    <p className={'text-xl font-bold text-center md:text-2xl'}>Калькулятор</p>
                </div>
            </ModalHeader>
            <ModalBody>
                <div className={'flex flex-col gap-5'}>
                    <div className={'relative'}>
                        <DropdownInput<CountryData> id={'country'}
                                                    options={countryOptions}
                                                    wrapperClassname={'w-full'}
                                                    inputClassname={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-[25rem] p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                                                    dropdownClassname={'w-[calc(100vw-2.5rem)] z-50 md:max-h-60 md:w-[25rem] overflow-auto bg-white border my-4 rounded-3xl border-solid border-black'}
                                                    dropdownItemClassname={'cursor-pointer px-8 py-4 border-b-black border-b border-solid last:border-b-0 hover:bg-gray'}
                                                    label={t('country')}
                                                    selected={formData.country?.id}
                                                    setSelected={(country) => setFormData({
                                                        ...formData,
                                                        country: country?.value,
                                                    })}
                                                    searchable={true}
                                                    readOnly={true}
                                                    nullable={true}/>
                    </div>
                    <NumericInput label={t('weight')} id={'weight'} thousandSeparator={','}
                                  onValueChange={(value) => setFormData({
                                      ...formData,
                                      weight: value.floatValue ?? 0,
                                  })}
                                  disabled={!formData.country} value={formData.weight === 0 ? '' : formData.weight}
                                  className={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-[25rem] p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}/>
                    <div className={'relative'}>
                        <NumericInput type={'text'} label={t('price')} id={'price'}
                                      thousandSeparator={','}
                                      suffix={'$'}
                                      disabled={!formData.country} value={formData.priceUSD}
                                      className={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-[25rem] p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                                      readOnly/>
                        {
                            formData.priceKZT &&
                            <span className={'absolute right-5 top-1/2 -translate-y-1/2 text-dark-gray'}>
                                    {formData.priceKZT} ₸
                                </span>
                        }
                    </div>
                </div>
            </ModalBody>
        </div>
    )
}