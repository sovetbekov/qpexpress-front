'use client'

import React, { DragEvent, useRef, useState } from 'react'
import Input from '@/app/components/input/Input'
import Image from 'next/image'
import { motion } from 'framer-motion'

type Props = {
    id: string
    label?: string
    inputClassname?: string
    wrapperClassname?: string
    onChange?: (file: File) => void
    disabled?: boolean
    fileTypes?: string[]
    readOnly?: boolean
}

export default function FileInput({
                                      label,
                                      wrapperClassname,
                                      inputClassname,
                                      onChange,
                                      disabled,
                                      fileTypes,
                                      readOnly,
                                      id,
                                  }: Props) {
    const [fileName, setFileName] = useState<string | undefined>(undefined)
    const inputRef = useRef<HTMLInputElement>(null)
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setFileName('Отпустите, чтобы загрузить')
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        if (event.dataTransfer.files?.[0]) {
            setFileName(event.dataTransfer.files[0].name)
            onChange?.(event.dataTransfer.files[0])
        }
    }

    const iconVariants = {
        'initial': {
            opacity: 1,
            scale: 1,
        },
        'changed': {
            opacity: 0,
            scale: 0,
            display: 'none',
        },
    }

    return (
        <div className={wrapperClassname}
             onClick={() => {
                 if (readOnly) return
                 inputRef.current?.click()
             }}
             onDragOver={handleDragOver}
             onDrop={handleDrop}>
            <Input
                id={id}
                inputType={'text'}
                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                inputClassname={inputClassname}
                label={label ? (
                    <div className={'flex items-center'}>
                        <motion.div variants={iconVariants}>
                            <Image src={'/assets/file_upload.svg'} alt={'file_upload'} width={15} height={15}
                                   className={'mr-2'}/>
                        </motion.div>
                        {label}
                    </div>
                ) : ''}
                value={fileName}
                disabled={disabled}
                labelColor={'#00A7FF'}
                readOnly/>

            <input type={'file'}
                   ref={inputRef}
                   accept={fileTypes?.join(',') ?? '*'}
                   onChange={({target: {files}}) => {
                       if (files?.[0]) {
                           setFileName(files[0].name)
                           onChange?.(files[0])
                       }
                   }}
                   readOnly={readOnly}
                   hidden/>
        </div>
    )
}