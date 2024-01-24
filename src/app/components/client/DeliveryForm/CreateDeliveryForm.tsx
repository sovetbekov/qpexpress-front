'use client'

import DropdownInput from '@/app/components/input/DropdownInput'
import React, { FormEvent, useEffect, useState } from 'react'
import MoneyInput from '@/app/components/input/MoneyInput'
import FileInput from '@/app/components/input/FileInput'
import Input from '@/app/components/input/Input'
import GoodsTable from '@/app/[language]/admin/deliveries/GoodsTable'
import { RowSelectionState } from '@tanstack/react-table'
import { createDelivery } from '@/services/deliveries'
import { useRouter } from 'next/navigation'
import { CurrencyData, GoodData, RecipientOverview } from '@/types/entities'
import { toast } from 'react-toastify'
import { useTranslation } from '@/app/i18n/client'
import { getGoods } from '@/services/goods'
import { CreateDeliveryFormData } from '@/types'
import { isError, isSuccess } from '@/app/lib/utils'

type Props = {
    recipients: RecipientOverview[]
    currencies: CurrencyData[]
    language: string
}

export default function CreateDeliveryForm({recipients, currencies, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'create_delivery')
    const [formData, setFormData] = useState<CreateDeliveryFormData>({
        price: {
            value: 0,
            currency: currencies[0],
        },
        weight: 0,
        kazPostTrackNumber: '',
        invoice: undefined,
        recipient: undefined,
    })
    const router = useRouter()
    const [goods, setGoods] = useState<GoodData[]>([])
    const [selected, setSelected] = useState<RowSelectionState>({})

    useEffect(() => {
        if (formData.recipient?.id) {
            getGoods({recipientId: formData.recipient.id}).then(response => {
                if (isError(response)) {
                    return []
                }
                return response.data
            }).then(setGoods)
        }
    }, [formData.recipient?.id])

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.recipient) {
            return
        }
        const data = new FormData()
        data.append('recipientId', formData.recipient.id)
        data.append('price', formData.price.value.toString())
        data.append('currencyId', formData.price.currency.id)
        data.append('weight', formData.weight.toString())
        data.append('kazPostTrackNumber', formData.kazPostTrackNumber)
        data.append('invoice', formData.invoice as File)
        data.append('products', JSON.stringify(Object.keys(selected)))
        const toastId = toast.loading(t('edit_profile.saving'))
        const response = await createDelivery(data)
        if (isSuccess(response)) {
            toast.update(toastId, {
                render: 'Посылка успешно сохранена',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            })
            router.push('/admin/deliveries')
        } else if (isError(response)) {
            toast.update(toastId, {
                render: 'Ошибка при сохранении посылки',
                type: 'error',
                isLoading: false,
                autoClose: 2000,
            })
        }
    }

    return (
        <form className={'flex flex-col gap-y-10 md:gap-y-10'} onSubmit={onFormSubmit}>
            <div className={'flex flex-col md:gap-y-5'}>
                <div className={'flex flex-col gap-y-3 mt-7 md:gap-y-5'}>
                    <p className={'hidden md:block md:text-2xl'}>Получатель</p>
                    <h2 className={'text-xl md:hidden'}>Получатель</h2>
                    <div className={'flex flex-col gap-y-3 md:flex-row md:gap-x-10 w-[25rem]'}>
                        <DropdownInput<RecipientOverview> id={'user'} options={recipients}
                                                          label={'Получатель'} selected={formData.recipient}
                                                          getOptionValue={recipient => {
                                                              return `${recipient.firstName} ${recipient.lastName}`
                                                          }} getOptionId={recipient => recipient.id}
                                                          nullable={true} searchable={true}
                                                          setSelected={recipient => setFormData({
                                                              ...formData,
                                                              recipient,
                                                          })}
                                                          wrapperClassname={'w-full relative'}
                                                          inputClassname={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-full p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                                                          dropdownClassname={'w-[calc(100vw-2.5rem)] z-50 md:max-h-60 md:w-full overflow-auto bg-white border my-4 rounded-3xl border-solid border-black'}
                                                          dropdownItemClassname={'cursor-pointer px-8 py-4 border-b-black border-b border-solid last:border-b-0 hover:bg-gray'}
                        />
                    </div>
                </div>
                <div className={'flex flex-col gap-y-3 mt-7 md:gap-y-5'}>
                    <p className={'hidden md:block md:text-2xl'}>Товары</p>
                    <h2 className={'text-xl md:hidden'}>Товары</h2>
                    <div className={'flex flex-col gap-y-3 md:flex-row md:gap-x-10 w-full'}>
                        {
                            goods && goods.length > 0 &&
                            <GoodsTable goods={goods} selected={selected} onSelectedToggle={setSelected}/>
                        }
                    </div>
                </div>
                <div className={'flex flex-col gap-y-3 mt-7 md:gap-y-5'}>
                    <p className={'hidden md:block md:text-2xl'}>Данные о посылке</p>
                    <h2 className={'text-xl md:hidden'}>Данные о посылке</h2>
                    <div className={'flex flex-col gap-y-3 md:gap-y-5'}>
                        <div className={'flex flex-col gap-y-3 md:flex-row md:gap-x-10'}>
                            <div className={'md:basis-1/3'}>
                                <Input
                                    id={'weight'}
                                    inputType={'numeric'}
                                    thousandSeparator={','}
                                    label={'Вес'}
                                    value={formData.weight === 0 ? '' : formData.weight}
                                    onValueChange={e => {
                                        setFormData({
                                            ...formData,
                                            weight: e.floatValue ?? 0,
                                        })
                                    }}
                                    wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                    decimalScale={2}
                                    inputClassname={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
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
                                value={formData.price}
                                onChange={price => setFormData({
                                    ...formData,
                                    price
                                })}
                                required
                            />
                            <FileInput
                                id={'invoice'}
                                name={'invoice'}
                                label={'Накладная'}
                                wrapperClassname={'md:basis-1/3'}
                                onChange={invoice => setFormData({
                                    ...formData,
                                    invoice,
                                })}
                                file={formData.invoice}
                                inputClassname={'w-full p-3 md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                                required
                            />
                        </div>
                        <Input
                            id={'kazPostTrackNumber'}
                            inputType={'text'}
                            label={'Трек номер от KazPost'}
                            wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                            inputClassname={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={formData.kazPostTrackNumber}
                            onChange={kazPostTrackNumber => setFormData({
                                ...formData,
                                kazPostTrackNumber,
                            })}
                        />
                    </div>
                </div>
            </div>
            <button type={'submit'}
                    className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}>
                Сохранить
            </button>
        </form>
    )
}