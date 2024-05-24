'use client'

import React, { useState } from 'react';
import { Errors, FileMetaData, RecipientData } from '@/types';
import { toast } from 'react-toastify';
import { createRecipient, updateRecipient } from '@/services/account';
import Image from 'next/image';
import FileInput from '@/app/components/input/FileInput';
import { useTranslation } from '@/app/i18n/client';
import { isSuccess } from '@/app/lib/utils';
import TextInput from '@/app/components/input/TextInput';
import MaskInput from '@/app/components/input/MaskInput';
import { NumberFormatValues } from 'react-number-format';

type RecipientFormData = {
    id?: string,
    firstName: string,
    lastName: string,
    patronymic: string,
    iin: string,
    documentSideA?: File | FileMetaData,
    documentSideB?: File | FileMetaData,
    district: string,
    phoneNumber: string,
    address: string,
};

type Props = {
    initialFormData?: RecipientData[],
    language: string,
};

export default function RecipientInfoForm({ initialFormData, language }: Readonly<Props>) {
    const { t } = useTranslation(language, 'profile');
    const [errors, setErrors] = useState<Errors>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const [recipients, setRecipients] = useState<RecipientFormData[]>(initialFormData ?? []);
    const [currentRecipientIndex, setCurrentRecipientIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<RecipientFormData>({
        id: '',
        firstName: '',
        lastName: '',
        patronymic: '',
        iin: '',
        documentSideA: undefined,
        documentSideB: undefined,
        district: '',
        phoneNumber: '',
        address: '',
    });

    function handleValueChange(values: NumberFormatValues, field: keyof RecipientFormData) {
        setFormData({
            ...formData,
            [field]: values.value // or values.formattedValue depending on what you need
        });
    }

    async function saveRecipient() {
        // Capture the form data before saving the recipient
        const formDataCopy = { ...formData };
    
        // Check if any required fields are empty
        if (!formDataCopy.iin || !formDataCopy.phoneNumber) {
            toast.error(t('edit_profile.required_fields'));
            return;
        }
    
        // Create a new FormData object to send with the request
        const data = new FormData();
        data.append('firstName', formDataCopy.firstName);
        data.append('lastName', formDataCopy.lastName);
        data.append('patronymic', formDataCopy.patronymic);
        data.append('iin', formDataCopy.iin);
        data.append('district', formDataCopy.district);
        data.append('phoneNumber', formDataCopy.phoneNumber);
        data.append('address', formDataCopy.address);

        console.log(formData.documentSideA, "saveRecipient")

        if (formData.documentSideA) {
            if (formData.documentSideA instanceof Blob) {
                data.append('documentSideA', formData.documentSideA)
            } else {
                data.append('documentSideAId', formData.documentSideA.id)
            }
        }
        if (formData.documentSideB) {
            if (formData.documentSideB instanceof Blob) {
                data.append('documentSideB', formData.documentSideB)
            } else {
                data.append('documentSideBId', formData.documentSideB.id)
            }
        }

        try {
            // Make the API request to save the recipient
            const response = currentRecipientIndex !== null && recipients[currentRecipientIndex].id
                ? await updateRecipient(recipients[currentRecipientIndex].id!, data, language)
                : await createRecipient(data, language);
    
            // Check if the request was successful
            if (isSuccess(response)) {
                // Display success message and update recipients state
                toast.success(t('edit_profile.saved_recipient'));
                setIsEditing(false);
                setIsCreating(false);
                if (currentRecipientIndex !== null) {
                    setRecipients(prevRecipients => {
                        const updatedRecipients = [...prevRecipients];
                        updatedRecipients[currentRecipientIndex] = response.data;
                        return updatedRecipients;
                    });
                } else {
                    setRecipients(prevRecipients => [...prevRecipients, response.data]);
                }
                window.location.reload();
            } else {
                throw response.error;
            }
        } catch (e) {
            // Display error message if the request fails
            setErrors(e as Errors);
            toast.error(t('edit_profile.error_saving_recipient'));
        }
    }
    
    function handleEdit(index: number) {
        setFormData(recipients[index]);
        setCurrentRecipientIndex(index);
        setIsEditing(true);
    }

    
    function addRecipient() {
        // Create a new recipient object with empty values
        const newRecipient: RecipientFormData = {
            id: '',
            firstName: formData.firstName,
            lastName: formData.lastName,
            patronymic: formData.patronymic,
            iin: formData.iin,
            documentSideA: formData.documentSideA,
            documentSideB: formData.documentSideB,
            district: formData.district,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
        };
    
        // Update the recipients state to include the new recipient
        setRecipients(prevRecipients => [...prevRecipients, newRecipient]);
    
        setCurrentRecipientIndex(null);
        setIsCreating(true);
    }
    
    
    function setEditMode() {
        setIsEditing(true);
    }
    function offEditMode() {
        setIsEditing(false);
    }

    return (
        <form className={'flex flex-col gap-y-4 md:gap-y-10'} onSubmit={(e) => {
            e.preventDefault();
            saveRecipient();
        }}>
            <p className={'md:text-2xl'}>
                {t('edit_profile.recipients')}
            </p>
            {
                recipients.length === 0 && (
                    <p className={'md:text-base'}>
                        {t('edit_profile.no_recipients')}
                    </p>
                )
            }
            {
                recipients.map((recipient, index) => (
                    (!isCreating || index === recipients.length - 1) && (<div key={index} className={'flex flex-col gap-y-4 md:flex-row md:gap-y-5 md:gap-x-6 md:flex-wrap'}>                        
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                            <TextInput
                                id={`first_name_${index}`}
                                name={`first_name_${index}`}
                                type={'text'}
                                className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipient.firstName}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setRecipients(prevState => {
                                        const updatedRecipients = [...prevState];
                                        updatedRecipients[index].firstName = value;
                                        return updatedRecipients;
                                    });
                                    setFormData(prevFormData => ({ ...prevFormData, firstName: value }));
                                }}
                                errors={errors}
                                setErrors={setErrors}
                                label={t('edit_profile.first_name')}
                                readOnly={!isEditing && !isCreating}
                                required
                            />
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                            <TextInput
                                id={`last_name_${index}`}
                                name={`last_name_${index}`}
                                type={'text'}
                                className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipient.lastName}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setRecipients(prevState => {
                                        const updatedRecipients = [...prevState];
                                        updatedRecipients[index].lastName = value;
                                        return updatedRecipients;
                                    });
                                    setFormData(prevFormData => ({ ...prevFormData, lastName: value }));
                                }}
                                errors={errors}
                                setErrors={setErrors}
                                label={t('edit_profile.last_name')}
                                readOnly={!isEditing && !isCreating}
                                required
                            />
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                            <TextInput
                                id={`patronymic_${index}`}
                                name={`patronymic_${index}`}
                                type={'text'}
                                className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipient.patronymic}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setRecipients(prevState => {
                                        const updatedRecipients = [...prevState];
                                        updatedRecipients[index].patronymic = value;
                                        return updatedRecipients;
                                    });
                                    setFormData(prevFormData => ({ ...prevFormData, patronymic: value }));
                                }}
                                errors={errors}
                                setErrors={setErrors}
                                label={t('edit_profile.patronymic')}
                                readOnly={!isEditing && !isCreating}
                            />
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                            <MaskInput
                                id={`iin_${index}`}
                                name={`iin_${index}`}
                                format={'### ### ### ###'}
                                mask={'_'}
                                className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipient.iin}
                                onValueChange={(value) => {
                                    const formattedValue = value.value;
                                    setRecipients(prevState => {
                                        const updatedRecipients = [...prevState];
                                        updatedRecipients[index].iin = formattedValue;
                                        return updatedRecipients;
                                    });
                                    setFormData(prevFormData => ({ ...prevFormData, iin: formattedValue }));
                                }}
                                errors={errors}
                                setErrors={setErrors}
                                label={t('edit_profile.iin')}
                                readOnly={!isEditing && !isCreating}
                                required
                            />
                        </div>
                        <FileInput
                            id={`document_side_a_${index}`}
                            name={`document_side_a_${index}`}
                            label={t('edit_profile.side_a')}
                            wrapperClassname={'md:w-[calc(50%-0.75rem)] w-full'}
                            inputClassname={'w-full md:p-5 p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                            onChange={(file) => {
                                console.log('Selected file:', file);
                                if (isEditing && index === currentRecipientIndex) {
                                    console.log('Editing mode: Updating form data directly');
                                    setFormData(prevFormData => ({
                                        ...prevFormData,
                                        documentSideA: file,
                                    }));
                                } else if (isCreating) {
                                    console.log('Create mode: Updating form data directly');
                                    setFormData(prevFormData => ({
                                        ...prevFormData,
                                        documentSideA: file,
                                    }));
                                } else {
                                    console.log('Not editing mode: Updating recipients state');
                                    setRecipients(prevRecipients => {
                                        const updatedRecipients = [...prevRecipients];
                                        updatedRecipients[index].documentSideA = file;
                                        return updatedRecipients;
                                    });
                                }
                            }}
                            file={isEditing && index === currentRecipientIndex ? formData.documentSideA : (isCreating ? formData.documentSideA : recipient.documentSideA)}
                            fileTypes={['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']}
                            readOnly={!isEditing && !isCreating}
                            required
                        />
                        <FileInput
                            id={`document_side_b_${index}`}
                            name={`document_side_b_${index}`}
                            label={t('edit_profile.side_b')}
                            wrapperClassname={'md:w-[calc(50%-0.75rem)] w-full'}
                            inputClassname={'w-full md:p-5 p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                            onChange={(file) => {
                                if (isEditing && index === currentRecipientIndex) {
                                    setFormData(prevFormData => ({
                                        ...prevFormData,
                                        documentSideB: file, // Update documentSideB in formData directly
                                    }));
                                } else if (isCreating) {
                                    setFormData(prevFormData => ({
                                        ...prevFormData,
                                        documentSideB: file,
                                    }));
                                } else {
                                    setRecipients(prevRecipients => {
                                        const updatedRecipients = [...prevRecipients];
                                        updatedRecipients[index].documentSideB = file;
                                        return updatedRecipients;
                                    });
                                }
                            }}
                            file={isEditing && index === currentRecipientIndex ? formData.documentSideB : (isCreating ? formData.documentSideB : recipient.documentSideB)}
                            fileTypes={['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']}
                            readOnly={!isEditing && !isCreating}
                            errors={errors}
                            setErrors={setErrors}
                            required
                        />


                        <div className={'w-full'}>
                            <p className={'md:w-1/2 text-base px-5 md:p-0'}>
                                {t('edit_profile.document_instruction')}
                            </p>
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                            <TextInput
                                id={`district_${index}`}
                                name={`district_${index}`}
                                type={'text'}
                                className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipient.district}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setRecipients(prevState => {
                                        const updatedRecipients = [...prevState];
                                        updatedRecipients[index].district = value;
                                        return updatedRecipients;
                                    });
                                    setFormData(prevFormData => ({ ...prevFormData, district: value }));
                                }}
                                label={t('edit_profile.district')}
                                errors={errors}
                                setErrors={setErrors}
                                readOnly={!isEditing && !isCreating}
                                required
                            />
                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                        
                            <MaskInput
                                id={`phone_number_${index}`}
                                name={`phone_number_${index}`}
                                format={'+7 (###) ###-##-##'}
                                className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipient.phoneNumber}
                                onValueChange={(value) => {
                                    const formattedValue = value.value;
                                    setRecipients(prevState => {
                                        const updatedRecipients = [...prevState];
                                        updatedRecipients[index].phoneNumber = formattedValue;
                                        return updatedRecipients;
                                    });
                                    setFormData(prevFormData => ({ ...prevFormData, phoneNumber: formattedValue }));
                                }}
                                mask="_"
                                label={t('edit_profile.phone_number')}
                                readOnly={!isEditing && !isCreating}
                                errors={errors}
                                setErrors={setErrors}
                                required
                                allowEmptyFormatting
                            />



                        </div>
                        <div className={'md:w-[calc(50%-0.75rem)]'}>
                           <TextInput
                                id={`address_${index}`}
                                name={`address_${index}`}
                                type={'text'}
                                className={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                                value={recipient.address}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setRecipients(prevState => {
                                        const updatedRecipients = [...prevState];
                                        updatedRecipients[index].address = value;
                                        return updatedRecipients;
                                    });
                                    setFormData(prevFormData => ({ ...prevFormData, address: value }));
                                }}
                                label={t('edit_profile.address')}
                                errors={errors}
                                setErrors={setErrors}
                                readOnly={!isEditing && !isCreating}
                                required
                            />
                        </div>
                        {
                            isEditing && (
                                <div className={'md:w-[calc(50%-0.75rem)]'}>
                                    <button
                                        className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}
                                        onClick={() => handleEdit(index)}>
                                        {t('edit_profile.change')}
                                    </button>
                                </div>
                            )
                        }
                        {
                            !isEditing && (
                                <div className={'md:w-[calc(50%-0.75rem)] mt-4'}>
                                    {
                                        initialFormData && initialFormData[index]?.status === 'PENDING' && (
                                            <p className={'text-base flex flex-row gap-x-2'}>
                                                <Image src={'/assets/progressing_receiver.svg'} alt={'progress'} width={25}
                                                    height={25}/>{t('edit_profile.pending_recipient')}
                                            </p>
                                        )
                                    }
                                    {
                                        initialFormData && initialFormData[index]?.status === 'ACTIVE' && (
                                            <p className={'text-base flex flex-row gap-x-2'}>
                                                <Image src={'/assets/approved_receiver.svg'} alt={'progress'} width={25}
                                                    height={25}/>{t('edit_profile.approved_recipient')}
                                            </p>
                                        )
                                    }
                                    {
                                        initialFormData && initialFormData[index]?.status === 'INACTIVE' && (
                                            <p className={'text-base flex flex-row gap-x-2'}>
                                                <Image src={'/assets/rejected_receiver.svg'} alt={'progress'} width={25}
                                                    height={25}/>{t('edit_profile.rejected_recipient')}. {initialFormData[index].comment}
                                            </p>
                                        )
                                    }
                            </div>
                            )
                        }
                        
                        <div className={'md:w-full'}>
                            <hr className={'border-gray-300 my-4'} />
                        </div>
                    </div>)
                    
                ))
            }
            
        
             <div className="flex flex-row gap-5">
                <button
                        className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}
                        onClick={addRecipient}
                        type={'button'}
                    >
                        {t('edit_profile.add_recipient')}
                    </button>
                
                {
                    isCreating && (
                        <button
                            className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}
                            onClick={saveRecipient}
                            type={'button'}>
                            {t('edit_profile.add')}
                        </button>
                    )
                }
            </div>
            {
                isEditing && (
                    <button
                        className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}
                        onClick={offEditMode}
                        type={'button'}>
                        {t('edit_profile.save')}
                    </button>
                )
            }
            {
                !isEditing && (
                    <button
                        className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}
                        onClick={setEditMode}
                        type={'button'}
                    >
                        {t('edit_profile.edit')}
                    </button>
                )
            }
           
            
            
        </form>
    );
}

