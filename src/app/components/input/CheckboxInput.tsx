'use client'

import React, { useRef } from 'react'
import clsx from 'clsx'

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
    const inputRef = useRef<HTMLInputElement>(null)
    const color = disabled ? '#ddd' : 'rgb(0,124,226)'

    return (
        <div className={wrapperClassname}>
            <input id={id}
                   type={'checkbox'}
                   checked={checked}
                   disabled={disabled}
                   onChange={onChange}
                   ref={inputRef}
                   readOnly={readOnly}
                   hidden/>
            <label htmlFor={id}
                   className={clsx('cursor-pointer w-full flex flex-row gap-2 items-center')} onClick={() => inputRef.current?.click()}>
                <svg viewBox={'0 0 100 100'} className={clsx('w-[2em] stroke-[5] fill-[white]', checkboxClassname)} style={{stroke: color}}>
                    <path className={'fill-[white] transition-[stroke-dashoffset] duration-[0.3s] ease-linear'}
                          d={'M82,89H18c-3.87,0-7-3.13-7-7V18c0-3.87,3.13-7,7-7h64c3.87,0,7,3.13,7,7v64C89,85.87,85.87,89,82,89z'}/>
                    <polyline className={'fill-none transition-[stroke-dashoffset] duration-[0.2s] ease-linear'}
                              style={{
                                  strokeDasharray: '200',
                                  strokeDashoffset: checked ? '0' : '200',
                              }}
                              points={'25.5,53.5 39.5,67.5 72.5,34.5'}/>
                </svg>
                <span className={labelClassname}>{label}</span>
            </label>
        </div>
    )
}