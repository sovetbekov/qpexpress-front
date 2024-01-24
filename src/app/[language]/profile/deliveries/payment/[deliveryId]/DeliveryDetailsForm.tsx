import React from 'react'
import Input from '@/app/components/input/Input'
import Link from 'next/link'
import { BACKEND_URL } from '@/globals'
import { DeliveryData } from '@/types'
import PaymentButton from '@/app/[language]/profile/deliveries/payment/[deliveryId]/PaymentButton'

type Props = {
    delivery: DeliveryData
}

export default function DeliveryDetailsForm({delivery}: Readonly<Props>) {
    return (
        <div className={'px-5 flex flex-col gap-y-5'}>
            <h3 className={'text-2xl font-bold md:hidden'}>Данные о товаре</h3>
            <div className={'flex flex-col gap-y-4'}>
                <div className={'flex flex-col gap-4 md:flex-row flex-wrap'}>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <Input
                            id={'weight'}
                            inputType={'text'}
                            label={'Вес (кг)'}
                            wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                            inputClassname={'p-3 w-full md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={delivery.weight + ' кг'}
                            readOnly/>
                    </div>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <Input
                            id={'price'}
                            inputType={'text'}
                            label={'Цена за доставку'}
                            wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                            inputClassname={'md:basis-[calc(33.33%-0.665rem)] p-3 w-full md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={delivery.price + ' $'}
                            readOnly/>
                    </div>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <Input
                            id={'kazpost_track_number'}
                            inputType={'text'}
                            label={'Трек номер от KazPost'}
                            wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                            inputClassname={'md:basis-[calc(33.33%-0.665rem)] p-3 w-full md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={delivery.kazPostTrackNumber}
                            readOnly/>
                    </div>
                    {
                        delivery.invoice &&
                        <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                            <Link href={`${BACKEND_URL}/v1/files/${delivery.invoice.id}/download`}
                                  target={'_blank'}>
                                <Input id={'invoice'}
                                       label={'Накладная'}
                                       inputType={'text'}
                                       wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                       inputClassname={'md:p-5 p-3 border rounded-full border-black text-blue w-full cursor-pointer'}
                                       value={delivery.invoice.name}
                                       readOnly/>
                            </Link>
                        </div>
                    }
                </div>
                <PaymentButton/>
            </div>
        </div>
    )
}