'use client'

import React, { FormEvent, useState } from 'react'
import {
    CountryData,
    Errors, FileMetaData,
    GoodFormData,
    OrderFormData,
    RecipientData,
    RecipientOverview,
    SuccessResponse,
} from '@/types'
import MoneyInput from '@/app/components/input/MoneyInput'
import { v4 as uuidv4 } from 'uuid'
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useImmer } from 'use-immer'
import { useRouter } from 'next/navigation'
import DropdownInput from '@/app/components/input/DropdownInput/DropdownInput'
import { isError, isSuccess, notEmpty } from '@/app/lib/utils'
import { toast } from 'react-toastify'
import { createOrder } from '@/services/orders'
import FileInput from '@/app/components/input/FileInput'
import CheckboxInput from '@/app/components/input/CheckboxInput'
import { uploadFile } from '@/services/files'
import Link from 'next/link'
import TextInput from '@/app/components/input/TextInput'
import { Option } from '@/app/components/input/DropdownInput/Dropdown'
import { getNameByLanguage } from '@/util'
import { useTranslation } from '@/app/i18n/client'
import useAuthorization from '@/hooks/client/auth'

function createDefaultProductInfo(): GoodFormData {
    return {
        id: uuidv4(),
        country: undefined,
        price: undefined,
        trackingNumber: '',
        description: '',
        name: '',
        link: '',
        customOrderId: '',
        invoice: undefined,
        originalBox: false,
        quantity: 1
    }
}

type Props = {
    countries: CountryData[],
    initialData?: OrderFormData,
    recipients: RecipientData[],
    language: string,
}

export default function EditableOrderForm({initialData, countries, recipients, language}: Readonly<Props>) {
    const [currentCountry, setCurrentCountry] = useState<CountryData | null>(null);
    const {t} = useTranslation(language, 'order')
    const [formData, updateFormData] = useImmer<OrderFormData>(initialData ?? {
        recipient: undefined,
        goods: [createDefaultProductInfo()],
    })
    const [errors, setErrors] = useState<Errors>({})
    const auth = useAuthorization()
    const router = useRouter()

    const updateProductInfoCallback = <T extends keyof GoodFormData>(index: number, field: T) => (value: GoodFormData[T]) => {
        updateFormData(draft => {
            draft.goods[index][field] = value
        })
    }

    async function submitOrder() {
        const userId = auth.status === 'authenticated' ? auth.session.user.id : undefined
        const recipientId = formData.recipient?.id
        const invoices = formData.goods.map(productInfo => productInfo.invoice)
        const fileResults = await Promise.all(invoices.map(invoice => {
            if (invoice) {
                const form = new FormData()
                form.append('file', invoice)
                return uploadFile(form)
            }
        }))
        if (fileResults.some(response => response ? isError(response) : false)) {
            throw fileResults.filter(notEmpty).reduce((acc, result, index) => {
                if (isError(result)) {
                    return {...acc, [`invoice_${index}`]: [result.error]}
                } else {
                    return acc
                }
            }, {})
        }
        const data = {
            recipientId,
            goods: formData.goods.map((productInfo, index) => {
                return {
                    name: productInfo.name,
                    customOrderId: productInfo.customOrderId,
                    description: productInfo.description,
                    price: productInfo.price!!.value,
                    currencyId: productInfo.price!!.currency.id,
                    invoiceId: (fileResults[index] as SuccessResponse<FileMetaData> | undefined)?.data?.id,
                    countryId: productInfo.country?.id,
                    originalBox: productInfo.originalBox,
                    trackingNumber: productInfo.trackingNumber,
                    link: productInfo.link,
                    recipientId,
                    quantity: productInfo.quantity,
                    userId,
                }
            }),
        }
        return await createOrder(data, language)
    }

    const recipientOptions = recipients.map(recipient => {
        return {
            id: recipient.id,
            value: recipient,
            label: `${recipient.firstName} ${recipient.lastName}`,
        } as Option<RecipientData>
    })
    const countryOptions = countries.map(country => {
        return {
            id: country.id,
            value: country,
            label: getNameByLanguage(country, language),
        } as Option<CountryData>
    })

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const promise = submitOrder().then(result => {
            if (isSuccess(result)) {
                return result
            } else {
                setErrors(result.error)
                throw result
            }
        })
        await toast.promise(promise, {
            pending: 'Создание заказа...',
            success: 'Заказ успешно создан',
            error: 'Ошибка при создании заказа',
        })
        router.push('/profile/orders')
    }

    return (
        <form className={'flex flex-col gap-y-10 md:gap-y-10'} onSubmit={onFormSubmit}>
            {
                recipients.length === 0 && (
                    <div>
                        <div className={'flex flex-row gap-x-3 text-orange items-center'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 21 21"
                                 className={'fill-orange'}>
                                <path
                                    d="M10.5 14.4062C10.9315 14.4062 11.2812 14.756 11.2812 15.1875V15.9688C11.2812 16.4002 10.9315 16.75 10.5 16.75C10.0685 16.75 9.71875 16.4002 9.71875 15.9688V15.1875C9.71875 14.756 10.0685 14.4062 10.5 14.4062Z"/>
                                <path
                                    d="M10.5 4.25C10.0242 4.25 9.59083 4.52722 9.42002 4.97129C9.19948 5.54466 8.9375 6.33048 8.9375 6.82812C8.93749 8.65806 9.33109 10.921 9.55955 12.0803C9.6479 12.5286 10.043 12.8438 10.5 12.8438C10.957 12.8438 11.3521 12.5286 11.4405 12.0803C11.6689 10.921 12.0625 8.65806 12.0625 6.82812C12.0625 6.33048 11.8005 5.54465 11.58 4.97128C11.4092 4.52722 10.9758 4.25 10.5 4.25Z"/>
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M10.5 0.34375C4.89086 0.34375 0.34375 4.89086 0.34375 10.5C0.34375 16.1091 4.89086 20.6562 10.5 20.6562C16.1091 20.6562 20.6562 16.1091 20.6562 10.5C20.6562 4.89086 16.1091 0.34375 10.5 0.34375ZM1.90625 10.5C1.90625 5.7538 5.7538 1.90625 10.5 1.90625C15.2462 1.90625 19.0938 5.7538 19.0938 10.5C19.0938 15.2462 15.2462 19.0938 10.5 19.0938C5.7538 19.0938 1.90625 15.2462 1.90625 10.5Z"/>
                            </svg>
                            <div>
                                <p className={'text-xl'}>
                                    {t('recipient_notification_1')}
                                </p>
                                <Link href={'/profile/edit'} className={'text-blue text-xl'}>
                                    {t('recipient_notification_2')}
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                Object.values(errors).some(value => value.length > 0) && (
                    <div className={'flex flex-row gap-x-3 text-orange items-center'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 21 21"
                             className={'fill-orange'}>
                            <path
                                d="M10.5 14.4062C10.9315 14.4062 11.2812 14.756 11.2812 15.1875V15.9688C11.2812 16.4002 10.9315 16.75 10.5 16.75C10.0685 16.75 9.71875 16.4002 9.71875 15.9688V15.1875C9.71875 14.756 10.0685 14.4062 10.5 14.4062Z"/>
                            <path
                                d="M10.5 4.25C10.0242 4.25 9.59083 4.52722 9.42002 4.97129C9.19948 5.54466 8.9375 6.33048 8.9375 6.82812C8.93749 8.65806 9.33109 10.921 9.55955 12.0803C9.6479 12.5286 10.043 12.8438 10.5 12.8438C10.957 12.8438 11.3521 12.5286 11.4405 12.0803C11.6689 10.921 12.0625 8.65806 12.0625 6.82812C12.0625 6.33048 11.8005 5.54465 11.58 4.97128C11.4092 4.52722 10.9758 4.25 10.5 4.25Z"/>
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M10.5 0.34375C4.89086 0.34375 0.34375 4.89086 0.34375 10.5C0.34375 16.1091 4.89086 20.6562 10.5 20.6562C16.1091 20.6562 20.6562 16.1091 20.6562 10.5C20.6562 4.89086 16.1091 0.34375 10.5 0.34375ZM1.90625 10.5C1.90625 5.7538 5.7538 1.90625 10.5 1.90625C15.2462 1.90625 19.0938 5.7538 19.0938 10.5C19.0938 15.2462 15.2462 19.0938 10.5 19.0938C5.7538 19.0938 1.90625 15.2462 1.90625 10.5Z"/>
                        </svg>
                        <p className={'text-xl'}>
                            {t('error')}
                        </p>
                    </div>
                )
            }
            {
                formData.goods.map((productInfo, index) => {
                    return (
                        <div className={'flex flex-col md:gap-y-5'} key={productInfo.id}>
                            <div className={'flex flex-col md:gap-y-5'}>
                            <div className="flex items-center ">
                                    <p className="md:text-2xl">{t('product_information')}</p>
                                    <div className="relative group flex items-center">
                                        <AiOutlineInfoCircle
                                            className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg md:text-xl"
                                            style={{ marginLeft: 15 }}
                                        />
                                        <div
                                            className="absolute right-0 top-full mt-1 hidden w-60 p-3 bg-white border border-gray-300 rounded-lg shadow-lg text-sm text-gray-700 group-hover:block"
                                            style={{ zIndex: 3 }}
                                        >
                                            {t('volume_weight_info')}
                                        </div>
                                    </div>
                                </div>
                                <h2 className={'text-xl md:hidden mb-3'}>{t('product_information')}</h2>
                                <div className={'flex flex-col gap-y-3'}>
                                    <div className={'flex flex-col md:flex-row gap-y-3 md:gap-x-10'}>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <DropdownInput<CountryData>
                                                id={`country_${index}`}
                                                options={countryOptions}
                                                inputClassname={'border border-black rounded-full p-3 md:p-4 cursor-pointer w-full disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                dropdownClassname={'md:max-h-60 w-[calc(100vw-2.5rem)] z-50 overflow-auto bg-white border md:mx-0 my-3 md:w-full rounded-3xl border-black'}
                                                dropdownItemClassname={'cursor-pointer p-3 w-full text-left md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                                errorsClassname={'absolute top-0 right-0 flex flex-row items-center h-full pr-10 text-[#EF4444]'}
                                                label={t('country')}
                                                selected={productInfo.country?.id}
                                                // setSelected={(option) => updateProductInfoCallback(index, 'country')(option?.value)}
                                                setSelected={(option) => {
                                                    updateProductInfoCallback(index, 'country')(option?.value);
                                                    setCurrentCountry(option?.value || null);
                                                }}
                                                errors={errors}
                                                setErrors={setErrors}
                                                searchable={true}
                                                nullable={true}
                                                disabled={recipients.length === 0}
                                                required
                                            />
                                        </div>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <TextInput
                                                id={`quantity_${index}`}
                                                label={t('quantity')}
                                                type={'number'}
                                                min={0}
                                                step={1}
                                                disabled={!productInfo.country}
                                                errors={errors}
                                                setErrors={setErrors}
                                                value={productInfo.quantity}
                                                className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 required:invalid:border-red-500'}
                                                onChange={(e) => updateProductInfoCallback(index, 'quantity')(Number(e.target.value))}
                                                required
                                            />
                                        </div>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <TextInput
                                                id={`tracking_number_${index}`}
                                                label={t('tracking_number')}
                                                type={'text'}
                                                errors={errors}
                                                setErrors={setErrors}
                                                className={'md:basis-1/3 md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                disabled={!productInfo.country}
                                                value={productInfo.trackingNumber}
                                                onChange={(e) => updateProductInfoCallback(index, 'trackingNumber')(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <TextInput
                                        id={`link_${index}`}
                                        label={t('good_link')}
                                        type={'text'}
                                        errors={errors}
                                        setErrors={setErrors}
                                        disabled={!productInfo.country}
                                        value={productInfo.link}
                                        className={'md:basis-1/3 md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 invalid:border-red-500'}
                                        onChange={(e) => updateProductInfoCallback(index, 'link')(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={'flex flex-col gap-y-3 mt-7 md:gap-y-5'}>
                                <p className={'hidden md:block md:text-2xl'}>{t('declaration')}</p>
                                <h2 className={'text-xl md:hidden'}>{t('declaration')}</h2>
                                <div className={'flex flex-col gap-y-3 md:gap-y-5'}>
                                    <div className={'flex flex-col gap-y-3 md:flex-row md:gap-x-10'}>
                                        <div className={'md:basis-1/3'}>
                                            <TextInput
                                                id={`name_${index}`}
                                                type={'text'}
                                                label={t('good_name')}
                                                errors={errors}
                                                setErrors={setErrors}
                                                className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                value={productInfo.name}
                                                disabled={!productInfo.country}
                                                onChange={(e) => updateProductInfoCallback(index, 'name')(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <MoneyInput
                                            id={`price_${index}`}
                                            language={language}
                                            errors={errors}
                                            setErrors={setErrors}
                                            inputClassname={'md:basis-2/3 w-full p-3 md:p-4 placeholder-black rounded-l-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                            wrapperClassname={'md:basis-1/3 flex flex-row items-center md:w-full w-fit'}
                                            currencyWrapperClassname={'w-1/2 relative'}
                                            currencyInputClassname={'min-w-fit p-3 md:p-4 placeholder-black rounded-r-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 w-full'}
                                            currencyDropdownClassname={'mt-3 md:mt-5 md:max-h-60 w-full z-50 overflow-auto bg-white border md:mx-0 md:my-4 rounded-3xl border-black'}
                                            currencyItemClassname={'cursor-pointer w-full text-left p-3 md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                            label={t('price')}
                                            value={productInfo.price}
                                            onChange={updateProductInfoCallback(index, 'price')}
                                            disabled={!productInfo.country}
                                            required
                                        />
                                        <FileInput
                                            id={`invoice_${index}`}
                                            errors={errors}
                                            setErrors={setErrors}
                                            label={t('invoice')}
                                            disabled={!productInfo.country}
                                            file={productInfo.invoice}
                                            wrapperClassname={'md:basis-1/3'}
                                            onChange={updateProductInfoCallback(index, 'invoice')}
                                            inputClassname={'w-full p-3 md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                                        />
                                    </div>
                                    <TextInput
                                        id={`description_${index}`}
                                        errors={errors}
                                        setErrors={setErrors}
                                        type={'text'}
                                        label={t('description')}
                                        className={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                        value={productInfo.description}
                                        disabled={!productInfo.country}
                                        onChange={(e) => updateProductInfoCallback(index, 'description')(e.target.value)}
                                        required
                                    />
                                </div>
                                {currentCountry?.id === "f356c176-de9e-4479-909f-12b36900a314" ?
                                <CheckboxInput
                                    id={`original_box_${index}`}
                                    label={t('original_box_for_korea')}
                                    disabled={!productInfo.country}
                                    wrapperClassname={'flex items-center gap-x-3 cursor-pointer outline-none w-full'}
                                    checkboxClassname={'border-none w-6 h-6 outline-none'}
                                    checked={productInfo.originalBox}
                                    // onChange={e => updateProductInfoCallback(index, 'originalBox')(e.target.checked)}
                                    onChange={(e) => {
                                        // toast.success(t('checkbox_toast_message'));
                                        const isChecked = e.target.checked;                                
                                        isChecked
                                            ? toast.success(t('checkbox_toast_message'))
                                            : null;
                                        updateProductInfoCallback(index, 'originalBox')(isChecked);
                                    }}
                                />:null
                                }
                            </div>
                        </div>
                    )
                })
            }
            <div className={'flex flex-col gap-5 mt-5'}>
                <button className={'border border-blue text-blue w-full p-3 md:p-5 rounded-full'}
                        type={'button'}
                        onClick={() => {
                            updateFormData(draft => {
                                draft.goods.push(createDefaultProductInfo())
                            })
                        }}>
                    {t('add_product')}
                </button>
            </div>
            <div className={'flex flex-col gap-5'}>
                <p className={'hidden md:block md:text-2xl'}>{t('recipient')}</p>
                <div className={'w-full'}>
                    <DropdownInput<RecipientOverview>
                        id={'recipient'}
                        options={recipientOptions}
                        errors={errors}
                        setErrors={setErrors}
                        wrapperClassname={'w-[20rem] relative'}
                        inputClassname={'border border-black rounded-full w-full p-3 md:p-4 cursor-pointer disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                        dropdownClassname={'md:max-h-60 w-[calc(100vw-2.5rem)] z-50 overflow-auto bg-white border md:mx-0 my-3 md:w-full rounded-3xl border-black'}
                        dropdownItemClassname={'cursor-pointer p-3 w-full text-left md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                        errorsClassname={'absolute top-0 right-0 flex flex-row items-center h-full pr-10 text-[#EF4444]'}
                        label={t('recipient')}
                        selected={formData.recipient?.id}
                        setSelected={(option) => updateFormData(draft => {
                            draft.recipient = option?.value
                        })}
                        searchable={true} nullable={true}/>
                </div>
            </div>
            <button type={'submit'}
                    className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}>
                {t('create_order')}
            </button>
        </form>
    )
}