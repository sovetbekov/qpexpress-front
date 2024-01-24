export type ModalState = {
    modalType?: 'calculator' | 'denialReason' | 'paymentMethod'
    data?: any
}

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