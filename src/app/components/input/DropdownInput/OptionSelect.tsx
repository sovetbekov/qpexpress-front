'use client'

import React, { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import clsx from 'clsx'
import { useFloating } from '@floating-ui/react'
import { Errors } from '@/types'
import Dropdown, { Option } from '@/app/components/input/DropdownInput/Dropdown'

type Props<T> = {
    id: string
    wrapperClassname?: string
    options: Option<T>[],
    dropdownClassname?: string,
    dropdownStyle?: React.CSSProperties,
    dropdownItemClassname?: string,
    dropdownItemStyle?: React.CSSProperties,
    inputWrapperClassname?: string,
    errorsClassname?: string,
    inputClassname?: string,
    selected?: Option<T>,
    setSelected: (option: Option<T> | undefined) => void,
    errors?: Errors,
    setErrors?: Dispatch<SetStateAction<Errors>>
    disabled?: boolean,
    readOnly?: boolean,
    required?: boolean
    searchable?: boolean
}

export default function OptionSelect<T>({
                                            id,
                                            options,
                                            errors,
                                            setErrors,
                                            wrapperClassname,
                                            dropdownClassname,
                                            errorsClassname,
                                            dropdownStyle,
                                            dropdownItemClassname,
                                            dropdownItemStyle,
                                            disabled,
                                            searchable,
                                            children,
                                            ...props
                                        }: PropsWithChildren<Props<T>>) {
    const [isOpen, setIsOpen] = useState(false)

    const {refs, floatingStyles} = useFloating({
        placement: 'bottom-start',
    })

    const arrowAnimation: Variants = {
        open: {
            rotateZ: 180,
            originX: 0.5,
            originY: 0.5,
        },
        closed: {
            rotateZ: 0,
            originX: 0.5,
            originY: 0.5,
        },
    }

    const inputVariants = {
        'initial': {
            borderColor: '#000000',
            outlineColor: '#000000',
        },
        'error': {
            borderColor: '#EF4444',
            color: '#EF4444',
            outlineColor: '#EF4444',
        },
    }

    return (
        <div className={wrapperClassname}>
            <motion.div className={clsx('relative w-full')} variants={inputVariants}
                        animate={errors?.[id]?.length ? 'error' : 'initial'}
                        initial={'initial'}>
                <motion.div
                    variants={inputVariants}
                    animate={errors?.[id]?.length ? 'error' : (disabled || options.length === 0 ? 'disabled' : 'initial')}
                    className={clsx(props.inputClassname, 'w-full', {
                        [props.inputClassname?.split(' ').filter(clazz => clazz.startsWith('disabled')).map(clazz => clazz.replace('disabled:', '')).join(' ') ?? '']: disabled || options.length === 0,
                    })}
                    onClick={() => {
                        if (!disabled && !props.readOnly) {
                            setIsOpen(!isOpen)
                        }
                    }}
                    ref={refs.setReference}
                >
                    {props.selected?.label}
                </motion.div>
                {
                    !props.readOnly && (
                        <motion.div
                            variants={arrowAnimation}
                            animate={isOpen ? 'open' : 'closed'}
                            className={'absolute h-full flex items-center justify-center right-5 top-0 pointer-events-none'}>
                            <Image src={'/assets/arrow.svg'} alt={'arrow'} width={10} height={10}/>
                        </motion.div>
                    )
                }
            </motion.div>
            <Dropdown isOpen={isOpen} className={dropdownClassname} ref={refs.setFloating} style={floatingStyles}>
                {
                    options.map(option => (
                        <div key={option.id} className={dropdownItemClassname}
                             style={{
                                 ...dropdownItemStyle,
                                 position: 'relative',
                             }}
                             onMouseDown={() => {
                                 setErrors?.({
                                     ...errors,
                                     [id]: [],
                                 })
                                 props.setSelected(option)
                             }}>
                            {option.label}
                            {
                                props.selected === option &&
                                    <span className={'absolute h-full flex items-center justify-center right-5 top-0'}>
                                        <Image src={'/assets/check.svg'} alt={'check'} width={15} height={15}/>
                                    </span>
                            }
                        </div>
                    ))
                }
            </Dropdown>
        </div>
    )
}