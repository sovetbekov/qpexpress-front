'use client'

import React from 'react';
import { toast } from 'react-hot-toast';
import { t } from 'i18next';
import {useTranslation} from "@/app/i18n/client";


type ClickableElementProps = {
    text: string;
    params: {
        language: string,
    }
};

const ClickableElement: React.FC<ClickableElementProps> = ({ text, params: {language}}) => {
    const {t} = useTranslation(language, 'profile')

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(t('copied') + ': ' + text); 
            console.log('Text copied to clipboard:', text)
        } catch (error) {
            console.error('Failed to copy text to clipboard:', error)
        }
    }
    
    return (
        <div className={'flex flex-row justify-between w-full'} >
            {text.split('~').map((textItem, index) => (
                <button onClick={
                    () => {copyToClipboard(textItem)}
                }>{textItem}</button>

            ))}
        </div>
    );
};

export default ClickableElement;
