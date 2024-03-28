'use client'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import modalReducer from '@/redux/reducers/modalSlice'
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { countriesApi } from '@/redux/reducers/countriesApi'
import { currenciesApi } from '@/redux/reducers/currenciesApi'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: [countriesApi.reducerPath, currenciesApi.reducerPath]
}

const rootReducer = combineReducers({
    modal: modalReducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
    [currenciesApi.reducerPath]: currenciesApi.reducer,
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
        .concat(currenciesApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const persistor = persistStore(store)

export { store, persistor }