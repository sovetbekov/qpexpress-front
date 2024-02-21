'use client'

import React, { useEffect, useState } from 'react'
import MoneyInput from '@/app/components/input/MoneyInput'
import FileInput from '@/app/components/input/FileInput'
import GoodsTable from '@/app/[language]/admin/deliveries/GoodsTable'
import { DeliveryData, GoodData } from '@/types/entities'
import { getGoods } from '@/services/goods'
import { isError } from '@/app/lib/utils'
import TextInput from '@/app/components/input/TextInput'
import NumericInput from '@/app/components/input/NumericInput'

type Props = {
    data: DeliveryData
    language: string
}

export default function ReadOnlyDeliveryForm({data}: Readonly<Props>) {
    const [goods, setGoods] = useState<GoodData[]>([])

    useEffect(() => {
        getGoods({recipientId: data.recipient.id}).then(response => {
            if (isError(response)) {
                return []
            }
            return response.data
        }).then(setGoods)
    }, [data.recipient.id])

    const selectedGoods = data.goods.reduce(((prev, good) => ({...prev, [good.id]: true})), {} satisfies {
        [key: string]: boolean
    })

    return (
        <div className={'flex flex-col gap-y-10 md:gap-y-10'}>
            <div className={'flex flex-col md:gap-y-5'}>
                <div className={'flex flex-col gap-y-3 mt-7 md:gap-y-5'}>
                    <p className={'hidden md:block md:text-2xl'}>Получатель</p>
                    <h2 className={'text-xl md:hidden'}>Получатель</h2>
                    <div className={'flex flex-col gap-y-3 md:flex-row md:gap-x-10 w-[25rem]'}>
                        <TextInput id={'user'}
                                   type={'text'}
                                   value={`${data.recipient.firstName} ${data.recipient.lastName}`}
                                   label={'Получатель'}
                                   className={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-full p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                                   readOnly
                                   required
                        />
                    </div>
                </div>
                <div className={'flex flex-col gap-y-3 mt-7 md:gap-y-5'}>
                    <p className={'hidden md:block md:text-2xl'}>Товары</p>
                    <h2 className={'text-xl md:hidden'}>Товары</h2>
                    <div className={'flex flex-col gap-y-3 md:flex-row md:gap-x-10 w-full'}>
                        {
                            goods && goods.length > 0 &&
                            <GoodsTable goods={goods} selected={selectedGoods}/>
                        }
                    </div>
                </div>
                <div className={'flex flex-col gap-y-3 mt-7 md:gap-y-5'}>
                    <p className={'hidden md:block md:text-2xl'}>Данные о посылке</p>
                    <h2 className={'text-xl md:hidden'}>Данные о посылке</h2>
                    <div className={'flex flex-col gap-y-3 md:gap-y-5'}>
                        <div className={'flex flex-col gap-y-3 md:flex-row md:gap-x-10'}>
                            <div className={'md:basis-1/3'}>
                                <NumericInput
                                    id={'weight'}
                                    thousandSeparator={','}
                                    label={'Вес'}
                                    value={data.weight === 0 ? '' : data.weight}
                                    decimalScale={2}
                                    className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                    required
                                    readOnly
                                />
                            </div>
                            <MoneyInput
                                id={'price'}
                                inputClassname={'md:basis-2/3 p-3 md:p-4 placeholder-black rounded-l-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                wrapperClassname={'md:basis-1/3 flex flex-row items-center w-full'}
                                currencyWrapperClassname={'w-1/2 relative'}
                                currencyInputClassname={'min-w-fit p-3 md:p-4 placeholder-black rounded-r-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                currencyDropdownClassname={'mt-3 md:mt-5 md:max-h-60 w-full z-50 overflow-auto bg-white border md:mx-0 md:my-4 rounded-3xl border-black'}
                                currencyItemClassname={'cursor-pointer w-full text-left p-3 md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                label={'Цена'}
                                value={{
                                    value: data.price,
                                    currency: data.currency,
                                }}
                                required
                                readOnly
                            />
                            <FileInput
                                id={'invoice'}
                                name={'invoice'}
                                label={'Накладная'}
                                wrapperClassname={'md:basis-1/3'}
                                file={data.invoice}
                                inputClassname={'w-full p-3 md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                                readOnly
                            />
                        </div>
                        <TextInput
                            id={'kazPostTrackNumber'}
                            type={'text'}
                            label={'Трек номер от KazPost'}
                            className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={data.kazPostTrackNumber}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}