'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { persistor, store } from '@/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'

type Props = {
    children: React.ReactNode
}

export default function Providers({children}: Props) {
    return (
        <SessionProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
                <ToastContainer/>
            </Provider>
        </SessionProvider>
    )
}