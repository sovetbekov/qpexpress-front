'use client'

import React from 'react'
import { OrderData } from '@/redux/reducers/ordersApi'
import Input from '@/app/components/input/Input'

type Props = {
    orderData: OrderData
}

export default function Page({orderData}: Props) {
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
                            value={orderData.weight + ' кг'}
                            readOnly/>
                    </div>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <Input
                            id={'price'}
                            inputType={'text'}
                            label={'Цена за доставку'}
                            wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                            inputClassname={'md:basis-[calc(33.33%-0.665rem)] p-3 w-full md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={orderData.deliveryPrice + ' $'}
                            readOnly/>
                    </div>
                    <div className={'md:basis-[calc(33.33%-0.665rem)]'}>
                        <Input
                            id={'kazpost_track_number'}
                            inputType={'text'}
                            label={'Трек номер от KazPost'}
                            wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                            inputClassname={'md:basis-[calc(33.33%-0.665rem)] p-3 w-full md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={orderData.kazPostTrackNumber}
                            readOnly/>
                    </div>
                    {
                        orderData.invoiceId &&
                        <button
                            className={'md:basis-[calc(33.33%-0.665rem)] p-3 w-full text-left md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            onClick={() => window.open(`https://api.qpexpress.kz/v1/files/${orderData.invoiceId}`, '_blank')}
                        >
                            Накладная
                        </button>
                    }
                </div>
                <button className={'w-full bg-blue rounded-full p-3 text-white'}>
                    Оплатить
                </button>
            </div>
        </div>
    )
}