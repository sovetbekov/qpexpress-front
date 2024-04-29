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
    flexRender, RowSelectionState, OnChangeFn,
} from '@tanstack/react-table'

import CheckboxInput from '@/app/components/input/CheckboxInput'
import clsx from 'clsx'
import { GoodData } from '@/types/entities'

type Props = {
    goods: GoodData[]
    selected: RowSelectionState
    onSelectedToggle?: OnChangeFn<RowSelectionState>
}

export default function GoodsTable({goods, selected, onSelectedToggle}: Readonly<Props>) {
    const statusText: { [key: string]: string } = useMemo(() => ({
        'CREATED': 'Created',
        'WAITING_FOR_DELIVERY': 'Waiting for delivery',
        'WAITING_FOR_PAYMENT': 'Waiting for payment',
        'PAYED': 'Payed',
        'DELIVERED': 'Delivered',
        'CANCELED': 'Canceled',
        'RETURNED': 'Returned',
        'DELETED': 'Deleted',
    }), [])

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        [],
    )

    const columns = useMemo<ColumnDef<GoodData, any>[]>(
        () => [
            {
                id: 'select',
                header: ({table}) => (
                    <CheckboxInput
                        wrapperClassname={'flex items-center gap-x-3 cursor-pointer outline-none w-fit'}
                        checkboxClassname={'border-none w-6 h-6 outline-none'}
                        label={''}
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                    />
                ),
                cell: ({row}) => (
                    <CheckboxInput
                        wrapperClassname={'flex items-center gap-x-3 cursor-pointer outline-none w-fit'}
                        checkboxClassname={'border-none w-6 h-6 outline-none'}
                        label={''}
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                ),
            },
            {
                accessorFn: row => row.name,
                id: 'name',
                header: 'Name',
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
            {
                accessorFn: row => row.trackingNumber,
                id: 'trackingNumber',
                header: 'Tracking Number',
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.description,
                id: 'description',
                header: 'Description',
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
        ],
        [statusText],
    )

    const table = useReactTable({
        data: goods,
        getRowId: row => row.id,
        columns,
        state: {
            rowSelection: selected,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: onSelectedToggle,
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
            <div className={'min-h-[61.5rem]'}>
                <h3>Товары</h3>
                <table className={'w-full border-separate border-spacing-y-5'}>
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
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
                                )
                            })}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id} className={'cursor-pointer'}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id} className={'h-[1px]'}>
                                            <div className={clsx('flex items-center h-full p-5', {
                                                    'bg-blue text-white': cell.row.getIsSelected(),
                                                    'bg-white': !cell.row.getIsSelected(),
                                                },
                                            )}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
            <div className={'flex flex-row gap-4 justify-center'}>
                <div className={'flex flex-row gap-1'}>
                    {
                        Array.from({length: 5}, (_, i) => i - 2)
                            .map(relativePage => table.getState().pagination.pageIndex + relativePage)
                            .filter(pageIndex => pageIndex >= 0 && pageIndex < table.getPageCount())
                            .map(pageIndex => (
                                    <button
                                        className={clsx('w-8 h-8', {
                                            'bg-blue text-white rounded-md': pageIndex === table.getState().pagination.pageIndex,
                                            'text-black': pageIndex !== table.getState().pagination.pageIndex,
                                        })}
                                        type={'button'}
                                        key={pageIndex}
                                        onClick={() => table.setPageIndex(pageIndex)}
                                        disabled={pageIndex < 0 || pageIndex >= table.getPageCount()}
                                    >
                                        {pageIndex + 1}
                                    </button>
                                ),
                            )
                    }
                </div>
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
                : Array.from(column.getFacetedUniqueValues().keys()).sort((a, b) => a.localeCompare(b)),
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