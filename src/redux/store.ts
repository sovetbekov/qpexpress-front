'use client'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import modalReducer from '@/redux/reducers/modalSlice'
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { countriesApi } from '@/redux/reducers/countriesApi'
import { currenciesApi } from '@/redux/reducers/currenciesApi'
import { ordersApi } from '@/redux/reducers/ordersApi'
import { addressesApi } from '@/redux/reducers/addressesApi'
import { profileApi } from '@/redux/reducers/profileApi'
import { calculatorApi } from '@/redux/reducers/calculatorApi'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: [countriesApi.reducerPath, currenciesApi.reducerPath, ordersApi.reducerPath, addressesApi.reducerPath, profileApi.reducerPath, calculatorApi.reducerPath]
}

const rootReducer = combineReducers({
    modal: modalReducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
    [currenciesApi.reducerPath]: currenciesApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [addressesApi.reducerPath]: addressesApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [calculatorApi.reducerPath]: calculatorApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
        }
    })
        .concat(countriesApi.middleware)
        .concat(currenciesApi.middleware)
        .concat(ordersApi.middleware)
        .concat(addressesApi.middleware)
        .concat(profileApi.middleware)
        .concat(calculatorApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const persistor = persistStore(store)

export { store, persistor }