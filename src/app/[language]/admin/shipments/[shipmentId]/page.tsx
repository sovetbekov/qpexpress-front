'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getShipment } from '@/services/shipments'
import Image from 'next/image'
import Link from 'next/link'
import { ShipmentData } from '@/types/entities'
import { isError } from '@/app/lib/utils'
import ShipmentStatusInput from './ShipmentStatusInput'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        shipmentId: string
    }
}

export default function Page({ params: { shipmentId } }: Readonly<Props>) {
    const [shipment, setShipment] = useState<ShipmentData | null>(null);
    const router = useRouter();

    useEffect(() => {
        getShipment(shipmentId).then(response => {
            if (!isError(response)) {
                setShipment(response.data);
            }
        });
    }, [shipmentId]);

    if (!shipment) {
        return <div>Loading...</div>;
    }

    return (
        <div className='md:p-20'>
            <div className='hidden md:flex md:flex-row md:items-center md:justify-between mb-10'>
                <div className='md:flex md:flex-row md:items-center md:gap-x-4'>
                    <Link href='/admin/shipments' className='flex justify-center'>
                        <Image src='/assets/back_arrow.svg' alt='Back' width={24} height={24} />
                    </Link>
                    <p className='md:text-4xl md:font-bold'>
                        {shipment.trackingNumber}
                    </p>
                </div>
                <ShipmentStatusInput shipment={shipment} setShipment={setShipment} />
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <p><strong>Tracking Number:</strong> {shipment.trackingNumber}</p>
                <p><strong>Status:</strong> {shipment.status}</p>
                <p><strong>Recipient:</strong> {shipment.receiverPerson}</p>
            </div>
        </div>
    );
}
