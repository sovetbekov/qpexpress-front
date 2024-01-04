import React, { useEffect } from 'react'
import DropdownInput from '@/app/components/input/DropdownInput'
import { CurrencyData } from '@/redux/types'
import { useGetCurrenciesQuery } from '@/redux/reducers/currenciesApi'
import clsx from 'clsx'
import Input from './Input'

type Props = {
    id: string
    onChange: (value: Money) => void
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
                                       disabled,
                                       currencyWrapperClassname,
                                       currencyInputClassname,
                                       currencyDropdownClassname,
                                       currencyDropdownStyle,
                                       currencyItemClassname,
                                       required,
                                   }: Props) {
    const {data: currencies} = useGetCurrenciesQuery()
    useEffect(() => {
        if (currencies && value?.currency === undefined) {
            onChange({
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
                        onChange({
                            value: e.floatValue ?? 0,
                            currency: value.currency,
                        })
                    }
                }}
                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full basis-1/2'} disabled={disabled}
                decimalScale={2}
                className={inputClassname}
                style={inputStyle}
                required={required}
            />
            {
                currencies && value &&
                <DropdownInput<CurrencyData> id={'currency'}
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
                                             setSelected={(currency) => {
                                                 if (currency !== undefined) {
                                                     onChange({
                                                         value: value.value,
                                                         currency,
                                                     })
                                                 }
                                             }} searchable={true} readOnly={true} disabled={disabled}/>
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