'use server'

import { revalidateTag } from 'next/cache'
import { EditOrderData, FileMetaData, GoodData, OrderData } from '@/types/entities'
import { getLanguageBundle, makeRequest } from '@/services/utils'

type CreateOrderRequest = {
  recipientId?: string
  goods: CreateGoodRequest[]
}

type CreateGoodRequest = {
  name?: string
  customOrderId?: string
  description?: string
  countryId?: string
  link?: string
  price?: number
  currencyId?: string
  invoiceId?: string
  trackingNumber?: string
  recipientId?: string
  originalBox?: boolean
  quantity?: number
  userId?: string
}

export async function getMyOrders() {
  return await makeRequest<OrderData[]>('v1/my/orders')
}

export async function createGood(goodData: FormData) {
  return await makeRequest<GoodData>(`v1/orders/${goodData.get('orderId')}/goods`, {
    requestOptions: {
      method: 'POST',
      body: goodData,
      next: {
        tags: ['goods'],
      },
    },
    postRequest: () => revalidateTag('goods'),
  })
}

export async function createOrder(orderData: CreateOrderRequest, language: string) {
  const t = await getLanguageBundle(language, 'common')
  return await makeRequest<OrderData>('v1/orders', {
    requestOptions: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
      next: {
        tags: ['orders'],
      },
    },
    postRequest: () => revalidateTag('orders'),
    validateRequest: () => {
      const errors: Record<string, string[]> = {}
      if (!orderData.recipientId) {
        errors.recipient = [t['required_field']]
      }
      if (!orderData.goods.length) {
        errors.goods = [t['required_field']]
      }
      orderData.goods.forEach((good, index) => {
        if (!good.name) {
          errors[`name_${index}`] = [t['required_field']]
        }
        if (!good.description) {
          errors[`description_${index}`] = [t['required_field']]
        }
        if (!good.countryId) {
          errors[`country_${index}`] = [t['required_field']]
        }
        if (!good.link) {
          errors[`link_${index}`] = [t['required_field']]
        }
        if (!good.price) {
          errors[`price_${index}`] = [t['required_field']]
        }
        if (!good.currencyId) {
          errors[`currency_${index}`] = [t['required_field']]
        }
      })
      return errors
    },
  })
}

export async function getOrders() {
  return await makeRequest<OrderData[]>('v1/orders', {
    requestOptions: {
      next: {
        tags: ['orders'],
      },
    },
  })
}

export async function getOrder(orderId: string) {
  return await makeRequest<OrderData>(`v1/orders/${orderId}`, {
    requestOptions: {
      next: {
        tags: ['orders'],
      },
    },
  })
}

export async function updateOrder(data: EditOrderData, orderId: string) {
  console.info(orderId, 'orderId')
  console.info(JSON.stringify(data), 'update')
  return await makeRequest<EditOrderData>(`v1/my/orders/${orderId}`, {
    requestOptions: {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  })
}
