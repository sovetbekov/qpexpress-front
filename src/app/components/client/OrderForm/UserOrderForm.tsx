import React from 'react'
import EditableOrderForm from '@/app/components/client/OrderForm/EditableOrderForm'
import { getCountries } from '@/services/countries'
import { getMyRecipients } from '@/services/account'
import { isError } from '@/app/lib/utils'
import { useTranslation } from '@/app/i18n'

export const dynamic = 'force-dynamic'

type Props = {
    language: string
}

export default async function UserOrderForm({language}: Props) {
    const {t} = await useTranslation(language, 'order')
    const countriesPromise = getCountries()
    const recipientsPromise = getMyRecipients()
    const [countriesResponse, recipientsResponse] = await Promise.all([countriesPromise, recipientsPromise])
    if (isError(countriesResponse) || isError(recipientsResponse)) {
        return <div>Order not found</div>
    }
    const countries = countriesResponse.data
    const recipients = recipientsResponse.data.filter(recipient => recipient.status === 'ACTIVE')
    return (
        <div className={'flex flex-col p-5 gap-y-5 md:gap-y-[8rem]'}>
            <h2 className={'text-2xl md:hidden'}>{t('add_order')}</h2>
            <EditableOrderForm countries={countries} recipients={recipients} language={language}/>
        </div>
    )
}