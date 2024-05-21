'use server'

import { MarketplaceData, MarketplaceDataOverview } from '@/types/entities'
import { makeRequest } from '@/services/utils'
import { revalidateTag } from 'next/cache'

export async function getMarketplaces() {
    return await makeRequest<MarketplaceDataOverview[]>('v1/marketplaces', {
        requestOptions: {
            next: {
                tags: ['marketplaces'],
            },
        },
    })
}

export async function createMarketplace(data: MarketplaceData) {
    console.info(data, 'create')
    return await makeRequest('v1/marketplaces/create', {
        requestOptions: {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        },
        
    })
}

export async function updateMarketplace(id: string, data: MarketplaceData) {
    console.info(JSON.stringify(data), 'update')
    return await makeRequest<MarketplaceDataOverview>(`v1/marketplaces/${id}`, {
        requestOptions: {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        },
    })
}

export async function getMarketplaceById(id: string) {
    return await makeRequest<MarketplaceDataOverview>(`v1/marketplaces/${id}`, {
        requestOptions: {
            next: {
                tags: ['marketplaces'],
            },
        },
    })
}

export async function deleteMarketplaceById(id: string) {
    return await makeRequest<MarketplaceDataOverview>(`v1/marketplaces/${id}`, {
        requestOptions: {
            method: 'DELETE',
        },
    })
}