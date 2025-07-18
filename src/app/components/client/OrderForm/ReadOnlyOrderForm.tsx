'use client'

import React from 'react'
import MoneyInput from '@/app/components/input/MoneyInput'
import FileInput from '@/app/components/input/FileInput'
import CheckboxInput from '@/app/components/input/CheckboxInput'
import { OrderFormData } from '@/types'
import TextInput from '@/app/components/input/TextInput'
import { getNameByLanguage } from '@/util'
import { useTranslation } from '@/app/i18n/client'
import { FiCheckCircle, FiUser, FiXCircle } from 'react-icons/fi'
import Link from 'next/link'

type Props = {
    data: OrderFormData,
    language: string
}

export default function ReadOnlyOrderForm({data, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'order')
    return (
        <div className={'flex flex-col gap-y-10 md:gap-y-10'}>
            {
                data.goods.map((productInfo) => {
                    return (
                        <div className={'flex flex-col md:gap-y-5'} key={productInfo.id}>
                            <div className={'flex flex-col md:gap-y-5'}>
                                <p className={'hidden md:block md:text-2xl'}>{t('product_information')}</p>
                                <h2 className={'text-xl md:hidden mb-3'}>{t('product_information')}</h2>
                                <div className={'flex flex-col gap-y-3'}>
                                    <div className={'flex flex-col md:flex-row gap-y-3 md:gap-x-10'}>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <TextInput
                                                id={'country'}
                                                label={'Страна отправления'}
                                                type={'text'}
                                                value={getNameByLanguage(productInfo.country!!, language)}
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
                                            language={language}
                                            inputClassname={'md:basis-2/3 w-full p-3 md:p-4 placeholder-black rounded-l-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
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
                                    label={productInfo.country?.id === "f356c176-de9e-4479-909f-12b36900a314" ? t('original_box_for_korea') : t('original_box')}
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
                <Link href={``}>
                    <div
                        className={`flex items-center p-4 border rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer ${
                            data.recipient?.status === 'ACTIVE' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                        }`}
                        >
                        <div className="flex items-center justify-center w-16 h-16 text-white rounded-full shadow-md bg-gradient-to-br from-blue-400 to-blue-600">
                            <FiUser size={32} />
                        </div>
                        <div className="flex-1 ml-4">
                            <h3 className="text-lg font-semibold text-gray-800">{`${data.recipient?.firstName} ${data.recipient?.lastName}`}</h3>
                            <p className="text-sm text-gray-500">{data.recipient?.patronymic}</p>
                            <div className="flex items-center mt-2 space-x-2">
                            {data.recipient?.status === 'ACTIVE' ? (
                                <FiCheckCircle className="text-green-500" size={20} />
                            ) : (
                                <FiXCircle className="text-red-500" size={20} />
                            )}
                            <span className="text-sm font-medium text-gray-700">
                                {data.recipient?.status === 'ACTIVE' ? 'Активен' : 'Неактивен'}
                            </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}