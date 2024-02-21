'use client'

import { motion, MotionProps } from 'framer-motion'
import React, { LabelHTMLAttributes, PropsWithChildren } from 'react'
import { Errors } from '@/types'
import { ReferenceElement } from '@floating-ui/dom'

type Props = {
    errors?: Errors
    inputElement: HTMLElement | ReferenceElement
    inputChanged: boolean
    focused: boolean
    required?: boolean
    disabled?: boolean
} & LabelHTMLAttributes<HTMLLabelElement> & MotionProps

export default function Label({
                                  errors,
                                  focused,
                                  inputElement,
                                  className,
                                  inputChanged,
                                  children,
                                  required,
                                  disabled,
                                  ...props
                              }: PropsWithChildren<Props>) {
    const dimensions = inputElement.getBoundingClientRect()
    const labelVariants = {
        'initial': {
            color: props.color,
            x: '1rem',
            y: 0,
            scale: 1,
            background: 'white',
        },
        'changed': {
            x: '0.5rem',
            y: dimensions?.height ? -dimensions.height / 2 : 0,
            scale: 0.75,
        },
        'error': {
            color: '#FE5C00',
        },
        'disabled': {
            color: '#9CA3AF',
            background: 'none',
        },
    }
    const labelChanged = focused || inputChanged
    const animate = labelChanged ? ['changed'] : ['initial']
    if (props.htmlFor && !!errors?.[props.htmlFor]?.length) {
        animate.push('error')
    }
    if (disabled) {
        animate.push('disabled')
    }
    return (
        <div className={'absolute top-0 left-0 flex justify-center items-center pointer-events-none'} style={{height: dimensions?.height ?? 'auto'}}>
            <motion.label variants={labelVariants}
                          animate={animate}
                          initial={'initial'}
                          className={className}
                          {...props}>
                {children}
                {
                    required &&
                    <span>*</span>
                }
            </motion.label>
        </div>
    )
}