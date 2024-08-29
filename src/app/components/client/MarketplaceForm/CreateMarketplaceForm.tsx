import React, { useState } from 'react';
import { createMarketplace } from '@/services/marketplaces';
import { toast } from 'react-toastify';
import { isError, isSuccess } from '@/app/lib/utils';
import { useRouter } from 'next/navigation';
import { t } from 'i18next';
import { MarketplaceData } from '@/types/entities';

type Props = { 
    language: string;
};

export default function CreateMarketplaceForm({ language }: Props) {
    const [marketplace, setMarketplace] = useState<MarketplaceData>({
        brand: '',
        category: '',
        description: '',
        description_en: '',
        description_kz: '',
        description_zh: '',
        country: '',
        country_en: '',
        country_kz: '',
        country_zh: '',
        link: '',
        photo_link: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMarketplace(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(t('edit_profile.save'));

        try {
            await createMarketplace(marketplace);
            toast.update(toastId, {
                render: 'Маркетплейс успешно сохранена',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });
            router.push('/marketplaces');
        } catch (error) {
            toast.update(toastId, {
                render: 'Ошибка при создании маркетплейса',
                type: 'error',
                isLoading: false,
                autoClose: 2000,
            });
            console.error("Error creating marketplace:", error);
        }
        console.log("Creating new marketplace:", marketplace);
    };

    return (
        <div className="wrapper p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label htmlFor="brand" className="font-medium text-gray-700 mb-2">Бренд</label>
                    <input 
                        id="brand" 
                        name="brand" 
                        type="text" 
                        value={marketplace.brand} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="category" className="font-medium text-gray-700 mb-2">Категория</label>
                    <input 
                        id="category" 
                        name="category" 
                        type="text" 
                        value={marketplace.category} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description" className="font-medium text-gray-700 mb-2">Описание маркетплейса (RU)</label>
                    <textarea 
                        id="description" 
                        name="description" 
                        value={marketplace.description} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description_kz" className="font-medium text-gray-700 mb-2">Описание маркетплейса (KZ)</label>
                    <textarea 
                        id="description_kz" 
                        name="description_kz" 
                        value={marketplace.description_kz} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description_en" className="font-medium text-gray-700 mb-2">Описание маркетплейса (EN)</label>
                    <textarea 
                        id="description_en" 
                        name="description_en" 
                        value={marketplace.description_en} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description_zh" className="font-medium text-gray-700 mb-2">Описание маркетплейса (ZH)</label>
                    <textarea 
                        id="description_zh" 
                        name="description_zh" 
                        value={marketplace.description_zh} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>    
                    <div className="flex flex-col">
                        <label htmlFor="country" className="font-medium text-gray-700 mb-2">Страна (RU)</label>
                        <input 
                            id="country" 
                            name="country" 
                            type="text" 
                            value={marketplace.country} 
                            onChange={handleChange} 
                            className="border border-gray-300 rounded-lg p-2"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="country_kz" className="font-medium text-gray-700 mb-2">Страна (KZ)</label>
                        <input 
                            id="country_kz" 
                            name="country_kz" 
                            type="text" 
                            value={marketplace.country_kz} 
                            onChange={handleChange} 
                            className="border border-gray-300 rounded-lg p-2"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="country_en" className="font-medium text-gray-700 mb-2">Страна (EN)</label>
                        <input 
                            id="country_en" 
                            name="country_en" 
                            type="text" 
                            value={marketplace.country_en} 
                            onChange={handleChange} 
                            className="border border-gray-300 rounded-lg p-2"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="country_zh" className="font-medium text-gray-700 mb-2">Страна (ZH)</label>
                        <input 
                            id="country_zh" 
                            name="country_zh" 
                            type="text" 
                            value={marketplace.country_zh} 
                            onChange={handleChange} 
                            className="border border-gray-300 rounded-lg p-2"
                            required
                        />
                    </div>
                <div className="flex flex-col">
                    <label htmlFor="link" className="font-medium text-gray-700 mb-2">Ссылка на сайт</label>
                    <input 
                        id="link" 
                        name="link" 
                        type="url" 
                        value={marketplace.link} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="photo_link" className="font-medium text-gray-700 mb-2">Ссылки на фото</label>
                    <input 
                        id="photo_link" 
                        name="photo_link" 
                        type="text" 
                        value={marketplace.photo_link} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600">
                    Добавить
                </button>
            </form>
        </div>
    );
}
