'use client'

import React, { Dispatch, forwardRef, SetStateAction, useState } from 'react'
import { Errors } from '@/types'
import Label from '@/app/components/input/Label'
import { animated, useSpring } from '@react-spring/web'
import clsx from 'clsx'

type Props = {
    id: string
    disabled?: boolean
    readOnly?: boolean
    wrapperClassname?: string
    label?: string | React.ReactNode
    errors?: Errors
    inputColor?: string
    setErrors?: Dispatch<SetStateAction<Errors>>
} & React.InputHTMLAttributes<HTMLInputElement>

const TextInput
    = forwardRef<HTMLInputElement, Props>((props, ref) => {
        const {inputColor, setErrors, ...restProps} = props
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
        <div className={clsx('relative', props.wrapperClassname)}>
            <Label labelColor={inputColor}
                   inputChanged={!!props.value}
                   focused={focused}
                   htmlFor={props.id}
                   disabled={props.disabled}>
                {props.label}
            </Label>
            <animated.input style={{...inputAnimation, color: props.inputColor ?? '#000'}}
                            ref={ref}
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
                            tabIndex={props.readOnly ? -1 : 0}
                            {...restProps}/>
        </div>)
})

TextInput.displayName = 'TextInput'

export default TextInput