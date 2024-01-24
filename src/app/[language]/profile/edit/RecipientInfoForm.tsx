'use client'

import React, { useState } from 'react'
import { Errors, FileMetaData, RecipientData } from '@/types'
import { toast } from 'react-toastify'
import { createRecipient, updateRecipient } from '@/services/account'
import Image from 'next/image'
import Input from '@/app/components/input/Input'
import FileInput from '@/app/components/input/FileInput'
import { useTranslation } from '@/app/i18n/client'
import { isSuccess } from '@/app/lib/utils'

type RecipientFormData = {
    id?: string,
    firstName: string,
    lastName: string,
    patronymic: string,
    iin: string,
    documentSideA?: File | FileMetaData,
    documentSideB?: File | FileMetaData,
    district: string,
    phoneNumber: string,
    address: string,
}

type Props = {
    initialFormData?: RecipientData,
    language: string,
}

export default function RecipientInfoForm({initialFormData, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'profile')
    const [errors, setErrors] = useState<Errors>({})
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<RecipientFormData>(initialFormData ?? {
        firstName: '',
        lastName: '',
        patronymic: '',
        iin: '',
        documentSideA: undefined,
        documentSideB: undefined,
        district: '',
        phoneNumber: '',
        address: '',
    })

    async function onRecipientUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const data = new FormData()
        data.append('firstName', formData.firstName)
        data.append('lastName', formData.lastName)
        data.append('patronymic', formData.patronymic)
        data.append('iin', formData.iin)
        data.append('district', formData.district)
        data.append('phoneNumber', formData.phoneNumber)
        data.append('address', formData.address)
        if (formData.documentSideA) {
            if (formData.documentSideA instanceof File) {
                data.append('documentSideA', formData.documentSideA)
            } else {
                data.append('documentSideAId', formData.documentSideA.id)
            }
        }
        if (formData.documentSideB) {
            if (formData.documentSideB instanceof File) {
                data.append('documentSideB', formData.documentSideB)
            } else {
                data.append('documentSideBId', formData.documentSideB.id)
            }
        }

        async function saveRecipient() {
            return initialFormData ? await updateRecipient(initialFormData.id, data, language) : await createRecipient(data, language)
        }

        try {
            await toast.promise(saveRecipient().then(
                response => {
                    if (isSuccess(response)) {
                        return response.data
                    } else {
                        throw response.error
                    }
                },
            ), {
                pending: t('edit_profile.saving_recipient'),
                success: t('edit_profile.saved_recipient'),
                error: t('edit_profile.error_saving_recipient'),
            })
            setIsEditing(false)
        } catch (e) {
            setErrors(e as Errors)
        }
    }

    return (
        <form className={'flex flex-col gap-y-4 md:gap-y-10'} onSubmit={onRecipientUpdate}>
            <p className={'md:text-2xl'}>
                {t('edit_profile.recipients')}
            </p>
            {
                !initialFormData && (
                    <p className={'md:text-base'}>
                        {t('edit_profile.no_recipients')}
                    </p>
                )
            }
            {
                initialFormData && initialFormData.status === 'PENDING' && (
                    <p className={'text-base flex flex-row gap-x-2'}>
                        <Image src={'/assets/progressing_receiver.svg'} alt={'progress'} width={25}
                               height={25}/>{t('edit_profile.pending_recipient')}
                    </p>
                )
            }
            {
                initialFormData && initialFormData.status === 'ACTIVE' && (
                    <p className={'text-base flex flex-row gap-x-2'}>
                        <Image src={'/assets/approved_receiver.svg'} alt={'progress'} width={25}
                               height={25}/>{t('edit_profile.approved_recipient')}
                    </p>
                )
            }
            {
                initialFormData && initialFormData.status === 'INACTIVE' && (
                    <p className={'text-base flex flex-row gap-x-2'}>
                        <Image src={'/assets/rejected_receiver.svg'} alt={'progress'} width={25}
                               height={25}/>{t('edit_profile.rejected_recipient')}. {initialFormData.comment}
                    </p>
                )
            }
            <div className={'flex flex-col gap-y-4 md:flex-row md:gap-y-5 md:gap-x-6 md:flex-wrap'}>
                <div className={'md:w-[calc(50%-0.75rem)]'}>
                    <Input
                        id={'first_name'}
                        name={'first_name'}
                        inputType={'text'}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.firstName}
                        onChange={(value) => setFormData({
                            ...formData,
                            firstName: value,
                        })}
                        errors={errors}
                        setErrors={setErrors}
                        label={t('edit_profile.first_name')}
                        readOnly={!isEditing}
                        required
                    />
                </div>
                <div className={'md:w-[calc(50%-0.75rem)]'}>
                    <Input
                        id={'last_name'}
                        name={'last_name'}
                        inputType={'text'}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.lastName}
                        onChange={(value) => setFormData({
                            ...formData,
                            lastName: value,
                        })}
                        errors={errors}
                        setErrors={setErrors}
                        label={t('edit_profile.last_name')}
                        readOnly={!isEditing}
                        required
                    />
                </div>
                <div className={'md:w-[calc(50%-0.75rem)]'}>
                    <Input
                        id={'patronymic'}
                        name={'patronymic'}
                        inputType={'text'}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.patronymic}
                        onChange={(value) => setFormData({
                            ...formData,
                            patronymic: value,
                        })}
                        errors={errors}
                        setErrors={setErrors}
                        label={t('edit_profile.patronymic')}
                        readOnly={!isEditing}
                    />
                </div>
                <div className={'md:w-[calc(50%-0.75rem)]'}>
                    <Input
                        id={'iin'}
                        name={'iin'}
                        inputType={'mask'}
                        format={'### ### ### ###'}
                        mask={'_'}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.iin}
                        onValueChange={(value) => setFormData({
                            ...formData,
                            iin: value.value,
                        })}
                        errors={errors}
                        setErrors={setErrors}
                        label={t('edit_profile.iin')}
                        readOnly={!isEditing}
                        required
                    />
                </div>
                <FileInput
                    id={'document_side_a'}
                    name={'document_side_a'}
                    label={t('edit_profile.side_a')}
                    wrapperClassname={'md:w-[calc(50%-0.75rem)] w-full'}
                    inputClassname={'w-full md:p-5 p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                    onChange={(file) => setFormData({
                        ...formData,
                        documentSideA: file,
                    })}
                    errors={errors}
                    setErrors={setErrors}
                    file={formData.documentSideA}
                    fileTypes={['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']}
                    readOnly={!isEditing}
                    required
                />
                <FileInput
                    id={'document_side_b'}
                    name={'document_side_b'}
                    label={t('edit_profile.side_b')}
                    wrapperClassname={'md:w-[calc(50%-0.75rem)] w-full'}
                    inputClassname={'w-full md:p-5 p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                    onChange={(file) => setFormData({
                        ...formData,
                        documentSideB: file,
                    })}
                    file={formData.documentSideB}
                    fileTypes={['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']}
                    readOnly={!isEditing}
                    errors={errors}
                    setErrors={setErrors}
                    required
                />
                <div className={'w-full'}>
                    <p className={'md:w-1/2 text-base px-5 md:p-0'}>
                        {t('edit_profile.document_instruction')}
                    </p>
                </div>
                <div className={'md:w-[calc(50%-0.75rem)]'}>
                    <Input
                        id={'district'}
                        name={'district'}
                        inputType={'text'}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.district}
                        onChange={(value) => setFormData({
                            ...formData,
                            district: value,
                        })}
                        label={t('edit_profile.district')}
                        errors={errors}
                        setErrors={setErrors}
                        readOnly={!isEditing}
                        required
                    />
                </div>
                <div className={'md:w-[calc(50%-0.75rem)]'}>
                    <Input
                        id={'phone_number'}
                        name={'phone_number'}
                        inputType={'mask'}
                        format={'+7 (###) ###-##-##'}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.phoneNumber}
                        onValueChange={(value) => setFormData({
                            ...formData,
                            phoneNumber: value.formattedValue,
                        })}
                        mask="_"
                        label={t('edit_profile.phone_number')}
                        readOnly={!isEditing}
                        errors={errors}
                        setErrors={setErrors}
                        required
                        allowEmptyFormatting
                    />
                </div>
                <div className={'md:w-[calc(50%-0.75rem)]'}>
                    <Input
                        id={'address'}
                        name={'address'}
                        inputType={'text'}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.address}
                        onChange={(value) => setFormData({
                            ...formData,
                            address: value,
                        })}
                        label={t('edit_profile.address')}
                        errors={errors}
                        setErrors={setErrors}
                        readOnly={!isEditing}
                        required
                    />
                </div>
            </div>
            {
                isEditing && (
                    <button
                        className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}
                        type={'submit'}>
                        {t('edit_profile.save')}
                    </button>
                )
            }
            {
                !isEditing && (
                    <button
                        className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}
                        onMouseUp={() => setIsEditing(true)}
                        type={'button'}
                    >
                        {t('edit_profile.change')}
                    </button>
                )
            }
        </form>
    )
}