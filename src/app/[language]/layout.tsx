import '../globals.css'
import { Metadata, Viewport } from 'next'
import React from 'react'
import Header from '@/app/components/client/Header'
import Footer from '@/app/components/home/Footer'
import Providers from '@/app/[language]/providers'
import Navigation from '@/app/components/server/Navigation'
import Modal from '@/app/components/modal/Modal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { dir } from 'i18next'
import { languages } from '@/app/i18n/settings'

export const metadata: Metadata = {
    title: 'QP Express',
    description: 'QP Express',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
}

export async function generateStaticParams() {
    return languages.map(language => {
        language
    })
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
                                   }: Props) {
    return (
        <html lang={language} dir={dir(language)}>
        <body>
        <Providers>
            <div className={'h-[100dvh] overflow-y-auto overflow-x-hidden scroll-pt-20'}>
                <Header language={language}/>
                <Navigation language={language}/>
                <div className={'min-h-[calc(100dvh-5rem)] flex flex-col justify-between'}>
                    <div className={'pb-10'}>
                        {children}
                    </div>
                    <Footer language={language}/>
                </div>
                <Modal/>
                <ToastContainer
                    autoClose={4000}
                    position={'bottom-right'}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={'light'}
                />
            </div>
        </Providers>
        </body>
        </html>
    )
}
