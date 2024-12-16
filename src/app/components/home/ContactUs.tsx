'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { createContact } from '@/services/contacts';
import { toast } from 'react-toastify';

type Props = {
    language: string,
}

export default function ContactUs({ language }: Readonly<Props>) {
    const { t } = useTranslation(language, 'contact_us');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(t('submit_loading'));

        try {
            const body = {
                fullName,
                phone: phoneNumber,
            };
            console.log('Sending request with body:', body);
            const response = await createContact(body);
            console.log('Server response:', response);
            toast.update(toastId, {
                render: t('success_message'),
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });
            setFullName('');
            setPhoneNumber('');
        } catch (error) {
            console.error(error);
            toast.update(toastId, {
                render: t('error_message'),
                type: 'error',
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    return (
        <div className={'flex flex-col items-center w-full bg-gray-100 px-5 py-14'} id={'contact_us'}>
            <h2 className={'text-[1.5rem] md:text-[3rem] mb-6 text-center'}>
                {t('title')}
            </h2>
            <p className={'text-base md:text-lg text-center mb-8'}>
                {t('description')}
            </p>
            <form onSubmit={handleSubmit} className={'flex flex-col gap-6 w-full max-w-md'}>
                <input
                    type="text"
                    placeholder={t('full_name_placeholder')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={'p-4 border border-gray-300 rounded-full'}
                    required
                />
                <input
                    type="tel"
                    placeholder={t('phone_number_placeholder')}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={'p-4 border border-gray-300 rounded-full'}
                    required
                />
                <button type="submit" className={'p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600'}>
                    {t('submit_button')}
                </button>
            </form>
        </div>
    );
}
