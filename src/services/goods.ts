'use server'

import { FileMetaData, GoodData } from '@/types/entities'
import { createQueryParams, makeRequest } from '@/services/utils'

type GoodsRequest = {
    userId?: string
    recipientId?: string
    orderId?: string
    deliveryId?: string
    status?: string
}

export async function getGoods(request: GoodsRequest) {
    const params = await createQueryParams(request)
    return await makeRequest<GoodData[]>(`v1/goods?${params}`, {
        requestOptions: {
            next: {
                tags: ['goods'],
            },
        },
    })
}