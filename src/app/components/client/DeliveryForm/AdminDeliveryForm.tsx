import React, { useEffect, useState } from 'react'
import { CurrencyData, DeliveryData, RecipientOverview } from '@/types'
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

export default function AdminDeliveryForm({language, ...props}: Readonly<Props>) {
    const [recipients, setRecipients] = useState<RecipientOverview[]>([])
    const [currencies, setCurrencies] = useState<CurrencyData[]>([])
    useEffect(() => {
        getRecipients().then(response => {
            if (!isError(response)) {
                setRecipients(response.data)
            }
        })
        getCurrencies().then(response => {
            if (!isError(response)) {
                setCurrencies(response.data)
            }
        })
    }, [language])
    return (
        <div className={'flex flex-col p-5 gap-y-5 md:gap-y-[8rem]'}>
            <h2 className={'text-2xl md:hidden'}>Добавить посылку</h2>
            {
                props.isUpdate ?
                    recipients.length > 0 && <UpdateDeliveryForm data={props.data} recipients={recipients} language={language}/> :
                    recipients.length > 0 && currencies.length > 0 && <CreateDeliveryForm recipients={recipients} currencies={currencies} language={language}/>
            }
        </div>
    )
}