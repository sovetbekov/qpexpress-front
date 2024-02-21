'use client'

import React, { Dispatch, SetStateAction, useEffect } from 'react'
import DropdownInput from '@/app/components/input/DropdownInput/DropdownInput'
import { useGetCurrenciesQuery } from '@/redux/reducers/currenciesApi'
import clsx from 'clsx'
import { CurrencyData, Errors } from '@/types'
import NumericInput from '@/app/components/input/NumericInput'

type Props = {
    id: string
    onChange?: (value: Money) => void
    value?: Money
    label?: string
    inputClassname?: string
    inputStyle?: React.CSSProperties
    wrapperClassname?: string
    wrapperStyle?: React.CSSProperties
    currencyWrapperClassname?: string
    currencyDropdownClassname?: string
    currencyDropdownStyle?: React.CSSProperties
    currencyInputClassname?: string
    currencyItemClassname?: string
    disabled?: boolean
    required?: boolean
    readOnly?: boolean
    errors?: Errors
    setErrors?: Dispatch<SetStateAction<Errors>>
}

export type Money = {
    value: number
    currency: CurrencyData
}

export default function MoneyInput({
                                       id,
                                       onChange,
                                       value,
                                       label,
                                       inputClassname,
                                       inputStyle,
                                       wrapperClassname,
                                       wrapperStyle,
                                       errors,
                                       setErrors,
                                       disabled,
                                       readOnly,
                                       currencyWrapperClassname,
                                       currencyInputClassname,
                                       currencyDropdownClassname,
                                       currencyDropdownStyle,
                                       currencyItemClassname,
                                       required,
                                   }: Readonly<Props>) {
    const {data: currencies} = useGetCurrenciesQuery()
    const currencyOptions = currencies?.map(currency => {
        return {
            id: currency.id,
            value: currency,
            label: currency.name,
        }
    }) ?? []
    useEffect(() => {
        if (currencies && value?.currency === undefined) {
            onChange?.({
                value: value?.value ?? 0,
                currency: currencies[0],
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currencies, value?.currency])
    return (
        <div className={wrapperClassname} style={wrapperStyle}>
            <NumericInput
                id={id}
                thousandSeparator={','}
                label={label ?? ''}
                value={value?.value === 0 ? '' : value?.value ?? ''}
                onValueChange={e => {
                    if (value) {
                        onChange?.({
                            value: e.floatValue ?? 0,
                            currency: value.currency,
                        })
                    }
                }}
                errors={errors}
                setErrors={setErrors} disabled={disabled}
                decimalScale={2}
                className={inputClassname}
                style={inputStyle}
                required={required}
                readOnly={readOnly}
            />
            {
                currencies && value &&
                <DropdownInput<CurrencyData> id={id}
                                             options={currencyOptions}
                                             nullable={false}
                                             wrapperClassname={currencyWrapperClassname}
                                             inputClassname={clsx(currencyInputClassname, 'cursor-pointer')}
                                             dropdownClassname={currencyDropdownClassname}
                                             dropdownStyle={currencyDropdownStyle}
                                             dropdownItemClassname={currencyItemClassname}
                                             label={''}
                                             selected={value.currency}
                                             errors={errors}
                                             setErrors={setErrors}
                                             setSelected={(currency) => {
                                                 if (currency !== undefined) {
                                                     onChange?.({
                                                         value: value.value,
                                                         currency: currency.value,
                                                     })
                                                 }
                                             }} searchable={false} readOnly={readOnly} disabled={disabled}/>
            }
            {
                !value &&
                <div className={clsx(currencyWrapperClassname, 'h-full')}>
                    <div className={clsx(currencyInputClassname, 'h-full bg-gray-2 border-none')}>
                    </div>
                </div>
            }
        </div>
    )
}