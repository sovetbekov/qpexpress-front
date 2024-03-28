'use client'

import DropdownInput from '@/app/components/input/DropdownInput/DropdownInput'
import { DeliveryData, DeliveryStatus } from '@/types'
import { updateDeliveryStatus } from '@/services/deliveries'
import { toast } from 'react-toastify'
import { useTranslation } from '@/app/i18n/client'

type Props = {
    delivery: DeliveryData
    selected: DeliveryStatus
    setDelivery: (delivery: DeliveryData) => void
    language: string
}

const statuses: DeliveryStatus[] = [
    'CREATED',
    'IN_THE_WAY',
    'IN_YOUR_COUNTRY',
    'IN_MAIL_OFFICE',
    'DELIVERED',
    'DELETED',
]

export default function DeliveryStatusInput({delivery, setDelivery, selected, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'delivery_status')
    const statusOptions = statuses.map(option => {
        return {
            id: option,
            value: option,
            label: t(option),
        }
    })
    const onStatusChange = (value: DeliveryStatus) => {
        toast.promise(updateDeliveryStatus(delivery.id, value), {
            pending: 'Изменение статуса...',
            success: 'Статус изменен',
            error: 'Ошибка при изменении статуса',
        }).catch(console.error).then(response => {
            if (response) {
                setDelivery({
                    ...delivery,
                    status: value,
                })
            }
        })
    }

    return (
        <div className={'relative'}>
            <DropdownInput<DeliveryStatus> id={'status'}
                                           options={statusOptions}
                                           label={'Статус'}
                                           nullable={false}
                                           inputClassname={'border border-black rounded-full p-3 md:p-4 cursor-pointer w-full disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                           dropdownClassname={'md:max-h-60 w-[calc(100vw-2.5rem)] z-50 overflow-auto bg-white border md:mx-0 my-3 md:w-full rounded-3xl border-black'}
                                           dropdownItemClassname={'cursor-pointer p-3 w-full text-left md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                           errorsClassname={'absolute top-0 right-0 flex flex-row items-center h-full pr-10 text-[#EF4444]'}
                                           searchable={false}
                                           selected={selected}
                                           setSelected={value => onStatusChange(value.value)}
            />
        </div>
    )
}