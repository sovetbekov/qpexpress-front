'use client'

import React, { useState } from 'react';
import { ContactData } from '@/types/entities';

type Props = {
    contacts: ContactData[],
};

export default function ContactsTable({ contacts }: Readonly<Props>) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredContacts = contacts.filter(contact =>
        contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
    );

    const formatArrayTimestamp = (timestampArray: number[]): string => {
        const [year, month, day, hour, minute, second] = timestampArray;

        // Create a Date object using the extracted parts
        const date = new Date(Date.UTC(
            year,
            month - 1, // Month is 0-indexed in JavaScript Date
            day,
            hour,
            minute,
            second
        ));

        // Format the date and time
        const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '.');
        const formattedTime = date.toLocaleTimeString('en-GB');

        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div className="container mx-auto">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Поиск"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 leading-normal">
                            <th className="py-2 px-4 md:py-3 md:px-6 text-left">Имя</th>
                            <th className="py-2 px-4 md:py-3 md:px-6 text-left">Номер телефона</th>
                            <th className="py-2 px-4 md:py-3 md:px-6 text-left">Дата создания</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 font-light">
                        {filteredContacts.map((contact) => (
                            <tr key={contact.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-2 px-4 md:py-3 md:px-6 text-left">
                                    {contact.fullName}
                                </td>
                                <td className="py-2 px-4 md:py-3 md:px-6 text-left">
                                    {contact.phone}
                                </td>
                                <td className="py-2 px-4 md:py-3 md:px-6 text-left whitespace-nowrap">
                                    {formatArrayTimestamp(contact.creationDate)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
