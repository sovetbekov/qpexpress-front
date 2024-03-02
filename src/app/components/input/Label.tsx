'use client'

import React, { LabelHTMLAttributes, PropsWithChildren, useLayoutEffect, useRef, useState } from 'react'
import { Errors } from '@/types'
import { ReferenceElement } from '@floating-ui/dom'
import { animated, useSpring } from '@react-spring/web'

type Props = {
    errors?: Errors
    inputElement: HTMLInputElement
    inputChanged: boolean
    focused: boolean
    required?: boolean
    labelColor?: string
    disabled?: boolean
} & LabelHTMLAttributes<HTMLLabelElement>

export default function Label({
                                  errors,
                                  focused,
                                  inputElement,
                                  className,
                                  inputChanged,
                                  labelColor,
                                  children,
                                  required,
                                  disabled,
                                  ...props
                              }: PropsWithChildren<Props>) {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState<number>(0)

    const [labelColorAnimation, labelColorApi] = useSpring(() => ({
        color: labelColor ?? '#9CA3AF',
        background: 'white',
    }))

    const [labelPositionAnimation, labelPositionApi] = useSpring(() => ({
        y: 0,
        x: '0.825rem',
        scale: 1,
    }))
    const labelChanged = focused || inputChanged
    const hasError = props.htmlFor && !!errors?.[props.htmlFor]?.length
    if (labelChanged) {
        labelPositionApi.start({
            y: -height / 2,
            scale: 0.75,
            config: {
                tension: 180,
                friction: 12,
            },
        })
    } else {
        labelPositionApi.start({
            y: 0,
            scale: 1,
            config: {
                tension: 180,
                friction: 12,
            },
        })
    }

    if (hasError) {
        labelColorApi.start({
            color: '#FE5C00',
        })
    } else if (disabled) {
        labelColorApi.start({
            color: '#9CA3AF',
            background: 'none',
        })
    } else {
        labelColorApi.start({
            color: labelColor ?? '#000000',
            background: 'white',
        })
    }

    return (
        <div className={'absolute top-0 left-0 flex justify-center items-center pointer-events-none'}
             style={{height: height ?? 'auto'}} ref={wrapperRef}>
            <animated.label style={{...labelPositionAnimation, ...labelColorAnimation}}
                            className={className}
                            {...props}>
                {children}
                {
                    required &&
                    <span>*</span>
                }
            </animated.label>
        </div>
    )
}