'use client'

import React, { Dispatch, forwardRef, SetStateAction, useState } from 'react'
import { Errors } from '@/types'
import Label from '@/app/components/input/Label'
import { animated, useSpring } from '@react-spring/web'

type Props = {
    id: string
    disabled?: boolean
    readOnly?: boolean
    label?: string | React.ReactNode
    errors?: Errors
    inputColor?: string
    setErrors?: Dispatch<SetStateAction<Errors>>
} & React.InputHTMLAttributes<HTMLInputElement>

const TextInput
    = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const [inputAnimation, inputApi] = useSpring(() => ({
        borderColor: '#000000',
        outlineColor: '#000000',
        color: '#000000',
    }))

    const [inputRef, setInputRef] = useState<HTMLInputElement>()
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

    const setRef = (node: HTMLInputElement) => {
        setInputRef(node)
        if (ref) {
            if (typeof ref === 'function') {
                ref(node)
            } else {
                ref.current = node
            }
        }
    }

    return (
        <div className={'relative'}>
            {
                inputRef &&
                <Label inputElement={inputRef}
                       labelColor={props.inputColor}
                       inputChanged={(props?.value as string).length !== 0}
                       focused={focused}
                       htmlFor={props.id}
                       disabled={props.disabled}>
                    {props.label}
                </Label>
            }
            <animated.input style={{...inputAnimation, color: props.inputColor ?? '#000'}}
                            ref={setRef}
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
                            readOnly
                            {...props}/>
        </div>)
})

TextInput.displayName = 'TextInput'

export default TextInput