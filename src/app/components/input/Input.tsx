'use client'

import { motion, Variants } from 'framer-motion'
import React, { Dispatch, SetStateAction, useState } from 'react'
import clsx from 'clsx'
import { NumericFormat, NumericFormatProps, PatternFormat, PatternFormatProps } from 'react-number-format'
import { Errors } from '@/types'

type InputProps = {
    id: string
    label: string | React.ReactNode
    disabled?: boolean
    readOnly?: boolean
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
    errors?: Errors
    setErrors?: Dispatch<SetStateAction<Errors>>
    inputClassname?: string
    wrapperClassname?: string
    errorsClassname?: string
    inputRef?: React.Ref<HTMLInputElement>
    labelClassname?: string
    labelColor?: string
    required?: boolean
    name?: string
}

type TextInputProps = { inputType: 'text' | 'email' | 'password', onChange?: (value: string) => void, value?: string }
type NumericInputProps = { inputType: 'numeric' } & NumericFormatProps
type MaskInputProps = { inputType: 'mask' } & PatternFormatProps

function TextInput({ inputType, ...props }: InputProps & TextInputProps & {
    inputVariants: Variants,
    setFocused: Dispatch<SetStateAction<boolean>>
}) {
    return <motion.input id={ props.id } disabled={ props.disabled } readOnly={ props.readOnly } value={ props.value }
                         onKeyDown={ props.onKeyDown }
                         variants={ props.inputVariants }
                         animate={ props.errors?.[props.id]?.length ? 'error' : 'initial' }
                         initial={ 'initial' }
                         ref={ props.inputRef }
                         className={ props.inputClassname }
                         type={ inputType }
                         name={ props.name }
                         onFocus={ (e) => {
                             if (!props.disabled && !props.readOnly) {
                                 props.setFocused(true)
                             }
                             props.onFocus?.(e)
                         } }
                         onBlur={ (e) => {
                             props.setFocused(false)
                             props.onBlur?.(e)
                         } }
                         onChange={ e => {
                             props.onChange?.(e.target.value)
                             props.setErrors?.({
                                 ...props.errors,
                                 [props.id]: [],
                             })
                         } }
    />
}

function MaskInput({
                       inputType,
                       id,
                       onChange,
                       onFocus,
                       onBlur,
                       inputClassname,
                       name,
                       readOnly,
                       disabled,
                       errors,
                       setErrors,
                       inputRef,
                       setFocused,
                       ...props
                   }: InputProps & MaskInputProps & {
    inputVariants: Variants,
    setFocused: Dispatch<SetStateAction<boolean>>
}) {
    return <PatternFormat id={ id }
                          style={ {
                              ...props.style,
                              borderColor: errors?.[id]?.length ? '#EF4444' : 'black',
                              color: errors?.[id]?.length ? '#EF4444' : 'black',
                              outlineColor: errors?.[id]?.length ? '#EF4444' : 'black',
                          } }
                          disabled={ disabled }
                          readOnly={ readOnly }
                          name={ name }
                          getInputRef={ inputRef }
                          className={ inputClassname }
                          onFocus={ (e) => {
                              if (!disabled && !readOnly) {
                                  setFocused(true)
                              }
                              setErrors?.({
                                  ...errors,
                                  [id]: [],
                              })
                              onFocus?.(e)
                          } }
                          onBlur={ (e) => {
                              setFocused(false)
                              onBlur?.(e)
                          } }
                          onChange={ e => {
                              onChange?.(e)
                              setErrors?.({
                                  ...errors,
                                  [id]: [],
                              })
                          } }
                          { ...props }
    />
}

function NumericInput({
                          inputType,
                          id,
                          onChange,
                          style,
                          onFocus,
                          onBlur,
                          inputClassname,
                          name,
                          readOnly,
                          disabled,
                          errors,
                          setErrors,
                          inputRef,
                          setFocused,
                          ...props
                      }: InputProps & NumericInputProps & {
    inputVariants: Variants,
    setFocused: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <NumericFormat
            id={ id }
            style={ {
                ...style,
                borderColor: errors?.[id]?.length ? '#EF4444' : 'black',
                color: errors?.[id]?.length ? '#EF4444' : 'black',
                outlineColor: errors?.[id]?.length ? '#EF4444' : 'black',
            } }
            disabled={ disabled }
            readOnly={ readOnly }
            name={ name }
            getInputRef={ inputRef }
            className={ inputClassname }
            onFocus={ (e) => {
                if (!disabled && !readOnly) {
                    setFocused(true)
                }
                onFocus?.(e)
            } }
            onBlur={ (e) => {
                setFocused(false)
                onBlur?.(e)
            } }
            onChange={ e => {
                onChange?.(e)
                setErrors?.({
                    ...errors,
                    [id]: [],
                })
            } }
            { ...props }
        />
    )
}

export default function Input({
                                  label,
                                  id,
                                  onKeyDown,
                                  onBlur,
                                  onFocus,
                                  disabled,
                                  readOnly,
                                  inputClassname,
                                  errors,
                                  setErrors,
                                  required,
                                  name,
                                  labelClassname,
                                  errorsClassname,
                                  wrapperClassname,
                                  labelColor,
                                  inputRef,
                                  ...props
                              }: InputProps & (TextInputProps | NumericInputProps | MaskInputProps)) {
    const [ focused, setFocused ] = useState(false)
    const [ wrapperRef, setWrapperRef ] = useState<HTMLDivElement | null>(null)

    const labelVariants = {
        'initial': {
            color: labelColor ?? '#9CA3AF',
            x: '0.825rem',
            scale: 1,
        },
        'changed': {
            color: '#000000',
            y: wrapperRef?.offsetHeight ? -wrapperRef?.offsetHeight / 2 + 3 : 0,
            x: '0.825rem',
            scale: 0.75,
        },
        'error': {
            color: '#EF4444',
            x: '0.825rem',
            scale: 1,
        },
        'errorChanged': {
            color: '#EF4444',
            y: wrapperRef?.offsetHeight ? -wrapperRef?.offsetHeight / 2 + 3 : 0,
            x: '0.825rem',
            scale: 0.75,
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


    function deleteProp<T extends object>(obj: T, prop: keyof T) {
        const result = { ...obj }
        delete result[prop]
        return result
    }

    const textLabelChanged = (props.inputType === 'text' || props.inputType === 'email' || props.inputType === 'password') && props.value?.length !== 0
    const numericLabelChanged = props.inputType === 'numeric' && props.value != 0
    const maskLabelChanged = props.inputType === 'mask'
    const labelChanged = focused || textLabelChanged || numericLabelChanged || maskLabelChanged
    const errorAnimationState = labelChanged ? 'errorChanged' : 'error'
    const animationState = labelChanged ? 'changed' : 'initial'

    return (
        <motion.div className={ wrapperClassname } variants={ labelVariants }
                    ref={ setWrapperRef }>
            <div className={ 'absolute top-0 left-0 flex flex-row w-full pointer-events-none items-center' }
                 style={ { height: wrapperRef?.offsetHeight } }>
                {
                    wrapperRef && <motion.label variants={ labelVariants }
                                                animate={ errors?.[id]?.length ? errorAnimationState : animationState }
                                                initial={ 'initial' }
                                                className={ clsx('block leading-6 origin-top-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[calc(100%-24px)] absolute z-10 pointer-events-none py-0 px-1', labelClassname, {
                                                    'bg-white': !disabled,
                                                    'bg-none': disabled,
                                                }) }
                                                htmlFor={ id }>
                        { label }
                        {
                            required &&
                            <span>*</span>
                        }
                    </motion.label>
                }
            </div>
            {
                props.inputType === 'text' &&
                <TextInput id={ id } label={ label } inputVariants={ inputVariants }
                           setFocused={ setFocused } { ...props }/>
            }
            {
                props.inputType === 'numeric' &&
                <NumericFormat
                    id={ id }
                    style={ {
                        ...props.style,
                        borderColor: errors?.[id]?.length ? '#EF4444' : 'black',
                        color: errors?.[id]?.length ? '#EF4444' : 'black',
                        outlineColor: errors?.[id]?.length ? '#EF4444' : 'black',
                    } }
                    disabled={ disabled }
                    readOnly={ readOnly }
                    name={ name }
                    getInputRef={ inputRef }
                    className={ inputClassname }
                    onFocus={ (e) => {
                        if (!disabled && !readOnly) {
                            setFocused(true)
                        }
                        onFocus?.(e)
                    } }
                    onBlur={ (e) => {
                        setFocused(false)
                        onBlur?.(e)
                    } }
                    onChange={ e => {
                        props.onChange?.(e)
                        setErrors?.({
                            ...errors,
                            [id]: [],
                        })
                    } }
                    { ...deleteProp(deleteProp(props, 'inputType'), 'style') }
                />
            }
            {
                props.inputType === 'mask' &&
                <PatternFormat id={ id }
                               style={ {
                                   borderColor: errors?.[id]?.length ? '#EF4444' : 'black',
                                   color: errors?.[id]?.length ? '#EF4444' : 'black',
                                   outlineColor: errors?.[id]?.length ? '#EF4444' : 'black',
                               } }
                               disabled={ disabled }
                               readOnly={ readOnly }
                               name={ name }
                               getInputRef={ inputRef }
                               className={ inputClassname }
                               onFocus={ (e) => {
                                   if (!disabled && !readOnly) {
                                       setFocused(true)
                                   }
                                   setErrors?.({
                                       ...errors,
                                       [id]: [],
                                   })
                                   onFocus?.(e)
                               } }
                               onBlur={ (e) => {
                                   setFocused(false)
                                   onBlur?.(e)
                               } }
                               onChange={ e => {
                                   props.onChange?.(e)
                                   setErrors?.({
                                       ...errors,
                                       [id]: [],
                                   })
                               } }
                               { ...deleteProp(props, 'inputType') }
                />
            }
            {
                errors?.[id] && errors[id].length > 0 &&
                <motion.div
                    className={ clsx((errorsClassname ?? 'absolute top-0 right-0 flex flex-row items-center h-full pr-4 text-[#EF4444]'), 'pointer-events-none') }
                    initial={ { opacity: 0 } }
                    animate={ { opacity: 1 } }>
                    <motion.div className={ 'flex flex-row items-center pointer-events-none' }
                                initial={ { opacity: 0 } }
                                animate={ { opacity: 1 } }>
                        <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 pointer-events-none"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                            <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 }
                                         d="M6 18L18 6M6 6l12 12"/>
                        </motion.svg>
                        <motion.p className={ 'text-xs pointer-events-none' }>
                            { errors[id][0] }
                        </motion.p>
                    </motion.div>
                </motion.div>
            }
        </motion.div>
    )
}