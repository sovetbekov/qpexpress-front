'use client'

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from "@/app/i18n/client";
import styles from '@/styles/custom.module.css'; // Import custom CSS module
import { getMarketplaces } from '@/services/marketplaces';
import { MarketplaceDataOverview } from '@/types/entities';
import CheckboxInput from '@/app/components/input/CheckboxInput'; // Import CheckboxInput component

export const dynamic = 'force-dynamic';

type Props = {
    params: {
        language: string;
    }
}

export default function Page({ params: { language } }: Readonly<Props>) {
    const { t } = useTranslation(language, 'order');
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [marketplaces, setMarketplaces] = useState<MarketplaceDataOverview[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMarketplaces = async () => {
            try {
                const response = await getMarketplaces();
                if ('data' in response) {
                    setMarketplaces(response.data);
                } else {
                    setError(response.status);
                }
            } catch (err) {
                setError('Failed to fetch marketplaces');
            } finally {
                setLoading(false);
            }
        };

        fetchMarketplaces();
    }, []);

    const handleCountryChange = (country: string) => {
        setSelectedCountries(prev =>
            prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
        );
    };

    const filteredData = useMemo(() => {
        return selectedCountries.length === 0 ? marketplaces : marketplaces.filter(m => selectedCountries.includes(m.country));
    }, [selectedCountries, marketplaces]);

    if (loading) {
        return <div className="text-center py-4">Loading...</div>; // Improved loading message
    }

    return (
        <div className="wrapper p-6 md:p-10">
            <div className="title text-3xl font-bold mb-8">
                Маркетплейсы
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="mb-4 md:mb-0 md:w-1/4 lg:w-1/5">
                    <h3 className="mb-4 font-medium text-xl text-gray-900">Страны</h3>
                    <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                        {Array.from(new Set(marketplaces.map(m => m.country))).map((country, index) => (
                            <li key={index} className="w-full border-b border-gray-200 last:border-b-0 rounded-t-lg">
                                <div className="flex items-center ps-3">
                                    <CheckboxInput
                                        id={`checkbox-${country}`}
                                        label={country}
                                        checked={selectedCountries.includes(country)}
                                        onChange={() => handleCountryChange(country)}
                                        wrapperClassname="flex items-center"
                                        labelClassname="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                                        checkboxClassname="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1">
                    <div className="flex flex-wrap">
                        {filteredData.map((marketplace, index) => (
                            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                                <div className={`${styles.shadow} h-auto p-6 rounded-lg flex flex-col gap-5 items-center justify-center`}>
                                    <div className={styles.imageContainer}>
                                        <img src={marketplace.photo_link} alt={marketplace.brand} className="w-full h-auto object-cover" />
                                    </div>
                                    <p className="brand text-2xl font-semibold text-center">
                                        {marketplace.brand}
                                    </p>
                                    <p className="description text-base text-center" style={{ maxWidth: '100%' }}>
                                        {marketplace.description}
                                    </p>
                                    <a href={marketplace.link} className={`${styles.button} text-base font-medium mt-auto`} aria-label={`Visit ${marketplace.brand} website`}>
                                        Перейти
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {error && <div className="error text-red-500 mt-4 text-center">{error}</div>}
        </div>
    );
}
