'use client'

import DropdownInput from '@/app/components/input/DropdownInput'
import { DeliveryStatus } from '@/types'

type Props = {
    selected: DeliveryStatus
    language: string
}

export default function DeliveryStatusInput({selected, language}: Readonly<Props>) {
    const selectOptions: Record<DeliveryStatus, string> = {
        CREATED: 'Создан',
        IN_THE_WAY: 'В пути',
        IN_YOUR_COUNTRY: 'В вашей стране',
        IN_MAIL_OFFICE: 'В почтовом отделении',
        DELIVERED: 'Доставлен',
        DELETED: 'Удален',
    }

    return (
        <DropdownInput id={'status'}
                       options={Object.values(selectOptions)}
                       label={'Статус'}
                       nullable={false}
                       searchable={false}
                       selected={selectOptions[selected]}
                       setSelected={(value) => {
                            console.log(value)
                       }}
        />
    )
}