'use client'

import React, { Dispatch, forwardRef, SetStateAction, useState } from 'react'
import { Errors } from '@/types'
import Label from '@/app/components/input/Label'
import { PatternFormat, PatternFormatProps } from 'react-number-format'
import { animated, useSpring } from '@react-spring/web'

type Props = {
    id: string
    disabled?: boolean
    readOnly?: boolean
    label?: string
    errors?: Errors
    setErrors?: Dispatch<SetStateAction<Errors>>
    setFocused?: Dispatch<SetStateAction<boolean>>
} & PatternFormatProps

const AnimatedPatternFormat = animated(PatternFormat)

const MaskInput = forwardRef<HTMLInputElement, Props>(({customInput, ...props}, ref) => {
    const {
        setErrors,
        errors,
        label,
        ...restProps
    } = props

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
        <div className={'relative'}>
            <Label inputChanged={true}
                   focused={focused}
                   htmlFor={props.id}
                   disabled={props.disabled}>
                {props.label}
            </Label>
            <AnimatedPatternFormat style={inputAnimation}
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
                                       props.setErrors?.({
                                           ...props.errors,
                                           [props.id]: [],
                                       })
                                   }}
                                   {...restProps}/>
        </div>)
})

MaskInput.displayName = 'TextInput'

export default MaskInput