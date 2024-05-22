'use client'

import React, { useState, useEffect } from 'react';
import { EditOrderData, EditGoodData, RecipientOverview, CountryData } from '@/types/entities';
import { OrderFormData } from '@/types/forms'
import TextInput from '@/app/components/input/TextInput';
import MoneyInput from '@/app/components/input/MoneyInput';
import FileInput from '@/app/components/input/FileInput';
import CheckboxInput from '@/app/components/input/CheckboxInput';

import { updateOrder } from '@/services/orders';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getRecipients } from '@/services/account'
import { isError } from '@/app/lib/utils'
import { getCountries } from '@/services/countries';

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
        getRecipients().then(response => {
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
    
    
    const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const recipientId = e.target.value;
        const selectedRecipient = recipients.find(recipient => recipient.id === recipientId);
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
            console.info(formData.recipient?.id, "test")
        } else {
            console.error('Recipient not found')
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

        try {
            const editOrderData: EditOrderData = {
                recipientId: formData.recipient?.id ?? '',
                goods: formData.goods.map((good): EditGoodData => ({
                    id: good.id,
                    name: good.name,
                    customOrderId: good.customOrderId ?? '',
                    description: good.description,
                    originalBox: good.originalBox,
                    currencyId: good.price!!.currency.id,
                    quantity: 1,
                    price: good.price?.value,
                    link: good.link,
                    countryId: good.country?.id, 
                })),
            };
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
                                    readOnly 
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
                                    <select
                                        id={`country_${index}`}
                                        name={`country_${index}`}
                                        value={productInfo.country?.id}
                                        onChange={(e) => handleCountryChange(index, e.target.value)}
                                        className="md:basis-1/4 md:p-4 w-full p-3 placeholder-black rounded-full border border-black"
                                        required
                                    >
                                        <option value="">Выбрать страну</option>
                                        {countries.map(country => (
                                            <option key={country.id} value={country.id}>{country.nameRus}</option>
                                        ))}
                                    </select>


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
                                    label="Накладная"
                                    file={productInfo.invoice}
                                    wrapperClassname="md:basis-1/3"
                                    readOnly
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
                            onChange={(e) => handleInputChange(index, 'originalBox', e)}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="recipient" className="font-medium text-lg mb-1">Получатель</label>
                        <select
                            id={`recipient_${index}`}
                            name={`recipient_${index}`}
                            value={formData.recipient?.id}
                            onChange={handleRecipientChange}
                            className="border cursor-pointer flex items-center justify-between w-full md:text-[0.9rem] md:w-full p-4 rounded-full border-black disabled:bg-gray disabled:text-[#cccccc] disabled:cursor-not-allowed disabled:border-0"
                            required
                        >
                            <option value="">Выбрать получателя</option>
                            {recipients.map(recipient => (
                                <option key={recipient.id} value={recipient.id}>
                                    {recipient.firstName} {recipient.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            
            <button type="submit" className="self-end p-3 bg-blue-500 text-white rounded-full" disabled={loading}>
                {loading ? 'Loading...' : 'Изменить'}
            </button>
        </form>
    );
}
