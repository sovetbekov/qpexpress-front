'use client'

import Input from '@/app/components/input/Input'
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

type Props = {
    data: UserWithRecipientsData
    language: string
}

export default function UserReviewForm({data: {user, recipients}, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'admin')
    const dispatch = useAppDispatch()
    const router = useRouter()

    async function onApproveClick() {
        await toast.promise(acceptRecipient(recipients[0].id).then(
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
                        <Input id={'firstName'}
                               label={'Имя'}
                               inputType={'text'}
                               wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                               inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                               value={user.firstName}
                               readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <Input id={'lastName'}
                               label={'Фамилия'}
                               inputType={'text'}
                               wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                               inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                               value={user.lastName}
                               readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <Input id={'patronymic'}
                               label={'Отчество'}
                               inputType={'text'}
                               wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                               inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                               value={user.patronymic}
                               readOnly/>
                    </div>
                    <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                        <Input id={'email'}
                               label={'Электронная почта'}
                               inputType={'text'}
                               wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                               inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                               value={user.email}
                               readOnly/>
                    </div>
                </div>
            </div>
            {recipients.length > 0 && (
                <>
                    <div className={'flex flex-col gap-5'}>
                        <h3>
                            Получатель
                        </h3>
                        <div className={'flex flex-wrap flex-row gap-6'}>
                            <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                                <Input id={'firstName'}
                                       label={'Имя'}
                                       inputType={'text'}
                                       wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                       inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                       value={recipients[0].firstName}
                                       readOnly/>
                            </div>
                            <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                                <Input id={'lastName'}
                                       label={'Фамилия'}
                                       inputType={'text'}
                                       wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                       inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                       value={recipients[0].lastName}
                                       readOnly/>
                            </div>
                            <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                                <Input id={'patronymic'}
                                       label={'Отчество'}
                                       inputType={'text'}
                                       wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                       inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                       value={recipients[0].patronymic}
                                       readOnly/>
                            </div>
                            <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                                <Input id={'iin'}
                                       label={'ИИН'}
                                       inputType={'text'}
                                       wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                       inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                       value={recipients[0].iin}
                                       readOnly/>
                            </div>
                            <Link className={'md:w-[calc(33%-0.51rem)] w-full'}
                                  href={`${BACKEND_URL}/v1/files/${recipients[0].documentSideA.id}/download`}
                                  target={'_blank'}>
                                <Input id={'photo1'}
                                       label={'Сторона А'}
                                       inputType={'text'}
                                       wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                       inputClassname={'md:p-5 p-3 border rounded-full border-black text-blue w-full cursor-pointer'}
                                       value={recipients[0].documentSideA.name}
                                       readOnly/>
                            </Link>
                            <Link className={'md:w-[calc(33%-0.51rem)] w-full'}
                                  href={`${BACKEND_URL}/v1/files/${recipients[0].documentSideB.id}/download`}
                                  target={'_blank'}>
                                <Input id={'photo2'}
                                       label={'Сторона Б'}
                                       inputType={'text'}
                                       wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                       inputClassname={'md:p-5 p-3 border rounded-full border-black text-blue w-full cursor-pointer'}
                                       value={recipients[0].documentSideB.name}
                                       readOnly/>
                            </Link>
                            <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                                <Input id={'district'}
                                       label={'Город/область'}
                                       inputType={'text'}
                                       wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                       inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                       value={`${recipients[0].district}`}
                                       readOnly/>
                            </div>
                            <div className={'md:w-[calc(33%-0.51rem)] w-full'}>
                                <Input id={'phoneNumber'}
                                       label={'Номер телефона'}
                                       inputType={'mask'}
                                       format={'+7 (999) 999-99-99'}
                                       wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                       inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                       value={`${recipients[0].phoneNumber}`}
                                       readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className={'flex flex-row gap-5'}>
                        {
                            recipients[0].status !== 'ACTIVE' &&
                            <button className={'py-4 px-10 w-[15rem] bg-blue text-white rounded-full'}
                                    onClick={onApproveClick}>
                                Принять
                            </button>
                        }
                        <button className={'py-4 px-10 w-[15rem] bg-orange text-white rounded-full'} onClick={() => {
                            dispatch(openModal({modalType: 'denialReason', data: recipients[0]}))
                        }}>
                            Отклонить
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}