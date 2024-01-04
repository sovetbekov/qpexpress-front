import { CountryData } from '@/redux/types'
import { Money } from '@/app/components/input/MoneyInput'

export type ProductInfo = {
    id: string
    country?: CountryData
    customOrderId: string
    trackingNumber: string
    productLink: string
    orderId: string
    name: string
    price?: Money
    description: string
    invoice?: File
    originalBox: boolean
}
