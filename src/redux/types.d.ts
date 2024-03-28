import { RecipientData } from '@/types'

export type ModalState = { id: string } & ({
    modalType: 'calculator'
    data: null,
} | {
    modalType: 'denialReason'
    data: {
        recipient: RecipientData
    }
} | {
    modalType: 'paymentMethod',
    data: {
        price: number
        deliveryId: string
    }
} | {
    modalType: 'kaspiQr',
    data: {
        price: number
        deliveryId: string
    }
})

export type CalculatorResponse = {
    countryId: string
    weight: number | null
    price: number | null
}

export type CalculatorRequest = {
    countryId: string
    weight: number | null
    price: number | null
}