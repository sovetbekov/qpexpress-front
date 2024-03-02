'use client'

import React, { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'
import Image from 'next/image'
import { useFloating } from '@floating-ui/react'
import { Errors } from '@/types'
import TextInput from '@/app/components/input/TextInput'
import Dropdown, { Option } from '@/app/components/input/DropdownInput/Dropdown'
import { animated, useSpring } from '@react-spring/web'

type NullableProps<T> = {
    nullable: true,
    selected?: T
    setSelected: (option: Option<T> | undefined) => void,
}

type NonNullableProps<T> = {
    nullable: false,
    selected: T
    setSelected: (option: Option<T>) => void,
}

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
    errors?: Errors,
    setErrors?: Dispatch<SetStateAction<Errors>>
    disabled?: boolean,
    label?: string
    readOnly?: boolean,
    required?: boolean
    searchable?: boolean
} & (NullableProps<T> | NonNullableProps<T>)

export default function DropdownInput<T>({
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
                                             label,
                                             children,
                                             ...props
                                         }: PropsWithChildren<Props<T>>) {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<Option<T> | undefined>(options.find(option => option.value === props.selected) ?? undefined)
    const [search, setSearch] = useState<string>('')

    const {refs, floatingStyles} = useFloating({
        placement: 'bottom-start',
    })

    const filteredOptions = options.filter(option => {
        if (searchable) {
            if (!option.searchLabel) {
                return true
            }
            return option.searchLabel?.toLowerCase().includes(search.toLowerCase())
        }
        return true
    })

    const onFocus = () => {
        setIsOpen(true)
    }

    const onBlur = () => {
        if (searchable) {
            setSearch('')
        }
        setIsOpen(false)
    }

    const arrowAnimation = useSpring({
        transform: isOpen ? 'rotateZ(180deg)' : 'rotateZ(0deg)',
    })

    return (
        <div className={wrapperClassname}>
            <div className={'relative'}>
                <TextInput
                    id={id}
                    label={label}
                    className={props.inputClassname}
                    value={selected ? selected.searchLabel ?? selected.label as string : search}
                    onChange={(e) => {
                        if (props.nullable) {
                            setErrors?.({
                                ...errors,
                                [id]: [],
                            })
                            setSelected(undefined)
                            props.setSelected(undefined)
                        }
                        setSearch(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Backspace' && props.nullable) {
                            setErrors?.({
                                ...errors,
                                [id]: [],
                            })
                            setSelected(undefined)
                            props.setSelected(undefined)
                        }
                    }}
                    errors={errors}
                    setErrors={setErrors}
                    readOnly={props.readOnly}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    ref={refs.setReference}
                    disabled={disabled ?? options.length === 0}
                />
                <animated.div
                    style={arrowAnimation}
                    className={'absolute h-full flex items-center justify-center right-5 top-0 pointer-events-none'}>
                    <Image src={'/assets/arrow.svg'} alt={'arrow'} width={10} height={10}/>
                </animated.div>
            </div>
            <Dropdown isOpen={isOpen} className={dropdownClassname} ref={refs.setFloating}
                      style={floatingStyles}>
                {
                    filteredOptions.map(option => (
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
                                 setSelected(option)
                             }}>
                            {option.label}
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
            </Dropdown>
        </div>
    )
}