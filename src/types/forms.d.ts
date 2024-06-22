import { CountryData, FileMetaData, RecipientOverview } from '@/types/entities'
import { Money } from '@/app/components/input/MoneyInput'

export type GoodFormData = {
    id: string
    country?: CountryData
    customOrderId?: string
    trackingNumber?: string
    link: string
    name: string
    price?: Money
    description: string
    invoice?: File
    originalBox: boolean
}


export type OrderFormData = {
    recipient?: RecipientOverview,
    goods: GoodFormData[],
}

export type CreateDeliveryFormData = {
    price: Money
    weight: number
    kazPostTrackNumber: string
    invoice?: File | FileMetaData
    recipient?: RecipientOverview
}

export type UpdateDeliveryFormData = {
    id: string
    price: Money
    weight: number
    kazPostTrackNumber: string
    invoice?: File | FileMetaData
    recipient: RecipientOverview
}