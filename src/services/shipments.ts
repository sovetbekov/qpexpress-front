'use server'

import { makeRequest, makeRequestNoAuth } from '@/services/utils'
import { ShipmentData } from '@/types/entities'

/**
 * Fetch all shipments.
 * @returns {Promise<any[]>} A promise resolving to the list of shipments.
 */
export async function getShipments() {
  return await makeRequest<ShipmentData[]>('v1/shipments', {
    requestOptions: {
      next: {
        tags: ['shipments'],
      },
    },
  })
}

/**
 * Fetch a shipment by its ID.
 * @param {string} id - The UUID of the shipment.
 * @returns {Promise<any>} A promise resolving to the shipment details.
 */
export async function getShipmentById(id: string) {
  return await makeRequest<any>(`v1/shipments/${id}`, {
    requestOptions: {
      next: {
        tags: ['shipments'],
      },
    },
  })
}

/**
 * Change the status of a shipment.
 * @param {string} id - The UUID of the shipment.
 * @param {string} status - The new status to set.
 * @returns {Promise<any>} A promise resolving to the updated shipment.
 */
export async function changeShipmentStatus(id: string, status: string) {
  return await makeRequest<any>(`v1/shipments/${id}/status`, {
    requestOptions: {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  })
}

/**
 * Create an order in Spedx for a shipment.
 * @param {string} shipmentId - The UUID of the shipment.
 * @returns {Promise<any>} A promise resolving to the Spedx order creation response.
 */
export async function createSpedxOrder(shipmentId: string) {
  return await makeRequest<any>(`v1/spedx-service/create-order/${shipmentId}`, {
    requestOptions: {
      method: 'POST',
    },
  })
}

/**
 * Fetch tracking information by shipment ID.
 * @param {string} shipmentId - The UUID of the shipment.
 * @returns {Promise<any>} A promise resolving to the full tracking response.
 */
export async function getTrackingInfoByShipmentId(shipmentId: string): Promise<any> {
  return await makeRequest<any>(`v1/spedx-service/tracking/${shipmentId}`, {
    requestOptions: {
      next: {
        tags: ['tracking'],
      },
    },
  })
}

