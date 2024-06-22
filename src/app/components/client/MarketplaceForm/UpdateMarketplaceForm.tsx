import React, { useState, useEffect } from 'react';
import { MarketplaceDataOverview } from '@/types';
import { updateMarketplace, deleteMarketplaceById } from '@/services/marketplaces';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { t } from 'i18next';

type Props = {
    language: string;
    data: MarketplaceDataOverview; 
};

export default function UpdateMarketplaceForm({ language, data }: Props) { 
    const [marketplace, setMarketplace] = useState<MarketplaceDataOverview>(data);

    useEffect(() => {
        // Update state when data prop changes
        setMarketplace(data);
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMarketplace(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleDelete = async () => {
        const confirmation = window.confirm('Вы уверены, что хотите удалить маркетплейс?');
        if (confirmation) {
            try {
                await deleteMarketplaceById(marketplace.id);
                toast.success('Маркетплейс успешно удален');
                router.push('/marketplaces');
            } catch (error) {
                toast.error('Ошибка при удалении маркетплейса');
                console.error('Error deleting marketplace:', error);
            }
        }
    };

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const toastId = toast.loading(t('edit_profile.save'));

        try {
            const response = await updateMarketplace(marketplace.id, marketplace);
            if (response) {
                toast.update(toastId, {
                    render: 'Маркетплейс успешно обновлена',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
                router.push('/marketplaces');
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            toast.update(toastId, {
                render: 'Ошибка при обновлении маркетплейса',
                type: 'error',
                isLoading: false,
                autoClose: 2000,
            });
            console.error("Error updating marketplace:", error);
        }
        console.log("Updating marketplace:", marketplace);
    };

    return (
        <div className="wrapper p-6">
            <h2 className="text-2xl font-bold mb-6">Обновить данные</h2>
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
                    <label htmlFor="description" className="font-medium text-gray-700 mb-2">Описание маркетплейса</label>
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
                    <label htmlFor="country" className="font-medium text-gray-700 mb-2">Страна</label>
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
                    <label htmlFor="photo" className="font-medium text-gray-700 mb-2">Ссылки на фото</label>
                    <input 
                        id="photo" 
                        name="photo_link" 
                        type="text" 
                        value={marketplace.photo_link} 
                        onChange={handleChange} 
                        className="border border-gray-300 rounded-lg p-2"   
                        required  
                    />
                </div>
                    <button type="submit" className="bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600">
                        Изменить
                    </button>
                    <button type="button" onClick={handleDelete} className="bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-600">
                        Удалить
                    </button>
                
            </form>
        </div>
    );
}
