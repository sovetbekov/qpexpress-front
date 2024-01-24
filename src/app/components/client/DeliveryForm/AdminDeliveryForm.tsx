import React from 'react'
import { DeliveryData } from '@/types'
import UpdateDeliveryForm from '@/app/components/client/DeliveryForm/UpdateDeliveryForm'
import { getRecipients } from '@/services/account'
import CreateDeliveryForm from '@/app/components/client/DeliveryForm/CreateDeliveryForm'
import { getCurrencies } from '@/services/currencies'
import { isError } from '@/app/lib/utils'

type Props = { language: string } & ({
    isUpdate: true,
    data: DeliveryData
} | {
    isUpdate: false
})

export default async function AdminDeliveryForm({language, ...props}: Readonly<Props>) {
    const recipientsPromise = getRecipients()
    const currenciesPromise = getCurrencies()
    const [recipientsResponse, currenciesResponse] = await Promise.all([recipientsPromise, currenciesPromise])
    if (isError(recipientsResponse)) {
        return <div>Recipients not found</div>
    }
    if (isError(currenciesResponse)) {
        return <div>Currencies not found</div>
    }
    const recipients = recipientsResponse.data
    const currencies = currenciesResponse.data
    return (
        <div className={'flex flex-col p-5 gap-y-5 md:gap-y-[8rem]'}>
            <h2 className={'text-2xl md:hidden'}>Добавить заказ</h2>
            {props.isUpdate ? <UpdateDeliveryForm data={props.data} recipients={recipients} language={language}/> :
                <CreateDeliveryForm recipients={recipients} currencies={currencies} language={language}/>}
        </div>
    )
}