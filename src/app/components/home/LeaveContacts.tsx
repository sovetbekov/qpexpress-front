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
        <div className={'flex flex-col w-full mx-auto'} id={'about_us'}>
                <div className={'md:text-black md:leading-8 md:text-left  w-full '}>
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
    )
}
