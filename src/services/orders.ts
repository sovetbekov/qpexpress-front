'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { BACKEND_URL } from '@/globals'
import { ProductInfo } from '@/app/[language]/profile/orders/create/types'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export type Order = {
    id: string
    customOrderId: string
    trackingNumber: string
    productType: string
    name: string,
    description: string,
    price: number
    commission: number
    invoiceId: string
    weight: number
    countryId: string
    deliveryPrice: number
    kazPostTrackNumber: string
    kazPostInvoice: string
    userId: string
    status: OrderStatus
}

type CreateOrderResult = {
    status: 'success'
    order: Order
} | {
    status: 'error'
    error: string
}

enum OrderStatus {
    CREATED = 'CREATED',
    DELIVERED_TO_WAREHOUSE = 'DELIVERED_TO_WAREHOUSE',
    IN_THE_WAY = 'IN_THE_WAY',
    IN_YOUR_COUNTRY = 'IN_YOUR_COUNTRY',
    IN_MAIL_OFFICE = 'IN_MAIL_OFFICE',
    DELIVERED = 'DELIVERED',
    DELETED = 'DELETED'
}

export async function getMyOrders(): Promise<Order[]> {
    const session = await getServerSession(authOptions)
    if (!BACKEND_URL) {
        return Promise.reject('API_URL is not defined')
    }
    if (!session) {
        return Promise.reject('Not authorized')
    }
    const response = await fetch(`${BACKEND_URL}/v1/my/orders`, {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    })
    if (!response.ok) {
        return Promise.reject(`Failed to fetch: ${response.status}`)
    }
    try {
        return await response.json()
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function createOrders(orders: ProductInfo[]) {
    const session = await getServerSession(authOptions)
    if (!BACKEND_URL) {
        return Promise.reject('API_URL is not defined')
    }
    if (!session) {
        return Promise.reject('Not authorized')
    }
    if (!session.user.id) {
        return Promise.reject('Session error')
    }
    const promises = orders.filter(productInfo => productInfo.country && productInfo.price).map(productInfo => {
        const data = new FormData()
        data.append('trackingNumber', productInfo.trackingNumber)
        data.append('userId', session.user.id!!)
        data.append('orderId', productInfo.orderId)
        data.append('name', productInfo.name)
        data.append('description', productInfo.description)
        data.append('price', productInfo.price!!.value.toString())
        data.append('currencyId', productInfo.price!!.currency.id)
        data.append('invoice', productInfo.invoice as File)
        data.append('countryId', productInfo.country!!.id as string)
        data.append('originalBox', productInfo.originalBox.toString())
        data.append('productLink', productInfo.productLink)
        return createOrder(data)
    })
    await Promise.all(promises)
    revalidateTag('orders')
    redirect('/profile/orders')
}

export async function createOrder(orderData: FormData): Promise<CreateOrderResult> {
    const session = await getServerSession(authOptions)
    if (!BACKEND_URL) {
        return Promise.reject('API_URL is not defined')
    }
    if (!session) {
        return Promise.reject('Not authorized')
    }
    const response = await fetch(`${BACKEND_URL}/v1/my/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.accessToken}`,
        },
        body: orderData,
        next: {
            tags: ['orders'],
        },
    })
    if (!response.ok) {
        return {
            status: 'error',
            error: response.statusText,
        }
    }
    try {
        revalidateTag('orders')
        return {
            status: 'success',
            order: await response.json() as Order,
        }
    } catch (e: any) {
        return {
            status: 'error',
            error: e.toString(),
        }
    }
}

export async function getOrders(): Promise<Order[]> {
    const session = await getServerSession(authOptions)
    if (!BACKEND_URL) {
        return Promise.reject('API_URL is not defined')
    }
    if (!session) {
        return Promise.reject('Not authorized')
    }
    const response = await fetch(`${BACKEND_URL}/v1/orders`, {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    })
    if (!response.ok) {
        return Promise.reject('Failed to fetch')
    }
    try {
        return await response.json()
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function getOrderData(orderId: string): Promise<Order> {
    const session = await getServerSession(authOptions)
    if (!BACKEND_URL) {
        return Promise.reject('API_URL is not defined')
    }
    if (!session) {
        return Promise.reject('Not authorized')
    }
    const response = await fetch(`${BACKEND_URL}/v1/my/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    })
    if (!response.ok) {
        return Promise.reject('Failed to fetch')
    }
    try {
        return await response.json()
    } catch (e) {
        return Promise.reject(e)
    }
}