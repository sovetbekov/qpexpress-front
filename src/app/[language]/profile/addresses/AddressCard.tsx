'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-hot-toast';
import ClickableElement from './ClickableElement';
import { AddressData } from '@/types/entities';
import { useTranslation } from "@/app/i18n/client";

type AddressCardProps = {
    address: AddressData;
    language: string;
};

const AddressCard: React.FC<AddressCardProps> = ({ address, language }) => {
    const { t } = useTranslation(language, 'profile')

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t('copied')+ ": " + text);
            console.log('Text copied to clipboard:', text);
        } catch (error) {
            console.error('Failed to copy text to clipboard:', error);
        }
    };

    const handleCountryClick = () => {
        const fields: (keyof AddressData)[] = ['city', 'district', 'neighborhood', 'street', 'house', 'postcode'];
        const parsedValues = fields
            .map(field => address[field]?.split('~')[1])
            .filter(Boolean)
            .join(',');

        copyToClipboard(parsedValues);
    };

    return (
        <div className={'w-full p-5 md:p-10 bg-gray rounded-3xl md:w-[calc(50%-1em)]'} key={address.id}>
            <div className={'flex items-center'}>
                <h2 className={'text-xl cursor-pointer'} onClick={handleCountryClick}>
                    {address.country}
                </h2>
                <button onClick={handleCountryClick} className={'ml-2'}>
                    <FontAwesomeIcon icon={faCopy} />
                </button>
            </div>
            <br className={'h-2.5'} />
            <div className={'flex flex-col gap-y-2'}>
                {address.city && (
                    <ClickableElement text={address.city} params={{ language }} />
                )}
                {address.district && (
                    <ClickableElement text={address.district} params={{ language }} />
                )}
                {address.neighborhood && (
                    <ClickableElement text={address.neighborhood} params={{ language }} />
                )}
                {address.street && (
                    <ClickableElement text={address.street} params={{ language }} />
                )}
                {address.house && (
                    <ClickableElement text={address.house} params={{ language }} />
                )}
                {address.postcode && (
                    <ClickableElement text={address.postcode} params={{ language }} />
                )}
            </div>
        </div>
    );
};

export default AddressCard;
