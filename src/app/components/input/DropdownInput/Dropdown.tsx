'use client'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import React, { forwardRef, PropsWithChildren } from 'react'

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
    const dropdownAnimation: Variants = {
        open: {
            opacity: 1,
        },
        closed: {
            opacity: 0,
        },
    }

    return (
        <AnimatePresence>
            {
                isOpen && <motion.div
                    variants={dropdownAnimation}
                    animate={isOpen ? 'open' : 'closed'}
                    initial={'closed'}
                    exit={'closed'}
                    ref={ref}
                    className={props.className}
                    style={{...props.style}}>
                    {props.children}
                </motion.div>
            }
        </AnimatePresence>
    )
})

Dropdown.displayName = 'Dropdown'

export default Dropdown