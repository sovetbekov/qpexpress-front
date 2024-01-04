'use client'

import React, { useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import Image from 'next/image'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import clsx from 'clsx'
import Input from '@/app/components/input/Input'

type NullableProps<T> = {
    nullable: true,
    selected?: T
    setSelected?: (option: T | undefined) => void,
}

type NonNullableProps<T> = {
    nullable: false,
    selected: T
    setSelected?: (option: T) => void,
}

type SearchableProps<T> = {
    searchable: true,
    getOptionValue?: (option: T) => string,
}

type NonSearchableProps<T> = {
    searchable: false,
    getOptionValue?: (option: T) => React.ReactNode,
}

type Props<T> = {
    id: string
    options: T[],
    getOptionId?: (option: T) => string,
    wrapperClassname?: string,
    dropdownClassname?: string,
    dropdownStyle?: React.CSSProperties,
    dropdownItemClassname?: string,
    dropdownItemStyle?: React.CSSProperties,
    inputWrapperClassname?: string,
    inputClassname?: string,
    label: string,
    disabled?: boolean,
    readOnly: boolean,
} & (NullableProps<T> | NonNullableProps<T>) & (SearchableProps<T> | NonSearchableProps<T>)

export default function DropdownInput<T>({
                                             id,
                                             options,
                                             wrapperClassname,
                                             dropdownClassname,
                                             dropdownStyle,
                                             dropdownItemClassname,
                                             dropdownItemStyle,
                                             label,
                                             disabled,
                                             ...props
                                         }: Props<T>) {
    const getOptionId = (option: T | string) => {
        if (props.getOptionId) {
            return props.getOptionId(option as T)
        } else {
            return option as string
        }
    }
    const getOptionValue = props.searchable ? (option: T | string): string => {
        if (typeof option === 'string') {
            return option
        }
        if (props.getOptionValue) {
            return props.getOptionValue(option)
        } else if (typeof option === 'string') {
            return option
        } else {
            throw new Error('Option value is not a string')
        }
    } : (option: T | string): React.ReactNode => {
        if (props.getOptionValue) {
            return props.getOptionValue(option as T)
        } else {
            return option as React.ReactNode
        }
    }

    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<T | null>(props.selected ?? null)
    const [search, setSearch] = useState<string>(props.searchable ? getOptionValue(props.selected ?? '') as string : '')
    const [referenceElement, setReferenceElement] = useState<HTMLInputElement | HTMLDivElement | null>(null)
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
    const {styles: popperStyles, attributes} = usePopper(referenceElement, popperElement, {
        placement: 'bottom-start',
    })

    useEffect(() => {
        if (!props.searchable) {
            document.addEventListener('mousedown', () => {
                setIsOpen(false)
            })
            return () => {
                document.removeEventListener('mousedown', () => {
                    setIsOpen(false)
                })
            }
        }
    }, [props.searchable])

    const filteredOptions = options.filter(option => {
        if (!props.searchable && !search) {
            return true
        }
        const optionValue = getOptionValue(option)
        if (typeof optionValue === 'string') {
            return optionValue.toLowerCase().includes(search!!.toLowerCase())
        }
        return true
    })

    const onFocus = () => {
        setIsOpen(true)
    }

    const onBlur = () => {
        if (props.searchable) {
            setSearch(getOptionValue(selected ?? '') as string)
        }
        setIsOpen(false)
    }

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

    const dropdownAnimation: Variants = {
        open: {
            opacity: 1,
        },
        closed: {
            opacity: 0,
        },
    }

    return (
        <div className={wrapperClassname}>
            {
                props.searchable &&
                <div className={clsx(props.inputWrapperClassname, 'relative')}>
                    <Input
                        id={id}
                        inputType={'text'}
                        label={label}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={clsx(props.inputClassname, 'w-full')}
                        value={search}
                        onChange={(value) => {
                            if (props.nullable) {
                                setSelected(null)
                                props.setSelected?.(undefined)
                            }
                            setSearch(value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && props.nullable) {
                                setSearch('')
                                setSelected(null)
                                props.setSelected?.(undefined)
                            }
                        }}
                        readOnly={props.readOnly}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        inputRef={setReferenceElement}
                        disabled={disabled}
                    />
                    <motion.div
                        variants={arrowAnimation}
                        animate={isOpen ? 'open' : 'closed'}
                        className={'absolute h-full flex items-center justify-center right-5 top-0 pointer-events-none'}>
                        <Image src={'/assets/arrow.svg'} alt={'arrow'} width={10} height={10}/>
                    </motion.div>
                </div>
            }
            {
                !props.searchable &&
                <div className={clsx(props.inputWrapperClassname, 'relative')}>
                    <div
                        className={clsx(props.inputClassname, 'w-full')}
                        onClick={() => {
                            setIsOpen(!isOpen)
                        }}
                        ref={setReferenceElement}
                    >
                        {getOptionValue(selected ?? '')}
                    </div>
                    <motion.div
                        variants={arrowAnimation}
                        animate={isOpen ? 'open' : 'closed'}
                        className={'absolute h-full flex items-center justify-center right-5 top-0 pointer-events-none'}>
                        <Image src={'/assets/arrow.svg'} alt={'arrow'} width={10} height={10}/>
                    </motion.div>
                </div>
            }
            <AnimatePresence>
                {
                    isOpen && <motion.div
                        variants={dropdownAnimation}
                        animate={isOpen ? 'open' : 'closed'}
                        initial={'closed'}
                        exit={'closed'}
                        ref={setPopperElement}
                        className={dropdownClassname}
                        style={{...popperStyles.popper, ...dropdownStyle}} {...attributes.popper}>
                        {
                            filteredOptions.map(option => (
                                <div key={getOptionId(option)} className={dropdownItemClassname}
                                     style={{
                                         ...dropdownItemStyle,
                                         position: 'relative',
                                     }}
                                     onMouseDown={() => {
                                         props.setSelected?.(option)
                                         setSelected(option)
                                     }}>
                                    {getOptionValue(option)}
                                    {
                                        selected === option &&
                                        <span
                                            className={'absolute h-full flex items-center justify-center right-5 top-0'}>
                                            <Image src={'/assets/check.svg'} alt={'check'} width={15} height={15}/>
                                        </span>
                                    }
                                </div>
                            ))
                        }
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}