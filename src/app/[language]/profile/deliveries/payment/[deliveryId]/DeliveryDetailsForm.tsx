import React from 'react'
import Link from 'next/link'
import { BACKEND_URL } from '@/globals'
import { DeliveryData } from '@/types'
import PaymentButton from '@/app/[language]/profile/deliveries/payment/[deliveryId]/PaymentButton'
import TextInput from '@/app/components/input/TextInput'

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
                        <TextInput
                            id={'weight'}
                            type={'text'}
                            label={'Вес (кг)'}
                            className={'p-3 w-full md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={delivery.weight + ' кг'}
                            readOnly/>
                    </div>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <TextInput
                            id={'price'}
                            type={'text'}
                            label={'Цена за доставку'}
                            className={'md:basis-[calc(33.33%-0.665rem)] p-3 w-full md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={delivery.price + ' $'}
                            readOnly/>
                    </div>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <TextInput id={'kazpost_track_number'}
                                   type={'text'}
                                   label={'Трек номер от KazPost'}
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
                                           label={'Накладная'}
                                           type={'text'}
                                           className={'md:p-5 p-3 border rounded-full border-black text-blue w-full cursor-pointer'}
                                           value={delivery.invoice.name}
                                           readOnly/>
                            </Link>
                        </div>
                    }
                </div>
                <PaymentButton price={delivery.price}/>
            </div>
        </div>
    )
}