'use client'

import React from 'react';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons'; 
import { useTranslation } from "@/app/i18n/client";

type ClickableElementProps = {
    text: string;
    params: {
        language: string,
    }
};

const ClickableElement: React.FC<ClickableElementProps> = ({ text, params: { language }}) => {
    const { t } = useTranslation(language, 'profile')

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(t('copied') + ': ' + text);
            console.log('Text copied to clipboard:', text)
        } catch (error) {
            console.error('Failed to copy text to clipboard:', error)
        }
    }

    // Split the text into label and value parts
    const [label, value] = text.split(':~');

    return (
        <div className={'flex flex-row items-center justify-between w-full'}>
            <span>{label}:</span>
            {value && (
                <div className={'flex items-center'}>
                    <span>{value}</span>
                    <button
                        onClick={() => { copyToClipboard(value) }}
                        className={'ml-4'}
                    >
                        <FontAwesomeIcon icon={faCopy} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClickableElement;
