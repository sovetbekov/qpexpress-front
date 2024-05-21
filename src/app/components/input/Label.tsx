import React, { LabelHTMLAttributes, PropsWithChildren, useEffect, useState } from 'react'
import { Errors } from '@/types'
import { animated, useSpring } from '@react-spring/web'
import clsx from 'clsx'

type Props = {
    errors?: Errors
    inputChanged: boolean
    focused: boolean
    required?: boolean
    labelColor?: string
    disabled?: boolean
} & LabelHTMLAttributes<HTMLLabelElement>

export default function Label({
                                  errors,
                                  focused,
                                  className,
                                  inputChanged,
                                  labelColor,
                                  children,
                                  required,
                                  disabled,
                                  ...props
                              }: PropsWithChildren<Props>) {
    const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null)
    const labelChanged = focused || inputChanged

    const [labelColorAnimation, labelColorApi] = useSpring(() => ({
        color: labelColor ?? '#000000',
    }))

    const [labelPositionAnimation, labelPositionApi] = useSpring(() => {
        if (!!wrapperRef) {
            if (inputChanged) {
                return {
                    y: -((wrapperRef?.offsetHeight ?? 0) / 2),
                    scale: 0.75,
                }
            } else {
                return {
                    y: 0,
                    scale: 1,
                }
            }
        }
    }, [wrapperRef, inputChanged])

    const hasError = props.htmlFor && !!errors?.[props.htmlFor]?.length

    useEffect(() => {
        if (labelChanged && wrapperRef) {
            labelPositionApi.start({
                y: -(wrapperRef?.offsetHeight ?? 0) / 2,
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
    }, [labelChanged, labelPositionApi, wrapperRef])

    if (hasError) {
        labelColorApi.start({
            color: '#FE5C00',
        });
    } else if (disabled) {
        labelColorApi.start({
            color: '#9CA3AF',
        });
    } else {
        labelColorApi.start({
            color: labelColor ?? '#000000',
        });
    }
    

    return (
        <div className={'absolute top-0 left-0 flex h-full w-full items-center pointer-events-none pl-5'}
             ref={setWrapperRef}>
            <animated.label
                style={{
                    ...labelPositionAnimation,
                    color: labelColorAnimation.color, // Apply animated color
                    backgroundColor: labelColorAnimation.background ?? 'white', // Set background color
                }}
                className={clsx('origin-left', className)}
                {...props}
            >
                {children}
                {required && <span>*</span>}
            </animated.label>
        </div>
    )
}
