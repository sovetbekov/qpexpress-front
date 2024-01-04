'use client'

import { motion } from 'framer-motion'
import React, { useState } from 'react'
import clsx from 'clsx'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

type InputProps = {
    id: string
    label: string | React.ReactNode
    disabled?: boolean
    readOnly?: boolean
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
    inputClassname?: string
    wrapperClassname?: string
    inputRef?: React.Ref<HTMLInputElement>
    labelClassname?: string
    labelColor?: string
    required?: boolean
} & ({ inputType: 'text' | 'email' | 'password', onChange?: (value: string) => void, value?: string } | ({
    inputType: 'numeric'
} & NumericFormatProps))

export default function Input({
                                  inputType,
                                  label,
                                  id,
                                  onChange,
                                  onKeyDown,
                                  onBlur,
                                  onFocus,
                                  disabled,
                                  readOnly,
                                  value,
                                  inputClassname,
                                  required,
                                  labelClassname,
                                  wrapperClassname,
                                  labelColor,
                                  inputRef,
                                  ...props
                              }: InputProps) {
    const [focused, setFocused] = useState(false)
    const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null)

    const variants = {
        'initial': {
            color: labelColor ?? '#9CA3AF',
            x: '0.825rem',
            scale: 1,
        },
        'changed': {
            color: '#000000',
            y: wrapperRef?.offsetHeight ? -wrapperRef?.offsetHeight / 2 + 3 : 0,
            x: '0.825rem',
            scale: 0.75,
        },
    }

    return (
        <motion.div className={wrapperClassname} variants={variants}
                    ref={setWrapperRef}>
            <div className={'absolute top-0 left-0 flex flex-row w-full pointer-events-none items-center'}
                 style={{height: wrapperRef?.offsetHeight}}>
                {
                    wrapperRef && <motion.label variants={variants}
                                                animate={focused || (typeof value === 'string' && value.length > 0) || (typeof value === 'number' && value != 0) ? 'changed' : 'initial'}
                                                initial={'initial'}
                                                className={clsx('block leading-6 origin-top-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[calc(100%-24px)] absolute z-10 pointer-events-none py-0 px-1', labelClassname, {
                                                    'bg-white': !disabled,
                                                    'bg-none': disabled,
                                                })}
                                                htmlFor={id}>
                        {label}
                        {
                            required &&
                            <span>*</span>
                        }
                    </motion.label>
                }
            </div>
            {
                inputType === 'text' &&
                <input id={id} disabled={disabled} readOnly={readOnly} value={value} onKeyDown={onKeyDown}
                       ref={inputRef}
                       className={inputClassname}
                       type={inputType}
                       onFocus={(e) => {
                           if (!disabled && !readOnly) {
                               setFocused(true)
                           }
                           onFocus?.(e)
                       }}
                       onBlur={(e) => {
                           setFocused(false)
                           onBlur?.(e)
                       }}
                       onChange={e => {
                           onChange?.(e.target.value)
                       }}
                       required={required}
                />
            }
            {
                inputType === 'numeric' &&
                <NumericFormat
                    id={id}
                    disabled={disabled}
                    readOnly={readOnly}
                    value={value}
                    onFocus={(e) => {
                        if (!disabled && !readOnly) {
                            setFocused(true)
                        }
                        onFocus?.(e)
                    }}
                    onBlur={(e) => {
                        setFocused(false)
                        onBlur?.(e)
                    }}
                    onChange={onChange}
                    required={required}
                    {...props}
                />
            }
        </motion.div>
    )
}