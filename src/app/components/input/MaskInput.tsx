'use client'

import { motion, MotionProps } from 'framer-motion'
import React, { Dispatch, forwardRef, SetStateAction, useState } from 'react'
import { Errors } from '@/types'
import Label from '@/app/components/input/Label'
import { PatternFormat, PatternFormatProps } from 'react-number-format'

type Props = {
    id: string
    disabled?: boolean
    readOnly?: boolean
    label?: string
    errors?: Errors
    setErrors?: Dispatch<SetStateAction<Errors>>
    setFocused?: Dispatch<SetStateAction<boolean>>
} & PatternFormatProps & MotionProps

const MotionPatternFormat = motion(PatternFormat)

const PatternInput
    = forwardRef<HTMLInputElement, Props>(({customInput, ...props}, ref) => {
    const inputVariants = {
        'initial': {
            borderColor: '#000000',
            outlineColor: '#000000',
        },
        'error': {
            borderColor: '#FE5C00',
            color: '#FE5C00',
            outlineColor: '#FE5C00',
        },
        'disabled': {
            borderColor: '#9CA3AF',
            color: '#9CA3AF',
            outlineColor: '#9CA3AF',
        },
    }

    const [inputRef, setInputRef] = useState<HTMLInputElement | undefined>(undefined)
    const [focused, setFocused] = useState(false)

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
                       inputChanged={!!props.value}
                       focused={focused}
                       htmlFor={props.id}
                       disabled={props.disabled}>
                    {props.label}
                </Label>
            }
            <MotionPatternFormat variants={inputVariants}
                                 initial={'initial'}
                                 value={!props.value ? '' : props.value}
                                 getInputRef={setRef}
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
                                 {...props}/>
        </div>)
})

PatternInput.displayName = 'TextInput'

export default PatternInput