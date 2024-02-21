import { RecipientData } from '@/types'

export type ModalState = { id: string } & ({
    modalType: 'calculator'
} | {
    modalType: 'denialReason'
    data: {
        recipient: RecipientData
    }
} | {
    modalType: 'paymentMethod'
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