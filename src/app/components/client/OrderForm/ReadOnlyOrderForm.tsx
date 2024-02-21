'use client'

import React from 'react'
import MoneyInput from '@/app/components/input/MoneyInput'
import FileInput from '@/app/components/input/FileInput'
import CheckboxInput from '@/app/components/input/CheckboxInput'
import { OrderFormData } from '@/types'
import TextInput from '@/app/components/input/TextInput'

type Props = {
    data: OrderFormData,
}

export default function ReadOnlyOrderForm({data}: Readonly<Props>) {
    return (
        <div className={'flex flex-col gap-y-10 md:gap-y-10'}>
            {
                data.goods.map((productInfo) => {
                    return (
                        <div className={'flex flex-col md:gap-y-5'} key={productInfo.id}>
                            <div className={'flex flex-col md:gap-y-5'}>
                                <p className={'hidden md:block md:text-2xl'}>Информация о товаре</p>
                                <h2 className={'text-xl md:hidden mb-3'}>Информация о товаре</h2>
                                <div className={'flex flex-col gap-y-3'}>
                                    <div className={'flex flex-col md:flex-row gap-y-3 md:gap-x-10'}>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <TextInput
                                                id={'country'}
                                                label={'Страна отправления'}
                                                type={'text'}
                                                value={productInfo.country!!.name}
                                                className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 required:invalid:border-red-500'}
                                                readOnly
                                            />
                                        </div>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <TextInput
                                                id={'custom_order_id'}
                                                label={'ID заказа'}
                                                type={'text'}
                                                disabled={!productInfo.country}
                                                value={productInfo.customOrderId}
                                                className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 required:invalid:border-red-500'}
                                                required
                                                readOnly
                                            />
                                        </div>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <TextInput
                                                id={'tracking_number'}
                                                label={'Номер трекинга'}
                                                type={'text'}
                                                className={'md:basis-1/3 md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                disabled={!productInfo.country}
                                                value={productInfo.trackingNumber}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <TextInput
                                        id={'link'}
                                        label={'Ссылка на товар'}
                                        type={'text'}
                                        disabled={!productInfo.country}
                                        value={productInfo.link}
                                        className={'md:basis-1/3 md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 invalid:border-red-500'}
                                        readOnly
                                        required
                                    />
                                </div>
                            </div>
                            <div className={'flex flex-col gap-y-3 mt-7 md:gap-y-5'}>
                                <p className={'hidden md:block md:text-2xl'}>Декларация</p>
                                <h2 className={'text-xl md:hidden'}>Декларация</h2>
                                <div className={'flex flex-col gap-y-3 md:gap-y-5'}>
                                    <div className={'flex flex-col gap-y-3 md:flex-row md:gap-x-10'}>
                                        <div className={'md:basis-1/3'}>
                                            <TextInput
                                                id={'name'}
                                                type={'text'}
                                                label={'Наименование'}
                                                className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                value={productInfo.name}
                                                disabled={!productInfo.country}
                                                readOnly
                                                required
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
                                            value={productInfo.price}
                                            disabled={!productInfo.country}
                                            readOnly
                                            required
                                        />
                                        <FileInput
                                            id={'invoice'}
                                            label={'Накладная'}
                                            disabled={!productInfo.country}
                                            file={productInfo.invoice}
                                            wrapperClassname={'md:basis-1/3'}
                                            inputClassname={'w-full p-3 md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                                            readOnly
                                        />
                                    </div>
                                    <TextInput
                                        id={'description'}
                                        type={'text'}
                                        label={'Описание товара'}
                                        className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                        value={productInfo.description}
                                        disabled={!productInfo.country}
                                        readOnly
                                        required
                                    />
                                </div>
                                <CheckboxInput
                                    label={'Оставить оригинальную коробку товара'}
                                    disabled={!productInfo.country}
                                    wrapperClassname={'flex items-center gap-x-3 cursor-pointer outline-none w-fit'}
                                    checkboxClassname={'border-none w-6 h-6 outline-none'}
                                    checked={productInfo.originalBox}
                                    readOnly
                                />
                            </div>
                        </div>
                    )
                })
            }
            <div className={'flex flex-col gap-5'}>
                <p className={'hidden md:block md:text-2xl'}>Получатель</p>
                <TextInput id={'recipient'}
                       type={'text'}
                       value={`${data.recipient?.firstName} ${data.recipient?.lastName}` ?? ''}
                       className={'border border-black rounded-full p-3 md:p-4 cursor-pointer disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                       label={'Получатель'}
                       readOnly/>
            </div>
        </div>
    )
}