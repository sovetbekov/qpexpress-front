'use client'

import FileInput from '@/app/components/input/FileInput'
import React, { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import PageWrapper from '../PageWrapper'
import { useGetMyProfileQuery } from '@/redux/reducers/profileApi'
import Input from '@/app/components/input/Input'
import { useTranslation } from '@/app/i18n/client'

type Props = {
    params: {
        language: string
    }
}

type PersonalInfoFormData = {
    firstName: string,
    lastName: string,
    patronymic: string,
    email: string,
    phoneNumber: string,
}

type RecipientFormData = {
    firstName: string,
    lastName: string,
    patronymic: string,
    country: string,
    iin: string,
    dateOfIssue: string,
    issuedBy: string,
    photo1?: File,
    photo2?: File,
    city: string,
    phoneNumber: string,
    address: string,
}


export default function Page({params: {language}}: Props) {
    const {t} = useTranslation(language, 'profile')
    const {data: profile} = useGetMyProfileQuery()
    const [personalInfo, updatePersonalInfo] = useImmer<PersonalInfoFormData>({
        firstName: '',
        lastName: '',
        patronymic: '',
        email: '',
        phoneNumber: '',
    })
    useEffect(() => {
        if (profile) {
            updatePersonalInfo(draft => {
                draft.firstName = profile.firstName
                draft.lastName = profile.lastName
                draft.patronymic = profile.patronymic
                draft.email = profile.email
            })
        }
    }, [profile, updatePersonalInfo])
    const [recipientInfo, updateRecipientInfo] = useImmer<RecipientFormData>({
        firstName: '',
        lastName: '',
        patronymic: '',
        country: '',
        iin: '',
        dateOfIssue: '',
        issuedBy: '',
        photo1: undefined,
        photo2: undefined,
        city: '',
        phoneNumber: '',
        address: '',
    })
    const [isPersonalInfoEditing, setIsPersonalInfoEditing] = useState(false)
    const [isRecipientInfoEditing, setIsRecipientInfoEditing] = useState(false)
    return (
        <PageWrapper>
            <div className={'flex flex-col gap-y-4 md:gap-y-12 px-5'}>
                <form className={'flex flex-col gap-y-4 md:gap-y-10'}>
                    <h3 className={'text-2xl font-bold md:hidden'}>
                        {t("edit_profile.my_personal_info")}
                    </h3>
                    <h3 className={'text-xl font-bold md:hidden'}>
                        {t("edit_profile.personal_info")}
                    </h3>
                    <div className={'flex flex-col gap-y-4 md:flex-row md:gap-y-5 md:gap-x-6 md:flex-wrap'}>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full'}>
                            <Input
                                id={'first_name'}
                                inputType={'text'}
                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={personalInfo.firstName}
                                onChange={(value) => updatePersonalInfo(draft => {
                                    draft.firstName = value
                                })}
                                label={t('edit_profile.first_name')} readOnly={!isPersonalInfoEditing}/>
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full'}>
                            <Input
                                id={'last_name'}
                                inputType={'text'}
                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={personalInfo.lastName}
                                onChange={(value) => updatePersonalInfo(draft => {
                                    draft.lastName = value
                                })}
                                label={t('edit_profile.last_name')} readOnly={!isPersonalInfoEditing}/>
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full'}>
                            <Input
                                id={'patronymic'}
                                inputType={'text'}
                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={personalInfo.patronymic}
                                onChange={(value) => updatePersonalInfo(draft => {
                                    draft.patronymic = value
                                })}
                                label={t('edit_profile.patronymic')} readOnly={!isPersonalInfoEditing}/>
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)] w-full'}>
                            <Input
                                id={'email'}
                                inputType={'text'}
                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={personalInfo.email}
                                onChange={(value) => updatePersonalInfo(draft => {
                                    draft.email = value
                                })}
                                label={t('edit_profile.email')} readOnly={!isPersonalInfoEditing}/>
                        </div>
                    </div>
                    {
                        isPersonalInfoEditing ? (
                            <button
                                className={'cursor-pointer text-white bg-blue md:py-5 rounded-full md:w-[20rem] w-full p-3'}
                                type={'button'}
                                onClick={() => setIsPersonalInfoEditing(false)}
                            >
                                {t('edit_profile.save')}
                            </button>
                        ) : (
                            <button
                                className={'cursor-pointer text-white bg-blue md:py-5 rounded-full md:w-[20rem] w-full p-3'}
                                onClick={() => setIsPersonalInfoEditing(true)}
                                type={'button'}
                            >
                                {t('edit_profile.change')}
                            </button>
                        )
                    }
                </form>
                <form className={'flex flex-col gap-y-4 md:gap-y-10'}>
                    <p className={'md:text-2xl'}>
                        {t('edit_profile.recipients')}
                    </p>
                    <div className={'flex flex-col gap-y-4 md:flex-row md:gap-y-5 md:gap-x-6 md:flex-wrap'}>
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                            <Input
                                id={'iin'}
                                inputType={'text'}
                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipientInfo.iin}
                                onChange={(value) => updateRecipientInfo(draft => {
                                    draft.iin = value
                                })}
                                label={t('edit_profile.iin')}
                                readOnly={!isRecipientInfoEditing}
                            />
                        </div>
                        <FileInput
                            id={'photo1'}
                            label={t('edit_profile.side_a')}
                            wrapperClassname={'md:w-[calc(50%-0.75rem)] w-full'}
                            inputClassname={'w-full md:p-5 p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                            fileTypes={['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']}
                            readOnly={!isRecipientInfoEditing}
                        />
                        <FileInput
                            id={'photo2'}
                            label={t('edit_profile.side_b')}
                            wrapperClassname={'md:w-[calc(50%-0.75rem)] w-full'}
                            inputClassname={'w-full md:p-5 p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                            fileTypes={['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']}
                            readOnly={!isRecipientInfoEditing}
                        />
                        <div className={'w-full'}>
                            <p className={'md:w-1/2 text-base px-5 md:p-0'}>
                                {t('edit_profile.document_instruction')}
                            </p>
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                            <Input
                                id={'phone_number'}
                                inputType={'text'}
                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipientInfo.phoneNumber}
                                onChange={(value) => updateRecipientInfo(draft => {
                                    draft.phoneNumber = value
                                })}
                                label={t('edit_profile.phone_number')}
                                readOnly={!isRecipientInfoEditing}
                            />
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                            <Input
                                id={'address'}
                                inputType={'text'}
                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipientInfo.address}
                                onChange={(value) => updateRecipientInfo(draft => {
                                    draft.address = value
                                })}
                                label={t('edit_profile.address')}
                                readOnly={!isRecipientInfoEditing}
                            />
                        </div>
                    </div>
                    {
                        isRecipientInfoEditing ? (
                            <button
                                className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}
                                onClick={() => setIsRecipientInfoEditing(false)}
                                type={'button'}>
                                {t('edit_profile.save')}
                            </button>
                        ) : (
                            <button
                                className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}
                                onClick={() => setIsRecipientInfoEditing(true)}
                                type={'button'}
                            >
                                {t('edit_profile.change')}
                            </button>
                        )
                    }
                </form>
            </div>
        </PageWrapper>
    )
}