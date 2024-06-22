'use client'

import React, { InputHTMLAttributes, useEffect, useMemo, useState } from 'react'
import {
    Column,
    Table,
    useReactTable,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { OrderData } from '@/types/entities'

type Props = {
    orders: OrderData[],
}

export default function OrdersTable({orders}: Readonly<Props>) {
    const router = useRouter()
    const statusText: { [key: string]: string } = useMemo(() => ({
        'CREATED': 'Created',
        'IN_THE_WAY': 'In the way',
        'IN_YOUR_COUNTRY': 'In your country',
        'IN_MAIL_OFFICE': 'In mail office',
        'DELIVERED': 'Delivered',
        'DELETED': 'Deleted',
    }), [])

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns = useMemo<ColumnDef<OrderData, any>[]>(() => [
        {
            accessorFn: row => `${row.recipient.firstName} ${row.recipient.lastName}`,
            id: 'recipientName',
            header: 'Recipient Name',
            cell: info => info.getValue(),
            footer: props => props.column.id,
        },
        {
            accessorFn: row => row.orderNumber,
            id: 'orderNumber',
            header: 'Order number',
            cell: info => info.getValue(),
            footer: props => props.column.id,
        },
        {
            accessorFn: row => `${statusText[row.status ?? 'NO_STATUS']}`,
            id: 'status',
            header: 'Status',
            cell: info => info.getValue(),
            footer: props => props.column.id,
        },

        // Add more recipient-related columns as needed
    ], [statusText])

    const table = useReactTable({
        data: orders,
        getRowId: row => row.id,
        columns,
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    })

    return (
        <div className={'w-full min-h-[50rem] flex flex-col justify-between gap-y-2 p-10 bg-gray rounded-3xl'}>
            <div>
                <h3>Заказы</h3>
                <table className={'w-full border-separate border-spacing-y-5'}>
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="flex flex-row gap-6">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan} className='text-left '>
                                    {header.isPlaceholder ? null : (
                                        <>
                                            <div
                                                {...{
                                                    className: header.column.getCanSort()
                                                        ? 'cursor-pointer select-none'
                                                        : '',
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽',
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    <Filter column={header.column} table={table}/>
                                                </div>
                                            ) : null}
                                        </>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className={'cursor-pointer'} onClick={() => {
                            router.push(`/admin/orders/${row.id}`)
                        }}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className={'h-[1px] '}>
                                    <div className={clsx('flex items-center h-full p-5 bg-white' , {
                                                'justify-start rounded-l-full': cell.column.id === 'recipientName',
                                                'justify-end rounded-r-full': cell.column.id === 'status',
                                            })}>
                                        <p className={'text-base'}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </p>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className={'flex flex-row gap-1 justify-center'}>
                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <div className={'flex flex-row gap-1'}>
                    {Array.from({length: 5}, (_, i) => i - 2)
                        .map(relativePage => table.getState().pagination.pageIndex + relativePage)
                        .filter(pageIndex => pageIndex >= 0 && pageIndex < table.getPageCount())
                        .map(pageIndex => (
                            <button
                                key={pageIndex}
                                onClick={() => table.setPageIndex(pageIndex)}
                                disabled={pageIndex < 0 || pageIndex >= table.getPageCount()}
                            >
                                {pageIndex + 1}
                            </button>
                        ))}
                </div>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
            </div>
        </div>
    )
}

function Filter({
    column,
    table,
}: {
    column: Column<any>
    table: Table<any>
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = useMemo(
        () =>
            typeof firstValue === 'number'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys()).sort(),
        [column, firstValue],
    )

    return typeof firstValue === 'number' ? (
        <div>
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min ${
                        column.getFacetedMinMaxValues()?.[0]
                            ? `(${column.getFacetedMinMaxValues()?.[0]})`
                            : ''
                    }`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max ${
                        column.getFacetedMinMaxValues()?.[1]
                            ? `(${column.getFacetedMinMaxValues()?.[1]})`
                            : ''
                    }`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1"/>
        </div>
    ) : (
        <>
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                    <option value={value} key={value}/>
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className="w-36 border shadow rounded"
                list={column.id + 'list'}
            />
            <div className="h-1"/>
        </>
    )
}

// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [debounce, value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)}/>
    )
}
