'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/app/i18n/client'
import { createContact } from '@/services/contacts'
import { toast } from 'react-toastify';

type Props = {
    language: string,
}

export default function LeaveContacts({ language }: Readonly<Props>) {
    const { t } = useTranslation(language, 'leave_contacts')
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('fullName', fullName)
        formData.append('phoneNumber', phoneNumber)
        const toastId = toast.loading(t('edit_profile.save'));

        try {
            const body = {
                "fullName": fullName,
                "phone": phoneNumber
            }
            console.log('Sending request with body:', body)
            const response = await createContact(body)
            console.log('Server response:', response)
            toast.update(toastId, {
              render: 'Скоро с вами свяжемся!',
              type: 'success',
              isLoading: false,
              autoClose: 2000,
            });
            setFullName('')
            setPhoneNumber('')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={'flex flex-col w-full px-5 md:p-20 md:gap-10'} id={'about_us'}>
            <h2 className={'text-[1.5rem] md:text-[3rem]'}>
                {t('title')}
            </h2>
            <div className={'flex flex-col md:flex-row md:justify-between md:col-gap-10 w-full'}>
                <div className={'relative w-3/6 h-[15rem] md:h-[25rem] order-first md:order-last'}>
                    <Image src={'/assets/leave_contacts.jpg'} alt={'leave_contacts'} fill={true} placeholder={'empty'}
                        className={'object-contain'} />
                </div>
                <div className={'md:text-black md:leading-8 md:text-left md:w-1/3'}>
                    <p className={'text-base whitespace-pre-line'}>
                        {t('description')}
                    </p>
                    <form onSubmit={handleSubmit} className={'flex flex-col gap-4 mt-4'}>
                        <input
                            type="text"
                            placeholder={t('full_name_placeholder')}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={'p-3 border border-gray-300 rounded-full'}
                            required
                        />
                        <input
                            type="tel"
                            placeholder={t('phone_number_placeholder')}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className={'p-3 border border-gray-300 rounded-full'}
                            required
                        />
                        <button type="submit" className={'p-2 bg-blue text-white rounded-full'}>
                            {t('submit_button')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
