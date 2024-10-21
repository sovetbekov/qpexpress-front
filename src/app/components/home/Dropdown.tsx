'use client'

import React, { useState } from 'react'
import { FaWhatsapp, FaInstagram, FaHeadset, FaEnvelope } from 'react-icons/fa'
import LeaveContacts from '@/app/components/home/LeaveContacts'

const Dropdown: React.FC = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false)
    const [isSupportDialogOpen, setSupportDialogOpen] = useState(false)

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen)
    }

    const toggleSupportDialog = () => {
        setSupportDialogOpen(!isSupportDialogOpen)
    }

    return (
        <div className="fixed bottom-10 right-10">
            <div className="relative">
                {/* Main Dropdown Button */}
                <button
                    onClick={toggleDropdown}
                    className="rounded-full bg-[#fe5c00] p-4 text-white shadow-lg focus:outline-none"
                >
                    <FaEnvelope size="24px" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute bottom-[60px] right-0 flex flex-col gap-2 bg-white p-4 rounded-full shadow-lg">
                        <a
                            href="https://api.whatsapp.com/send/?phone=77000888090&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21+%D0%AF+%D1%85%D0%BE%D1%82%D0%B5%D0%BB%D0%B0+%D1%81%D0%B4%D0%B5%D0%BB%D0%B0%D1%82%D1%8C+%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7&type=phone_number&app_absent=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center rounded-full gap-2 bg-white text-[#00a884] hover:text-green-700"
                        >
                            <FaWhatsapp size="24px" />
                            
                        </a>
                        <a
                            href="https://www.instagram.com/qp_express/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center rounded-full gap-2 bg-white text-[#b500aa] hover:text-pink-700"
                        >
                            <FaInstagram size="24px" />
                            
                        </a>
                        <button
                            onClick={toggleSupportDialog}
                            className="flex items-center rounded-full gap-2 bg-white text-blue-500 hover:text-blue-700"
                        >
                            <FaHeadset size="24px" />
                            
                        </button>
                    </div>
                )}

                {/* Support Dialog */}
                {isSupportDialogOpen && (
                    <div className="absolute bottom-[60px] right-0 bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-semibold">Связаться с нами!
                        </h2>
                        <p className="text-gray-700 text-base mb-4">Выйдем на связь как можно скорее.</p>
                        {/* You can place other components or content here */}
                        <div className=''>
                            {/* Placeholder for any component */}
                            <LeaveContacts language={''}/>
                        </div>
                        {/* Close Button */}
                        <button
                            onClick={toggleSupportDialog}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            &times;
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dropdown
