'use client'

import React, { useState, useEffect } from 'react';
import { EditOrderData, EditGoodData, RecipientOverview, CountryData, FileMetaData } from '@/types/entities';
import { OrderFormData } from '@/types/forms'
import TextInput from '@/app/components/input/TextInput';
import MoneyInput from '@/app/components/input/MoneyInput';
import FileInput from '@/app/components/input/FileInput';
import CheckboxInput from '@/app/components/input/CheckboxInput';
import { Option } from '@/app/components/input/DropdownInput/Dropdown';

import { updateOrder } from '@/services/orders';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getMyRecipients } from '@/services/account'
import { isError, notEmpty } from '@/app/lib/utils'
import { getCountries } from '@/services/countries';
import DropdownInput from '../../input/DropdownInput/DropdownInput';
import { getNameByLanguage } from '@/util';
import { uploadFile } from '@/services/files';
import { SuccessResponse } from '@/types';

type Props = {
    data: OrderFormData;
    language: string;
    orderId: string;
};

export default function UpdateOrderForm({ data, language, orderId }: Props) {
    const [formData, setFormData] = useState<OrderFormData>(data);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [recipients, setRecipients] = useState<RecipientOverview[]>([])
    const [countries, setCountries] = useState<CountryData[]>([]); // State to store countries

    useEffect(() => {
        getMyRecipients().then(response => {
            if (!isError(response)) {
                setRecipients(response.data)
            }
        }),
        getCountries().then(response => {
            if (!isError(response)) {
                setCountries(response.data);
            }
        });
    }, [language])

    const handleCountryChange = (index: number, countryId: string) => {
        const updatedGoods = [...formData.goods];
        const selectedCountry = countries.find(country => country.id === countryId);
        if (selectedCountry) {
            updatedGoods[index].country = selectedCountry;
            setFormData(prev => ({ ...prev, goods: updatedGoods }));
        } else {
            console.error('Selected country not found');
        }
    };
    const recipientOptions = recipients.map(recipient => {
        return {
            id: recipient.id,
            value: recipient,
            label: `${recipient.firstName} ${recipient.lastName}`,
            searchLabel: `${recipient.firstName} ${recipient.lastName}`,
        }
    })

    const countryOptions = countries?.map(country => {
        return {
            id: country.id,
            value: country,
            label: getNameByLanguage(country, language),
        }
    }) ?? []
    
    const handleRecipientChange = (option: Option<RecipientOverview> | undefined) => {
        const selectedRecipient = recipients.find(recipient => recipient.id === option?.id);
        if (selectedRecipient) {
            setFormData(prev => ({
                ...prev,
                recipient: {
                    ...prev.recipient, // Preserve other recipient data
                    id: selectedRecipient.id,
                    status: selectedRecipient.status,
                    firstName: selectedRecipient.firstName,
                    lastName: selectedRecipient.lastName,
                    patronymic: selectedRecipient.patronymic
                }
            }));
        } else {
            console.error('Recipient not found');
        }
    };
    
    

    const handleInputChange = (
        index: number,
        field: keyof EditGoodData,
        value: any
    ) => {
        const updatedGoods = [...formData.goods];
        updatedGoods[index] = { ...updatedGoods[index], [field]: value };
        setFormData(prev => ({ ...prev, goods: updatedGoods }));
    };
        
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

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

        try {
            const editOrderData: EditOrderData = {
                recipientId: formData.recipient?.id ?? '',
                goods: formData.goods.map((good, index): EditGoodData => ({
                    id: good.id,
                    name: good.name,
                    customOrderId: good.id,
                    description: good.description,
                    originalBox: good.originalBox,
                    currencyId: good.price!!.currency.id,
                    trackingNumber: good.trackingNumber,
                    invoiceUUID: (fileResults[index] as SuccessResponse<FileMetaData> | undefined)?.data.id,
                    quantity: 1,
                    price: good.price?.value,
                    link: good.link,
                    countryId: good.country?.id, 
                })),
            };
            console.info(editOrderData.goods, 'updatedGood:')
            await updateOrder(editOrderData, orderId);
            toast.success('Заказ был успешно обновлен');
            // router.push('/profile/orders'); 
        } catch (error) {
            toast.error('Ошибка при обновлении заказа');
            console.error("Error updating order:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-10 md:gap-y-10">
            {formData.goods.map((productInfo, index) => (
                
                <div className="flex flex-col md:gap-y-5" key={productInfo.id}>
                    
                    <div className="flex flex-col md:gap-y-5">
                        
                        <p className="hidden md:block md:text-2xl">Информация о товаре</p>
                        <div className="flex flex-col gap-y-3">
                            <div className="flex flex-col md:flex-row gap-y-3 md:gap-x-10 items-center">
                                <TextInput
                                    id="custom_order_id"
                                    label="ID заказа"
                                    type="text"
                                    value={productInfo.id}
                                    className="md:p-4 w-full p-3 placeholder-black rounded-full border border-black"
                                    required
                                    readOnly
                                    onChange={(e) => handleInputChange(index, 'customOrderId', e.target.value)}
                                />
                                <TextInput
                                    id="tracking_number"
                                    label="Номер трекинга"
                                    type="text"
                                    value={productInfo.trackingNumber}
                                    className="md:basis-1/4 md:p-4 w-full p-3 placeholder-black rounded-full border border-black" 
                                    onChange={(e) => handleInputChange(index, 'trackingNumber', e.target.value)}
                                />
                                <TextInput
                                    id="link"
                                    label="Ссылка на товар"
                                    type="text"
                                    value={productInfo.link}
                                    className="md:basis-1/4 md:p-4 w-full p-3 placeholder-black rounded-full border border-black"
                                    required
                                    onChange={(e) => handleInputChange(index, 'link', e.target.value)}
                                />
                                <div className="">
                                    <DropdownInput<CountryData>
                                        id={`country_${index}`}
                                        label="Выбрать страну"
                                        options={countryOptions}
                                        selected={productInfo.country?.id ?? ''}
                                        setSelected={(option: Option<CountryData> | undefined) => {
                                            if (option) {
                                                handleCountryChange(index, option.id);
                                            } 
                                        }}
                                        searchable
                                        nullable
                                        wrapperClassname={'w-full'}
                                        inputClassname={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-[25rem] p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                                        dropdownClassname={'w-[calc(100vw-2.5rem)] z-50 md:max-h-60 md:w-[25rem] overflow-auto bg-white border my-4 rounded-3xl border-solid border-black'}
                                        dropdownItemClassname={'cursor-pointer px-8 py-4 border-b-black border-b border-solid last:border-b-0 hover:bg-gray'}
                                    />
                                </div>
                                   
                                    


                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-3 mt-7 md:gap-y-5">
                        <p className="hidden md:block md:text-2xl">Декларация</p>
                        <h2 className="text-xl md:hidden">Декларация</h2>
                        <div className="flex flex-col gap-y-3 md:gap-y-5">
                            <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-10">
                                <TextInput
                                    id="name"
                                    type="text"
                                    label="Наименование"
                                    className="md:p-4 w-full p-3 placeholder-black rounded-full border border-black"
                                    value={productInfo.name}
                                    required
                                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                />
                                <MoneyInput
                                    id="price"
                                    language={language}
                                    inputClassname="md:basis-2/3 w-full p-3 md:p-4 placeholder-black rounded-l-full border border-black"
                                    wrapperClassname="md:basis-1/3 flex flex-row items-center w-full"
                                    currencyWrapperClassname="w-1/2 relative"
                                    currencyInputClassname="min-w-fit p-3 md:p-4 placeholder-black rounded-r-full border border-black"
                                    currencyDropdownClassname="mt-3 md:mt-5 md:max-h-60 w-full z-50 overflow-auto bg-white border md:mx-0 md:my-4 rounded-3xl border-black"
                                    currencyItemClassname="cursor-pointer w-full text-left p-3 md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0"
                                    label="Цена"
                                    value={productInfo.price}
                                    required
                                    onChange={(value) => handleInputChange(index, 'price', value)} 
                                />
                                <FileInput
                                    id="invoice"
                                    label="Загрузить новую накладную"
                                    file={productInfo.invoice}
                                    wrapperClassname="md:basis-1/3"
                                    inputClassname="w-full p-3 md:p-4 placeholder-black rounded-full border border-black"
                                    onChange={(file) => handleInputChange(index, 'invoice', file)}
                                
                                />
                            </div>
                            <TextInput
                                id="description"
                                type="text"
                                label="Описание товара"
                                className="md:p-4 w-full p-3 placeholder-black rounded-full border border-black"
                                value={productInfo.description}
                                required
                                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                            />
                        </div>
                        <CheckboxInput
                            label="Оставить оригинальную коробку товара"
                            checked={productInfo.originalBox}
                            wrapperClassname="flex items-center gap-x-3 cursor-pointer outline-none w-fit"
                            checkboxClassname="border-none w-6 h-6 outline-none"
                            onChange={(e) => handleInputChange(index, 'originalBox', e.target.checked)}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="recipient" className="font-medium text-lg mb-1">Получатель</label>
                        <DropdownInput<RecipientOverview>
                            id={`recipient_${index}`}
                            label={formData.recipient?.firstName + ' ' + formData.recipient?.lastName}
                            options={recipientOptions}
                            nullable={false} searchable={true}
                            selected={formData.recipient?.id ?? ''}
                            setSelected={handleRecipientChange}
                            wrapperClassname={'w-full relative'}
                            inputClassname={'border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-full p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0'}
                            dropdownClassname={'w-[calc(100vw-2.5rem)] z-50 md:max-h-60 md:w-full overflow-auto bg-white border my-4 rounded-3xl border-solid border-black'}
                            dropdownItemClassname={'cursor-pointer px-8 py-4 border-b-black border-b border-solid last:border-b-0 hover:bg-gray'} 
                        />
                    </div>
                </div>
            ))}
            
            <button type="submit" className="self-end p-3 bg-qp-blue text-white rounded-full" disabled={loading}>
                {loading ? 'Loading...' : 'Изменить'}
            </button>
        </form>
    );
}
