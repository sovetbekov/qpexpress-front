'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import React, { useRef } from 'react'

type Props = {
    id?: string
    label: string
    checked: boolean
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    disabled?: boolean
    wrapperClassname?: string
    labelClassname?: string
    checkboxClassname?: string
    readOnly?: boolean
}

export default function CheckboxInput(
    {
        id,
        label,
        checked,
        disabled,
        labelClassname,
        checkboxClassname,
        wrapperClassname,
        onChange,
        readOnly,
    }: Readonly<Props>,
) {
    const tickVariants = {
        pressed: {pathLength: checked ? 0.85 : 0.2},
        checked: {pathLength: 1},
        unchecked: {pathLength: 0},
        disabled: {stroke: '#ddd'},
        active: {stroke: disabled ? '#000' : 'var(--blue-color)'},
    }

    const boxVariants = {
        hover: {scale: 1.05, strokeWidth: 40},
        pressed: {scale: 0.95, strokeWidth: 30},
        checked: {},
        unchecked: {strokeWidth: 30},
        disabled: {stroke: '#ddd'},
        active: {stroke: disabled ? '#000' : 'var(--blue-color)'},
    }

    const inputRef = useRef<HTMLInputElement>(null)
    const pathLength = useMotionValue(0)
    const opacity = useTransform(pathLength, [0.05, 0.15], [0, 1])

    return (
        <motion.div className={wrapperClassname}
                    onClick={() => inputRef.current?.click()}
                    whileHover={'hover'}
                    animate={[checked ? 'checked' : 'unchecked', disabled ? 'disabled' : 'active']}>
            <input id={id}
                   type={'checkbox'}
                   checked={checked}
                   disabled={disabled}
                   onChange={onChange}
                   ref={inputRef}
                   readOnly={readOnly}
                   hidden/>
            <motion.svg
                viewBox={'0 0 440 440'}
                className={checkboxClassname}
            >
                <motion.path
                    d="M 72 136 C 72 100.654 100.654 72 136 72 L 304 72 C 339.346 72 368 100.654 368 136 L 368 304 C 368 339.346 339.346 368 304 368 L 136 368 C 100.654 368 72 339.346 72 304 Z"
                    fill="transparent"
                    variants={boxVariants}
                />
                <motion.path
                    d="M 0 128.666 L 128.658 257.373 L 341.808 0"
                    transform="translate(54.917 68.947) rotate(-4 170.904 128.687)"
                    fill="transparent"
                    strokeWidth="65"
                    stroke="var(--blue-color)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={tickVariants}
                    style={{pathLength, opacity}}
                />
            </motion.svg>
            <span className={labelClassname}>{label}</span>
        </motion.div>
    )
}