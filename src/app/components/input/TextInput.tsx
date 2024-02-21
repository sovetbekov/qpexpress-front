'use client'

import { motion, MotionProps } from 'framer-motion'
import React, { Dispatch, forwardRef, SetStateAction, useState } from 'react'
import { Errors } from '@/types'
import Label from '@/app/components/input/Label'

type Props = {
    id: string
    disabled?: boolean
    readOnly?: boolean
    label?: string | React.ReactNode
    errors?: Errors
    setErrors?: Dispatch<SetStateAction<Errors>>
} & React.InputHTMLAttributes<HTMLInputElement> & MotionProps

const TextInput
    = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const inputVariants = {
        'initial': {
            borderColor: '#000000',
            outlineColor: '#000000',
            color: '#000000',
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

    const [inputRef, setInputRef] = useState<HTMLInputElement>()
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

    let animate = ['initial']
    if (props.disabled) {
        animate.push('disabled')
    }
    if (props.errors?.[props.id]?.length) {
        animate.push('error')
    }

    return (
        <div className={'relative'}>
            {
                inputRef &&
                <Label inputElement={inputRef}
                       inputChanged={(props?.value as string).length !== 0}
                       focused={focused}
                       htmlFor={props.id}
                       disabled={props.disabled}>
                    {props.label}
                </Label>
            }
            <motion.input variants={inputVariants}
                          animate={animate}
                          initial={'initial'}
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
                          {...props}/>
        </div>)
})

TextInput.displayName = 'TextInput'

export default TextInput