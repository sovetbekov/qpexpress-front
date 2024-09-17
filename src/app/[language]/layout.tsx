import '../globals.css'
import { Metadata, Viewport } from 'next'
import React from 'react'
import Header from '@/app/components/client/Header'
import Footer from '@/app/components/home/Footer'
import Providers from '@/app/[language]/providers'
import Navigation from '@/app/components/server/Navigation'
import Modal from '@/app/components/modal/Modal'
import 'react-toastify/dist/ReactToastify.css'
import { dir } from 'i18next'
import { languages } from '@/app/i18n/settings'
import ClientComponent from './gmt'
import { FaWhatsapp } from 'react-icons/fa'

export const metadata: Metadata = {
    title: 'QP Express',
    description: 'QP Express',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
}

export async function generateStaticParams() {
    return languages
}

type Props = {
    children: React.ReactNode,
    params: {
        language: string
    }
}

export default function RootLayout({
    children,
    params: {
        language,
    },
}: Readonly<Props>) {
    return (
        <html lang={language} dir={dir(language)}>
            <body>
                <Providers>
                    <div className={'h-[100dvh] overflow-y-auto overflow-x-hidden scroll-pt-20'}>
                        <ClientComponent />
                        <Header language={language} />
                        <Navigation language={language} />
                        <div className={'min-h-[calc(100dvh-5rem)] flex flex-col justify-between'}>
                            <div className={'pb-10'}>
                                {children}
                            </div>
                            <Footer language={language} />
                        </div>
                        <Modal language={language} />
                        <a
                            href="https://api.whatsapp.com/send/?phone=77000888090&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21+%D0%AF+%D1%85%D0%BE%D1%82%D0%B5%D0%BB%D0%B0+%D1%81%D0%B4%D0%B5%D0%BB%D0%B0%D1%82%D1%8C+%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7&type=phone_number&app_absent=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-button"
                        >
                            <FaWhatsapp color="white" size="24px" />
                        </a>
                    </div>
                </Providers>
            </body>
        </html>
    )
}
