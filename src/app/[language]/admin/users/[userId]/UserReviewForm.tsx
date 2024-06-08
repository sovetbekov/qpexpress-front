'use client'

import { BACKEND_URL } from '@/globals'
import { useAppDispatch } from '@/hooks/client/redux'
import { openModal } from '@/redux/reducers/modalSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserWithRecipientsData } from '@/types/entities'
import { acceptRecipient } from '@/services/account'
import { useTranslation } from '@/app/i18n/client'
import { toast } from 'react-toastify'
import { isSuccess } from '@/app/lib/utils'
import TextInput from '@/app/components/input/TextInput'
import MaskInput from '@/app/components/input/MaskInput'

type Props = {
    data: UserWithRecipientsData
    language: string
}

export default function UserReviewForm({data: {user, recipients}, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'admin')
    const dispatch = useAppDispatch()
    const router = useRouter()

    async function onApproveClick(recipientId: string) {
        await toast.promise(acceptRecipient(recipientId).then(
            response => {
                if (isSuccess(response)) {
                    return response.data
                } else {
                    throw response.error
                }
            },
        ), {
            pending: t('user_review.approving'),
            success: t('user_review.approved'),
            error: t('user_review.error_approving'),
        })
        router.push('.')
    }

    return (
        <div className={'flex flex-col gap-16'}>
            <div className={'flex flex-col gap-5'}>
                <h3>
                    Личные данные
                </h3>
                <div className={'flex flex-wrap flex-row gap-6'}>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'firstName'}
                                   label={'Имя'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={user.firstName}
                                   readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'lastName'}
                                   label={'Фамилия'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={user.lastName}
                                   readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'patronymic'}
                                   label={'Отчество'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={user.patronymic}
                                   readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <TextInput id={'email'}
                                   label={'Электронная почта'}
                                   type={'text'}
                                   className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                   value={user.email}
                                   readOnly/>
                    </div>
                </div>
            </div>
            {recipients.length > 0 && recipients.map((recipient, index) => (
                <div key={recipient.id} className={'flex flex-col gap-5'}>
                    <h3>
                        Получатель {index + 1}
                    </h3>
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
                        <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                            <TextInput id={'district'}
                                       label={'Город/область'}
                                       type={'text'}
                                       className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                       value={`${recipient.district}`}
                                       readOnly/>
                        </div>
                        <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                            <MaskInput id={'phoneNumber'}
                                       label={'Номер телефона'}
                                       format={'+7 (###) ###-##-##'}
                                       className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                       value={`${recipient.phoneNumber}`}
                                       readOnly/>
                        </div>
                        <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                            <TextInput id={'address'}
                                       label={'Адрес'}
                                       className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                       value={`${recipient.address}`}
                                       readOnly/>
                        </div>
                    </div>
                    <div className={'flex flex-row gap-5'}>
                        {
                            recipient.status !== 'ACTIVE' &&
                            <button className={'py-4 px-10 w-[15rem] bg-blue text-white rounded-full'}
                                    onClick={() => onApproveClick(recipient.id)}>
                                Принять
                            </button>
                        }
                        <button className={'py-4 px-10 w-[15rem] bg-orange text-white rounded-full'} onClick={() => {
                            dispatch(openModal({modalType: 'denialReason', data: {recipient}}))
                        }}>
                            Отклонить
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
