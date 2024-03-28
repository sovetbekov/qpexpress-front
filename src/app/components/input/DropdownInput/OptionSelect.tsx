'use client'

import React, { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { useFloating } from '@floating-ui/react'
import { Errors } from '@/types'
import Dropdown, { Option } from '@/app/components/input/DropdownInput/Dropdown'
import { animated, useSpring } from '@react-spring/web'
import Label from '@/app/components/input/Label'

type Props<T> = {
    id: string
    label: string
    wrapperClassname?: string
    options: Option<T>[],
    dropdownClassname?: string,
    dropdownStyle?: React.CSSProperties,
    dropdownItemClassname?: string,
    className?: string
    dropdownItemStyle?: React.CSSProperties,
    inputWrapperClassname?: string,
    errorsClassname?: string,
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
                                            label,
                                            className,
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

    const arrowAnimation = useSpring({
        transform: isOpen ? 'rotateZ(180deg)' : 'rotateZ(0deg)',
    })

    const [inputAnimation, inputApi] = useSpring(() => ({
        from: {
            borderColor: '#000000',
            color: '#000000',
            outlineColor: '#000000',
        },
    }))

    const isError = !!errors?.[id]?.length
    const isDisabled = disabled || options.length === 0

    if (isDisabled) {
        inputApi.start(
            {
                borderColor: '#D3D3D3',
                color: '#D3D3D3',
                outlineColor: '#D3D3D3',
            },
        )
    } else if (isError) {
        inputApi.start(
            {
                borderColor: '#FE5C00',
                color: '#FE5C00',
                outlineColor: '#FE5C00',
                config: {tension: 180, friction: 12},
            },
        )
    } else {
        inputApi.start(
            {
                borderColor: '#000000',
                color: '#000000',
                outlineColor: '#000000',
            },
        )
    }

    return (
        <div className={clsx('relative', wrapperClassname)}>
            <Label labelColor={'#000000'}
                   inputChanged={!!props.selected}
                   focused={false}
                   disabled={disabled}>
                {label}
            </Label>
            <div className={'w-full'}>
                <animated.div
                    style={inputAnimation}
                    tabIndex={0}
                    className={clsx(className, 'cursor-pointer', {
                        [className?.split(' ').filter(clazz => clazz.startsWith('disabled')).map(clazz => clazz.replace('disabled:', '')).join(' ') ?? '']: disabled || options.length === 0,
                    })}
                    onClick={() => {
                        if (!disabled && !props.readOnly) {
                            setIsOpen(!isOpen)
                        }
                    }}
                    ref={refs.setReference}
                >
                    <span className={'select-none'}>
                        {props.selected?.label}
                    </span>
                </animated.div>
                {
                    !props.readOnly && (
                        <animated.div
                            style={arrowAnimation}
                            className={'absolute h-full flex items-center justify-center right-5 top-0 pointer-events-none'}>
                            <Image src={'/assets/arrow.svg'} alt={'arrow'} width={10} height={10}/>
                        </animated.div>
                    )
                }
            </div>
            <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className={dropdownClassname} ref={refs.setFloating} style={floatingStyles}>
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
                                 setIsOpen(false)
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