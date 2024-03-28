'use client'

import React, { Dispatch, forwardRef, SetStateAction, useState } from 'react'
import { Errors } from '@/types'
import Label from '@/app/components/input/Label'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { animated, useSpring } from '@react-spring/web'
import clsx from 'clsx'

type Props = {
    id: string
    disabled?: boolean
    readOnly?: boolean
    label?: string
    errors?: Errors
    wrapperClassname?: string,
    setErrors?: Dispatch<SetStateAction<Errors>>
    setFocused?: Dispatch<SetStateAction<boolean>>
} & NumericFormatProps

const AnimatedNumericFormat = animated(NumericFormat)

const NumericInput
    = forwardRef<HTMLInputElement, Props>(({customInput, setErrors, wrapperClassname, ...props}, ref) => {
    const [inputAnimation, inputApi] = useSpring(() => ({
        borderColor: '#000000',
        outlineColor: '#000000',
        color: '#000000',
    }))
    const [focused, setFocused] = useState(false)
    const hasError = !!props.errors?.[props.id]?.length

    if (hasError) {
        inputApi.start({
            borderColor: '#FE5C00',
            color: '#FE5C00',
            outlineColor: '#FE5C00',
            config: {tension: 180, friction: 12},
        })
    } else {
        inputApi.start({
            borderColor: props.disabled ? '#9CA3AF' : '#000000',
            color: props.disabled ? '#9CA3AF' : '#000000',
            outlineColor: props.disabled ? '#9CA3AF' : '#000000',
            config: {tension: 180, friction: 12},
        })
    }

    return (
        <div className={clsx('relative', wrapperClassname)}>
            <Label inputChanged={!!props.value}
                   focused={focused}
                   htmlFor={props.id}
                   disabled={props.disabled}>
                {props.label}
            </Label>
            <AnimatedNumericFormat style={inputAnimation}
                                   value={!props.value ? '' : props.value}
                                   getInputRef={ref}
                                   onFocus={(e) => {
                                       if (props.disabled) {
                                           return
                                       }
                                       setFocused(true)
                                       props.onFocus?.(e)
                                   }}
                                   onBlur={(e) => {
                                       if (props.disabled) {
                                           return
                                       }
                                       setFocused(false)
                                       props.onBlur?.(e)
                                   }}
                                   onChange={e => {
                                       props.onChange?.(e)
                                       setErrors?.({
                                           ...props.errors,
                                           [props.id]: [],
                                       })
                                   }}
                                   {...props}/>
        </div>)
})

NumericInput.displayName = 'TextInput'

export default NumericInput