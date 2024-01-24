'use client'

import React, { useState } from 'react'
import { denyRecipient } from '@/services/account'
import { useAppDispatch } from '@/hooks/client/redux'
import { closeModal } from '@/redux/reducers/modalSlice'
import { useRouter } from 'next/navigation'
import { RecipientData } from '@/types'
import { useTranslation } from '@/app/i18n/client'

type Props = {
    recipient: RecipientData
    language: string
}

export default function DenialReasonModal({recipient, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'admin')
    const dispatch = useAppDispatch()
    const [comment, setComment] = useState<string>('')
    const router = useRouter()
    async function onSubmit(comment: string) {
        await denyRecipient(recipient.id, comment, language)
    }

    return (
        <div className={'md:flex md:flex-col md:gap-y-5 md:p-20'}>
            <p className={'md:text-2xl'}>Комментарий</p>
            <textarea id={'comment'} name={'comment'} rows={4} onChange={e => setComment(e.target.value)}
                      className={"block p-2.5 w-full text-base rounded-lg border border-gray-300 resize-none"}
                      placeholder="Укажите причину отказа..."></textarea>
            <button className={'bg-blue text-white py-3 rounded-full'} onClick={e => {
                onSubmit(comment ?? "").then(() => dispatch(closeModal())).then(() => router.push("."))
            }}>
                Отправить
            </button>
        </div>
    )
}