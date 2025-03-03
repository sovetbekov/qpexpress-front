import { Shipment } from '@/types'
import React from 'react'

type ModalProps = {
    shipment: Shipment | null
    onClose: () => void
}

export default function Modal({ shipment, onClose }: ModalProps) {
    if (!shipment) return null

    return (
        
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
                <h2 className="text-lg font-bold mb-4">Shipment Details</h2>
                <p><strong>Tracking Number:</strong> {shipment.trackingNumber}</p>
                <p><strong>Status:</strong> {shipment.status}</p>
                <p><strong>Recipient:</strong> {shipment.recipient.firstName} {shipment.recipient.lastName}</p>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
