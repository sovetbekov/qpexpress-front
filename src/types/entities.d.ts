import { DeliveryStatus, OrderStatus, RecipientStatus } from '@/types/utils'

export type CountryData = {
    id: string,
    name: string,
}

export type CityData = {
    id: string,
    name: string,
    countryId: string,
}

export type CurrencyData = {
    id: string,
    name: string,
}

export type AddressData = {
    id: string
    country: string
    city: string
    district: string
    neighborhood: string
    street: string
    house: string
    postcode: string
}

export type FileMetaData = {
    id: string
    contentType: string
    name: string
}

export type RecipientData = RecipientOverview & {
    iin: string
    documentSideA: FileMetaData
    documentSideB: FileMetaData
    district: string
    phoneNumber: string
    address: string
    comment?: string
}

export type GoodData = {
    country: CountryData,
    currency: CurrencyData,
    id: string
    name: string
    link: string
    description: string
    orderId: string
    originalBox: boolean
    trackingNumber: string
    status: string
    price: number
}

export type OrderData = {
    id: string
    recipient: RecipientData
    goods: GoodData[]
    orderNumber: string
    status: OrderStatus
}

export type DeliveryData = {
    id: string
    deliveryNumber: string
    recipient: RecipientData
    status: DeliveryStatus
    currency: CurrencyData
    weight: number
    price: number
    goods: GoodData[]
    kazPostTrackNumber: string
    invoice: FileMetaData
}

export type UserData = {
    id: string
    firstName: string
    lastName: string
    patronymic: string
    email: string
    password: string
}

export type RecipientOverview = {
    id: string,
    status: RecipientStatus,
    firstName: string,
    lastName: string,
    patronymic: string,
}

export type UserWithRecipientsOverview = {
    user: UserData,
    recipients: RecipientOverview[],
}

export type UserWithRecipientsData = {
    user: UserData,
    recipients: RecipientData[],
}

export type ProfileData = {
    id: string
    firstName: string
    lastName: string
    patronymic: string
    email: string
}