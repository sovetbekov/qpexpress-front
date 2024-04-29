'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BACKEND_URL } from '@/globals'
import { DeliveryData } from '@/types'
import PaymentButton from '@/app/[language]/profile/deliveries/payment/[deliveryId]/PaymentButton'
import TextInput from '@/app/components/input/TextInput'
import { getPaymentStatus } from '@/services/payment'
import { useTranslation } from '@/app/i18n/client'
import MoneyInput from '@/app/components/input/MoneyInput'

type Props = {
    delivery: DeliveryData
    language: string
}

export default function DeliveryDetailsForm({delivery, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'delivery')
    const [isPaidLoading, setIsPaidLoading] = useState(true)
    const [isPaid, setIsPaid] = useState(false)
    useEffect(() => {
        async function fetchStatus() {
            const paymentStatus = await getPaymentStatus({deliveryId: delivery.id})
            if (paymentStatus.status === 'error') {
                console.error(paymentStatus.error)
                return
            }
            if (paymentStatus.data === 'Processed') {
                setIsPaid(true)
            }
            setIsPaidLoading(false)
        }

        fetchStatus().catch(console.error)
    }, [delivery.id])

    return (
        <div className={'px-5 flex flex-col gap-y-5'}>
            <h3 className={'text-2xl font-bold md:hidden'}>{t('delivery_information')}</h3>
            <div className={'flex flex-col gap-y-4'}>
                <div className={'flex flex-col gap-4 md:flex-row flex-wrap'}>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <TextInput
                            id={'weight'}
                            type={'text'}
                            label={t('weight')}
                            className={'p-3 w-full md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={delivery.weight + ' кг'}
                            readOnly/>
                    </div>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <div className={'relative'}>
                            <MoneyInput
                                id={'price'}
                                language={language}
                                inputClassname={'md:basis-2/3 p-3 md:p-4 w-full placeholder-black rounded-l-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                wrapperClassname={'md:basis-1/3 flex flex-row items-center w-full'}
                                currencyWrapperClassname={'w-1/2 relative'}
                                currencyInputClassname={'w-full p-3 md:p-4 placeholder-black rounded-r-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                currencyDropdownClassname={'mt-3 md:mt-5 md:max-h-60 w-full z-50 overflow-auto bg-white border md:mx-0 md:my-4 rounded-3xl border-black'}
                                currencyItemClassname={'cursor-pointer w-full text-left p-3 md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                label={'Цена'}
                                value={{
                                    value: delivery.price,
                                    currency: delivery.currency,
                                }}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <TextInput id={'kazpost_track_number'}
                                   type={'text'}
                                   label={t('kazpost_track_number')}
                                   className={'md:basis-[calc(33.33%-0.665rem)] p-3 w-full md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                   value={delivery.kazPostTrackNumber}
                                   readOnly/>
                    </div>
                    {
                        delivery.invoice &&
                        <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                            <Link href={`${BACKEND_URL}/v1/files/${delivery.invoice.id}/download`}
                                  target={'_blank'}>
                                <TextInput id={'invoice'}
                                           label={t('invoice')}
                                           type={'text'}
                                           className={'md:p-5 p-3 border rounded-full border-black text-blue w-full cursor-pointer'}
                                           value={delivery.invoice.name}
                                           readOnly/>
                            </Link>
                        </div>
                    }
                </div>
                {
                    !isPaidLoading && !isPaid &&
                    <PaymentButton price={delivery.price} currency={delivery.currency} deliveryId={delivery.id}
                                   language={language}/>
                }
            </div>
        </div>
    )
}