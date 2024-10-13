'use server'

import { DeliveryData } from '@/types/entities'
import { makeRequest } from '@/services/utils'
import { revalidateTag } from 'next/cache'
import { DeliveryStatus, Errors } from '@/types'

export async function getDeliveries() {
  return await makeRequest<DeliveryData[]>('v1/deliveries', {
    requestOptions: {
      next: {
        tags: ['deliveries'],
      },
    },
  })
}

export async function getMyDelivery(id: string) {
  return await makeRequest<DeliveryData>(`v1/my/deliveries/${id}`, {
    requestOptions: {
      next: {
        tags: ['deliveries'],
      },
    },
  })
}

export async function getDelivery(id: string) {
  return await makeRequest<DeliveryData>(`v1/deliveries/${id}`, {
    requestOptions: {
      next: {
        tags: ['deliveries'],
      },
    },
  })
}

export async function getMyDeliveries() {
  return await makeRequest<DeliveryData[]>('v1/my/deliveries', {
    requestOptions: {
      next: {
        tags: ['deliveries'],
      },
    },
  })
}

export async function createDelivery(data: FormData) {
  return await makeRequest<DeliveryData>('v1/deliveries', {
    requestOptions: {
      method: 'POST',
      body: data,
    },
    postRequest: () => revalidateTag('deliveries'),
    validateRequest: () => {
      const errors: Errors = {}
      if (!data.get('invoice') || (data.get('invoice') as File).size === 0) errors['invoice'] = ['Required field']
      return errors
    },
  })
}

export async function updateDelivery(id: string, data: FormData) {
  return await makeRequest<DeliveryData>(`v1/deliveries/${id}`, {
    requestOptions: {
      method: 'PUT',
      body: data,
    },
    postRequest: () => revalidateTag('deliveries'),
    validateRequest: () => {
      const errors: Errors = {}
      if (!data.get('invoice') || (data.get('invoice') as File).size === 0) errors['invoice'] = ['Required field']
      return errors
    },
  })
}

export async function updateDeliveryStatus(id: string, status: DeliveryStatus) {
  return await makeRequest<DeliveryData>(`v1/deliveries/${id}/status`, {
    requestOptions: {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    postRequest: () => revalidateTag('deliveries'),
  })
}
