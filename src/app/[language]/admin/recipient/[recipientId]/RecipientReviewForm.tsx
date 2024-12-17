'use client'

import { BACKEND_URL } from '@/globals'
import { useAppDispatch } from '@/hooks/client/redux'
import { openModal } from '@/redux/reducers/modalSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RecipientData, RecipientOverview } from '@/types/entities'
import { acceptRecipient } from '@/services/account'
import { useTranslation } from '@/app/i18n/client'
import { toast } from 'react-toastify'
import { isSuccess } from '@/app/lib/utils'
import TextInput from '@/app/components/input/TextInput'
import MaskInput from '@/app/components/input/MaskInput'

type Props = {
    data: any
    language: string
}

export default function RecipientReviewForm({data: recipient, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'admin')
    const dispatch = useAppDispatch()
    const router = useRouter()

    async function onApproveClick() {
        await toast.promise(acceptRecipient(recipient.id).then(
            response => {
                if (isSuccess(response)) {
                    return response.data
                } else {
                    throw response.error
                }
            },
        ), {
            pending: t('recipient_review.approving'),
            success: t('recipient_review.approved'),
            error: t('recipient_review.error_approving'),
        })
        router.push('.')
    }

    return (
        <div className={'flex flex-col gap-16'}>
            <div className={'flex flex-col gap-5'}>
                <h3>Личные данные</h3>
                <div className={'flex flex-wrap flex-row gap-6'}>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'firstName'}
                                   label={'Имя'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={recipient.firstName}
                                   readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'lastName'}
                                   label={'Фамилия'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={recipient.lastName}
                                   readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'patronymic'}
                                   label={'Отчество'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={recipient.patronymic}
                                   readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'iin'}
                                   label={'ИИН'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={recipient.iin}
                                   readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'district'}
                                   label={'Город/область'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={recipient.district}
                                   readOnly/>
                    </div>
                    <div 
                        className={'md:w-[calc(33%-0.51rem)] w-full relative group'}
                        onClick={async () => {
                            await navigator.clipboard.writeText(`${recipient.phoneNumber}`);
                            toast.success(t('recipient_review.copied'));
                        }}
                    >
                        <MaskInput id={'phoneNumber'}
                                   label={'Номер телефона'}
                                   format={'+7 (###) ###-##-##'}
                                   className={'md:cursor-pointer md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={`${recipient.phoneNumber}`}
                                   readOnly/>
                        <div className="absolute right-0 top-50 mt-1 hidden w-60 p-3 bg-white border border-gray-300 rounded-lg shadow-lg text-sm text-gray-700 group-hover:block" style={{ zIndex: 3 }}>
                            {t('recipient_review.click_to_copy')}
                        </div>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'address'}
                                   label={'Адрес'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={`${recipient.address}`}
                                   readOnly/>
                    </div>
                </div>
            </div>

            <div className={'flex flex-col gap-5'}>
                <h3>Документы</h3>
                <div className={'flex flex-wrap flex-row gap-6'}>
                    <Link className={'md:w-[calc(33%-0.51rem)] w-full'}
                          href={`${BACKEND_URL}/v1/files/${recipient.documentSideA.id}/download`}
                          target={'_blank'}>
                        <TextInput id={'photo1'}
                                   label={'Сторона А'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black text-blue w-full cursor-pointer'}
                                   value={recipient.documentSideA.name}
                                   readOnly/>
                    </Link>
                    <Link className={'md:w-[calc(33%-0.51rem)] w-full'}
                          href={`${BACKEND_URL}/v1/files/${recipient.documentSideB.id}/download`}
                          target={'_blank'}>
                        <TextInput id={'photo2'}
                                   label={'Сторона Б'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black text-blue w-full cursor-pointer'}
                                   value={recipient.documentSideB.name}
                                   readOnly/>
                    </Link>
                </div>
            </div>

            <div className={'flex flex-col gap-5'}>
                <h3>Комментарий</h3>
                <div className={'flex flex-wrap flex-row gap-6'}>
                    <div className={'md:w-full w-full'}>
                        <TextInput id={'comment'}
                                   label={'Комментарий'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={recipient.comment || t('recipient_review.no_comment')}
                                   readOnly/>
                    </div>
                </div>
            </div>

        </div>
    )
}
