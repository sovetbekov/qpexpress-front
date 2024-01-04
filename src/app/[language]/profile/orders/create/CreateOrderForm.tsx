'use client'

import DropdownInput from '@/app/components/input/DropdownInput'
import React, { FormEvent } from 'react'
import { useImmer } from 'use-immer'
import MoneyInput from '@/app/components/input/MoneyInput'
import { v4 as uuidv4 } from 'uuid'
import FileInput from '@/app/components/input/FileInput'
import CheckboxInput from '@/app/components/input/CheckboxInput'
import { useGetCountriesQuery } from '@/redux/reducers/countriesApi'
import { CountryData } from '@/redux/types'
import { createOrder } from '@/services/orders'
import { ProductInfo } from '@/app/[language]/profile/orders/create/types'
import Input from '@/app/components/input/Input'
import { useAuthenticationActions } from '@/hooks/client/useAuthenticationActions'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

function createDefaultProductInfo(): ProductInfo {
    return {
        id: uuidv4(),
        customOrderId: '',
        country: undefined,
        price: undefined,
        trackingNumber: '',
        description: '',
        name: '',
        productLink: '',
        orderId: '',
        invoice: undefined,
        originalBox: false,
    }
}

export default function CreateOrderForm() {
    const [formData, updateFormData] = useImmer<ProductInfo[]>([createDefaultProductInfo()])
    const {data: countries} = useGetCountriesQuery()
    const {auth} = useAuthenticationActions()
    const router = useRouter()

    const updateProductInfoCallback = <T extends keyof ProductInfo>(index: number, field: T) => (value: ProductInfo[T]) => {
        updateFormData(draft => {
            draft[index][field] = value
        })
    }

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const userId = auth.status === 'authenticated' ? auth.session.user.id : undefined
        if (userId) {
            const promises = formData.map(productInfo => {
                const data = new FormData()
                data.append('trackingNumber', productInfo.trackingNumber)
                data.append('userId', userId)
                data.append('orderId', productInfo.orderId)
                data.append('name', productInfo.name)
                data.append('description', productInfo.description)
                data.append('price', productInfo.price!!.value.toString())
                data.append('currencyId', productInfo.price!!.currency.id)
                data.append('invoice', productInfo.invoice as File)
                data.append('countryId', productInfo.country?.id as string)
                data.append('originalBox', productInfo.originalBox.toString())
                data.append('productLink', productInfo.productLink)
                return createOrder(data)
            })
            const result = await toast.promise(Promise.all(promises), {
                pending: 'Создание заказа...',
                success: 'Заказ успешно создан',
                error: 'Ошибка при создании заказа',
            })
            if (result.every(res => res.status === 'success')) {
                router.push('/profile/orders')
            }
        }
    }

    return (
        <div className={'flex flex-col p-5 gap-y-5 md:gap-y-[8rem]'}>
            <h2 className={'text-2xl md:hidden'}>Добавить заказ</h2>
            <form className={'flex flex-col gap-y-10 md:gap-y-10'} onSubmit={onFormSubmit}>
                {
                    formData.map((productInfo, index) => {
                        return (
                            <div className={'flex flex-col md:gap-y-5'} key={productInfo.id}>
                                <div className={'flex flex-col md:gap-y-5'}>
                                    <p className={'hidden md:block md:text-2xl'}>Информация о товаре</p>
                                    <h2 className={'text-xl md:hidden mb-3'}>Информация о товаре</h2>
                                    <div className={'flex flex-col gap-y-3'}>
                                        <div className={'flex flex-col md:flex-row gap-y-3 md:gap-x-10'}>
                                            <div
                                                className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                                <DropdownInput<CountryData>
                                                    id={'country'}
                                                    options={countries ?? []}
                                                    inputClassname={'border border-black rounded-full p-3 md:p-4 cursor-pointer'}
                                                    dropdownClassname={'md:max-h-60 w-[calc(100vw-2.5rem)] z-50 overflow-auto bg-white border md:mx-0 my-3 md:w-full rounded-3xl border-black'}
                                                    dropdownItemClassname={'cursor-pointer p-3 md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                                    label={'Страна отправления'}
                                                    selected={productInfo.country}
                                                    setSelected={updateProductInfoCallback(index, 'country')}
                                                    getOptionValue={(option) => option.name}
                                                    getOptionId={(option) => option.id}
                                                    searchable={true} nullable={true} readOnly={true}
                                                />
                                            </div>
                                            <div
                                                className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                                <Input
                                                    id={'order_id'}
                                                    label={'ID заказа'}
                                                    inputType={'text'}
                                                    disabled={!productInfo.country}
                                                    value={productInfo.orderId}
                                                    wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                                    inputClassname={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 required:invalid:border-red-500'}
                                                    onChange={(value) => updateProductInfoCallback(index, 'orderId')(value)}
                                                    required
                                                />
                                            </div>
                                            <div
                                                className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                                <Input
                                                    id={'tracking_number'}
                                                    label={'Номер трекинга'}
                                                    inputType={'text'}
                                                    wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                                    inputClassname={'md:basis-1/3 md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                    disabled={!productInfo.country}
                                                    value={productInfo.trackingNumber}
                                                    onChange={(value) => updateProductInfoCallback(index, 'trackingNumber')(value)}
                                                />
                                            </div>
                                        </div>
                                        <Input
                                            id={'link'}
                                            label={'Ссылка на товар'}
                                            inputType={'text'}
                                            disabled={!productInfo.country}
                                            value={productInfo.productLink}
                                            wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                            inputClassname={'md:basis-1/3 md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 invalid:border-red-500'}
                                            onChange={(value) => updateProductInfoCallback(index, 'productLink')(value)}
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
                                                <Input
                                                    id={'name'}
                                                    inputType={'text'}
                                                    label={'Наименование'}
                                                    wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                                    inputClassname={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                    value={productInfo.name}
                                                    disabled={!productInfo.country}
                                                    onChange={(value) => updateProductInfoCallback(index, 'name')(value)}
                                                    required
                                                />
                                            </div>
                                            <MoneyInput
                                                id={'price'}
                                                inputClassname={'md:basis-2/3 p-3 md:p-4 placeholder-black rounded-l-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                wrapperClassname={'md:basis-1/3 flex flex-row items-center w-full'}
                                                currencyWrapperClassname={'w-1/2 relative'}
                                                currencyInputClassname={'min-w-fit p-3 md:p-4 placeholder-black rounded-r-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                currencyDropdownClassname={'md:max-h-60 w-full z-50 overflow-auto bg-white border md:mx-0 md:my-4 rounded-3xl border-black'}
                                                currencyItemClassname={'cursor-pointer p-3 md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                                label={'Цена'}
                                                value={productInfo.price}
                                                onChange={updateProductInfoCallback(index, 'price')}
                                                disabled={!productInfo.country}
                                                required
                                            />
                                            <FileInput
                                                id={'invoice'}
                                                label={'Накладная'}
                                                disabled={!productInfo.country}
                                                wrapperClassname={'md:basis-1/3'}
                                                onChange={updateProductInfoCallback(index, 'invoice')}
                                                inputClassname={'w-full p-3 md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                                            />
                                        </div>
                                        <Input
                                            id={'description'}
                                            inputType={'text'}
                                            label={'Описание товара'}
                                            wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                            inputClassname={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                            value={productInfo.description}
                                            disabled={!productInfo.country}
                                            onChange={(value) => updateProductInfoCallback(index, 'description')(value)}
                                            required
                                        />
                                    </div>
                                    <CheckboxInput
                                        label={'Оставить оригинальную коробку товара'}
                                        disabled={!productInfo.country}
                                        wrapperClassname={'flex items-center gap-x-3 cursor-pointer outline-none w-fit'}
                                        checkboxClassname={'border-none w-6 h-6 outline-none'}
                                        checked={productInfo.originalBox}
                                        onChange={updateProductInfoCallback(index, 'originalBox')}
                                    />
                                </div>
                            </div>
                        )
                    })
                }
                <div className={'flex flex-col gap-5 mt-5'}>
                    <button className={'border border-blue text-blue w-full p-3 md:p-5 rounded-full'} type={'button'}
                            onClick={() => {
                                updateFormData(draft => {
                                    draft.push(createDefaultProductInfo())
                                })
                            }}>
                        + Добавить товар
                    </button>
                    <button type={'submit'}
                            className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}>
                        Добавить
                    </button>
                </div>
            </form>
        </div>
    )
}