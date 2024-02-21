'use client'

import DropdownInput from '@/app/components/input/DropdownInput/DropdownInput'
import { DeliveryStatus } from '@/types'

type Props = {
    selected: DeliveryStatus
    language: string
}

export default function DeliveryStatusInput({selected}: Readonly<Props>) {
    const statuses: DeliveryStatus[] = [
        'CREATED',
        'IN_THE_WAY',
        'IN_YOUR_COUNTRY',
        'IN_MAIL_OFFICE',
        'DELIVERED',
        'DELETED',
    ]
    const statusOptions = statuses.map(option => {
        return {
            id: option,
            value: option,
            label: option,
        }
    })

    return (
        <DropdownInput<DeliveryStatus> id={'status'}
                       options={statusOptions}
                       label={'Статус'}
                       nullable={false}
                       searchable={false}
                       selected={selected}
                       setSelected={(value) => {
                           console.log(value)
                       }}
        />
    )
}