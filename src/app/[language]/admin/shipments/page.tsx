import React from 'react'
import { isError } from '@/app/lib/utils'
import ShipmentsTable from './ShipmentsTable'
import { getShipments } from '@/services/shipments'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const shipmentsResponse = await getShipments()
    if (isError(shipmentsResponse)) {
        return <div>Ошибка</div>
    }
    const shipments = shipmentsResponse.data
    return (
        <>
            <ShipmentsTable shipments={shipments}/>
        </>
    )
}