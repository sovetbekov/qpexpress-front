import Link from 'next/link'
import PageWrapper from '@/app/[language]/profile/PageWrapper'
import DeliveryCard from '@/app/[language]/profile/deliveries/DeliveryCard'
import { getMyDeliveries } from '@/services/deliveries'
import { isError } from '@/app/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const deliveriesResponse = await getMyDeliveries()
    if (isError(deliveriesResponse)) {
        return <div>Ошибка</div>
    }
    const deliveries = deliveriesResponse.data

    return (
        <PageWrapper>
            <div className={'flex flex-col px-5 w-full md:col-start-2 md:col-span-1'}>
                <h2 className={'text-2xl mb-5 md:hidden'}>Мои посылки</h2>
                <div className={'mt-5 flex flex-col gap-5 md:mt-10'}>
                    {
                        deliveries.map(delivery => <DeliveryCard key={delivery.id} delivery={delivery}/>)
                    }
                </div>
            </div>
        </PageWrapper>
    )
}