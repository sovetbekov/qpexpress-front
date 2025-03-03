'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    ColumnDef,
    useReactTable,
    flexRender
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { ShipmentData } from '@/types/entities'
import Modal from './Modal'

type Shipment = {
    id: string
    trackingNumber: string
    status: string
    recipient: {
        firstName: string
        lastName: string
    }
}

type Props = {
    shipments: ShipmentData[]
}

export default function ShipmentsTable({ shipments }: Readonly<Props>) {
    const router = useRouter()
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

    const statusText: { [key: string]: string } = useMemo(() => ({
        'CREATED': 'Created',
        'IN_TRANSIT': 'In Transit',
        'DELIVERED': 'Delivered',
        'CANCELLED': 'Cancelled',
    }), [])

    // Приводим данные из ShipmentData к формату Shipment
    const transformedShipments: Shipment[] = shipments.map(shipment => ({
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        recipient: {
            firstName: shipment.receiverPerson.split(' ')[0] || '',
            lastName: shipment.receiverPerson.split(' ')[1] || ''
        }
    }))

    const columns = useMemo<ColumnDef<Shipment, any>[]>(() => [
        {
            accessorFn: row => `${row.recipient.firstName} ${row.recipient.lastName}`,
            id: 'recipientName',
            header: 'Recipient Name',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'trackingNumber',
            header: 'Tracking Number',
            cell: info => info.getValue(),
        },
        {
            accessorFn: row => statusText[row.status] ?? 'Unknown',
            id: 'status',
            header: 'Status',
            cell: info => {
                const shipment = info.row.original;
                const status = statusText[shipment.status] ?? 'Unknown';
            
                return (
                    <button
                        className="text-blue-500 underline"
                        onClick={e => {
                            e.stopPropagation();
                            if (shipment.status && shipment.status in statusText) {
                                setSelectedShipment(shipment);
                            }
                        }}
                    >
                        {status}
                    </button>
                );
            },
        },
    ], [statusText])

    const table = useReactTable({
        data: transformedShipments,
        columns,
        state: { columnFilters },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="w-full min-h-[50rem] flex flex-col gap-y-4 p-10 bg-gray-100 rounded-xl">
            <h3 className="text-lg font-bold">Shipments</h3>
            <table className="w-full border-separate border-spacing-y-4">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="flex gap-6">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="text-left">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="cursor-pointer" onClick={() => router.push(`/admin/shipments/${row.id}`)}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="p-4 bg-white rounded-md">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal shipment={selectedShipment} onClose={() => setSelectedShipment(null)} />
        </div>
    )
}
