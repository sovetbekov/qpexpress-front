'use client'

import React, { forwardRef, PropsWithChildren } from 'react'
import { animated, useTransition } from '@react-spring/web'

type Props = {
    isOpen: boolean
    className?: string
    style?: React.CSSProperties
}

export type Option<T> = {
    id: string
    value: T
    label: React.ReactNode
    searchLabel?: string
}

const Dropdown = forwardRef<HTMLDivElement, PropsWithChildren<Props>>((props, ref) => {
    const {
        isOpen,
    } = props
    const dropdownTransition = useTransition(isOpen, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
    })

    return dropdownTransition((style, isOpen) => (
        isOpen && <animated.div
            ref={ref}
            className={props.className}
            style={{...props.style, ...style}}>
            {props.children}
        </animated.div>
    ))
})

Dropdown.displayName = 'Dropdown'

export default Dropdown