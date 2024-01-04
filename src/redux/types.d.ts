export type ModalState = {
    modalType: 'calculator' | undefined
}

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