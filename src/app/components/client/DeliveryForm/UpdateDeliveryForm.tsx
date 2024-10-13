'use client'

import DropdownInput from '@/app/components/input/DropdownInput/DropdownInput'
import React, { FormEvent, useEffect, useState } from 'react'
import MoneyInput from '@/app/components/input/MoneyInput'
import FileInput from '@/app/components/input/FileInput'
import GoodsTable from '@/app/[language]/admin/deliveries/GoodsTable'
import { RowSelectionState } from '@tanstack/react-table'
import { updateDelivery } from '@/services/deliveries'
import { useRouter } from 'next/navigation'
import { DeliveryData, GoodData, RecipientOverview } from '@/types/entities'
import { toast } from 'react-toastify'
import { useTranslation } from '@/app/i18n/client'
import { getGoods } from '@/services/goods'
import { UpdateDeliveryFormData } from '@/types'
import { isError, isSuccess } from '@/app/lib/utils'
import TextInput from '@/app/components/input/TextInput'
import NumericInput from '@/app/components/input/NumericInput'

type Props = {
    data: DeliveryData,
    recipients: RecipientOverview[]
    language: string
}

export default function UpdateDeliveryForm({data, recipients, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'create_delivery')
    const [formData, setFormData] = useState<UpdateDeliveryFormData>({
        id: data.id,
        price: {
            value: data.price,
            currency: data.currency,
        },
        weight: data.weight,
        kazPostTrackNumber: data.kazPostTrackNumber,
        invoice: data.invoice,
        recipient: data.recipient,
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
            }).then(goods => {
                setGoods(goods)
                const selectedGoods = goods.filter(good => good.deliveryId === formData.id)
                const selected = selectedGoods.reduce((acc, good) => {
                    acc[good.id] = true
                    return acc
                }, {} as RowSelectionState)
                setSelected(selected)
            })
        }
    }, [formData.id, formData.recipient.id])

    const recipientOptions = recipients.map(recipient => {
        return {
            id: recipient.id,
            value: recipient,
            label: `${recipient.firstName} ${recipient.lastName}`,
            searchLabel: `${recipient.firstName} ${recipient.lastName}`,
        }
    })

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
        // if (formData.invoice) {
        //     if (formData.invoice instanceof Blob) {
        //         data.append('invoice', formData.invoice as File)
        //     } else {
        //         data.append('invoiceId', formData.invoice.id)
        //     }
        // }
        data.append('products', JSON.stringify(Object.keys(selected)))
        const toastId = toast.loading(t('edit_profile.saving'))
        const response = await updateDelivery(formData.id, data)
        
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
                        <DropdownInput<RecipientOverview> id={'user'} options={recipientOptions}
                                                          label={'Получатель'} selected={formData.recipient?.id}
                                                          nullable={false} searchable={true}
                                                          setSelected={recipient => setFormData({
                                                              ...formData,
                                                              recipient: recipient?.value,
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
                                <NumericInput
                                    id={'weight'}
                                    thousandSeparator={','}
                                    label={'Вес'}
                                    value={formData.weight === 0 ? '' : formData.weight}
                                    onValueChange={e => {
                                        setFormData({
                                            ...formData,
                                            weight: e.floatValue ?? 0,
                                        })
                                    }}
                                    decimalScale={2}
                                    className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                    required
                                />
                            </div>
                            <MoneyInput
                                id={'price'}
                                language={language}
                                inputClassname={'md:basis-2/3 p-3 md:p-4 w-full placeholder-black rounded-l-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
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
                        <TextInput
                            id={'kazPostTrackNumber'}
                            type={'text'}
                            label={'Трек номер от KazPost'}
                            className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                            value={formData.kazPostTrackNumber}
                            onChange={e => setFormData({
                                ...formData,
                                kazPostTrackNumber: e.target.value,
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
