'use client'

import React, { forwardRef, PropsWithChildren, useEffect, useState } from 'react'
import { animated, useTransition } from '@react-spring/web'

type Props = {
    isOpen: boolean
    className?: string
    style?: React.CSSProperties
    onClose: () => void
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
        onClose,
    } = props

    const [dropdownElement, setDropdownElement] = useState<HTMLDivElement | null>(null)

    function setRefs(node: HTMLDivElement) {
        setDropdownElement(node)
        if (ref) {
            if (typeof ref === 'function') {
                ref(node)
            } else {
                ref.current = node
            }
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [dropdownElement, onClose])

    const dropdownTransition = useTransition(isOpen, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
    })

    return dropdownTransition((style, isOpen) => (
        isOpen && <animated.div
            ref={setRefs}
            className={props.className}
            style={{...props.style, ...style}}>
            {props.children}
        </animated.div>
    ))
})

Dropdown.displayName = 'Dropdown'

export default Dropdown