import Link from 'next/link'
import PageWrapper from '@/app/[language]/profile/PageWrapper'
import { getMarketplaces } from '@/services/marketplaces'
import MarketplacesTable from '@/app/[language]/admin/marketplaces/MarketplacesTable'
import { isError } from '@/app/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const marketplacesResponse = await getMarketplaces()
    if (isError(marketplacesResponse)) {
        return <div>Ошибка</div>
    }
    const marketplaces = marketplacesResponse.data
    
    return (
        <PageWrapper>
            <div className={'flex flex-col px-5 w-full md:col-start-2 md:col-span-1'}>
                <h2 className={'text-2xl mb-5 md:hidden'}>Маркетплейсы</h2>
                <Link href={'/admin/marketplaces/create'}>
                    <button
                        className={'border border-blue cursor-pointer w-full text-blue px-0 py-3 rounded-full'}>
                        + Добавить маркетплейс
                    </button>
                </Link>
                <div className={'mt-5 flex flex-col gap-5 md:mt-10'}>
                    <MarketplacesTable marketplaces={marketplaces} />
                </div>
            </div>
        </PageWrapper>
    )
}