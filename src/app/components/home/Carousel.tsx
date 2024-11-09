/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React, { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Link from 'next/link';
import { useTranslation } from '@/app/i18n'
import { getMarketplaces } from '@/services/marketplaces';
import { MarketplaceDataOverview } from '@/types/entities';

type Props = {
    language: string,
}

export default function Carousel({language}: Readonly<Props>) {
    const [translation, setTranslation] = useState({ title: 'Loading...', button: 'Loading...' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTranslation = async () => {
            const { t } = await useTranslation(language, 'carousel');
            setTranslation({ title: t('title'), button: t('buttonlook') });
            setLoading(false);
        };
        loadTranslation();
    }, [language]);

    const slides = [
        { url: "https://getlogovector.com/wp-content/uploads/2020/11/coupang-logo-vector.png" },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Tom-tailor.svg/2560px-Tom-tailor.svg.png" },
        { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW1GFDdHC4P9Lm_CN1nzmvjQPcUsMF9e0o0g&s" },
        { url: "https://logos-world.net/wp-content/uploads/2023/01/Zalando-Logo.png" },
        { url: "https://cdn.theorg.com/b21aa54a-1941-4df9-9815-361ad6ceb5e7_thumb.jpg" },
        { url: "https://www.logo.wine/a/logo/Massimo_Dutti/Massimo_Dutti-Logo.wine.svg" },
        { url: "https://logolook.net/wp-content/uploads/2023/03/Uniqlo-Logo.png" },
        { url: "https://1000logos.net/wp-content/uploads/2021/04/U.S.-Polo-Assn-logo-768x432.png" },
        { url: "https://download.logo.wine/logo/Zara_Home/Zara_Home-Logo.wine.png" },
        { url: "https://fashionunited.com/img/upload/2023/01/13/cos-logo-eqkw9vdkpkumjcczi-k9da2chm-2023-01-13.jpeg" },
        { url: "https://logolook.net/wp-content/uploads/2023/03/Uniqlo-Logo.png" },
    ];

    const [marketplaces, setMarketplaces] = useState<MarketplaceDataOverview[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentInd, setCurrentInd] = useState(0);
    const totalSlides = slides.length;
    const slidesPerView = 4; 

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

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(interval); 
    }, []);

    const prevSlide = () => {
        setCurrentInd((prevInd) => 
            (prevInd === 0 ? totalSlides - slidesPerView : prevInd - slidesPerView) % totalSlides
        );
    };

    const nextSlide = () => {
        setCurrentInd((prevInd) => 
            (prevInd + slidesPerView) % totalSlides
        );
    };

    return (
        <div className="carousel-container relative p-4 md:p-8">
            {!loading ? ( 
                <>
                    <div className="flex justify-center">
                        <h1 className="text-[24px] md:text-[39px] text-center">{translation.title}</h1>
                    </div>
                    <div className="relative max-w-full md:max-w-[1200px] h-[150px] md:h-[200px] w-full m-auto flex items-center justify-center overflow-hidden">
                        <div 
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer z-10 bg-[#fff] drop-shadow-lg p-1 rounded-full "
                            onClick={prevSlide}
                        >
                            <FaAngleLeft size={24} className="text-[#B1B0B0] md:text-[30px]" />
                        </div>
                        <div 
                            className="flex transition-transform duration-500 ease-in-out" 
                            style={{ transform: `translateX(-${(currentInd * 100) / slidesPerView}%)` }}
                        >
                            {marketplaces.map((slide, index) => (
                                <div key={index} className="w-1/2 md:w-1/4 flex-shrink-0 flex justify-center items-center">
                                    <img src={slide.photo_link} alt={`Slide ${index + 1}`} className="w-[100px] md:w-[200px] h-auto object-contain" />
                                </div>
                            ))}
                        </div>
                        <div 
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer z-10 bg-[#fff] drop-shadow-lg p-1 rounded-full"
                            onClick={nextSlide}
                        >
                            <FaAngleRight size={24} className="text-[#B1B0B0] md:text-[30px]" />
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 ">
                        <Link href={'/marketplaces'}>
                            <button className="border-[#FF9408] border-[1px] px-[12px] md:px-[20px] py-[5px] rounded-[5px] 
                            text-[#FF9408] hover:bg-[#FF9408] hover:text-white">{translation.button}</button>
                        </Link>
                    </div>
                </>
            ) : (
                <p className="text-center">Loading carousel...</p> 
            )}
        </div>
    );
};


