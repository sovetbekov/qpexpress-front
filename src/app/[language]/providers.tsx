'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { persistor, store } from '@/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Props = {
    children: React.ReactNode
}

export default function Providers({children}: Readonly<Props>) {
    return (
        <SessionProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
            </Provider>
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
                stacked
                theme={'light'}
            />
        </SessionProvider>
    )
}