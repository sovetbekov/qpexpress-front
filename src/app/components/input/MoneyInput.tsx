import React, { Dispatch, SetStateAction, useEffect } from 'react'
import DropdownInput from '@/app/components/input/DropdownInput'
import { useGetCurrenciesQuery } from '@/redux/reducers/currenciesApi'
import clsx from 'clsx'
import Input from './Input'
import { CurrencyData, Errors } from '@/types'

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
    useEffect(() => {
        if (currencies && value?.currency === undefined) {
            onChange?.({
                value: value?.value ?? 0,
                currency: currencies[0],
            })
        }
    }, [currencies, value?.currency])
    return (
        <div className={wrapperClassname} style={wrapperStyle}>
            <Input
                id={id}
                inputType={'numeric'}
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
                setErrors={setErrors}
                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full basis-1/2'} disabled={disabled}
                decimalScale={2}
                className={inputClassname}
                style={inputStyle}
                required={required}
                readOnly={readOnly}
            />
            {
                currencies && value &&
                <DropdownInput<CurrencyData> id={id}
                                             options={currencies}
                                             nullable={false}
                                             wrapperClassname={currencyWrapperClassname}
                                             inputClassname={clsx(currencyInputClassname, 'cursor-pointer')}
                                             dropdownClassname={currencyDropdownClassname}
                                             dropdownStyle={currencyDropdownStyle}
                                             dropdownItemClassname={currencyItemClassname}
                                             label={''}
                                             getOptionValue={(option) => option.name}
                                             getOptionId={(option) => option.id}
                                             selected={value.currency}
                                             errors={errors}
                                             setErrors={setErrors}
                                             setSelected={(currency) => {
                                                 if (currency !== undefined) {
                                                     onChange?.({
                                                         value: value.value,
                                                         currency,
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