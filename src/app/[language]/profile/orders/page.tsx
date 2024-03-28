import Link from 'next/link'
import OrderCard from '@/app/[language]/profile/orders/OrderCard'
import { getMyOrders } from '@/services/orders'
import PageWrapper from '@/app/[language]/profile/PageWrapper'
import { isError } from '@/app/lib/utils'
import { useTranslation } from '@/app/i18n'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        language: string
    }
}

export default async function Page({params: {language}}: Readonly<Props>) {
    const {t} = await useTranslation(language, 'profile')
    const ordersResponse = await getMyOrders()
    if (isError(ordersResponse)) {
        return <div>Ошибка</div>
    }
    const orders = ordersResponse.data

    return (
        <PageWrapper>
            <div className={'flex flex-col px-5 w-full md:col-start-2 md:col-span-1'}>
                <h2 className={'text-2xl mb-5 md:hidden'}>{t('orders')}</h2>
                <Link href={'/profile/orders/create'}>
                    <button
                        className={'border border-blue cursor-pointer w-full text-blue px-0 py-3 rounded-full'}>
                        {t('create_order')}
                    </button>
                </Link>
                <div className={'mt-5 flex flex-col gap-5 md:mt-10'}>
                    {
                        orders.map(order => <OrderCard key={order.id} order={order} language={language}/>)
                    }
                </div>
            </div>
        </PageWrapper>
    )
}