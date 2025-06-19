'use client'

import React, { InputHTMLAttributes, useEffect, useMemo, useState } from 'react'
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    PaginationState,
    Table,
    useReactTable
} from '@tanstack/react-table'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { OrderData, ShipterServiceErrorResponse, ShipterServiceSuccessResponse } from '@/types/entities'
import { createShipterServiceOrder } from '@/services/orders'
import { isShipterServiceSuccess } from '@/utils/typeGuards'

// Combined type that can be either success or error
type ShipterServiceResponse = ShipterServiceSuccessResponse | ShipterServiceErrorResponse;

// Assuming you have a ServerActionResponse type, but if not, here's a basic version
type ServerActionResponse<T> = {
    status: 'success';
    data: T;
} | {
    status: 'error';
    error: Record<string, string[]>;
};

type Props = {
    orders: OrderData[],
}

export default function OrdersTable({ orders }: Readonly<Props>) {
    const router = useRouter()
    const statusText: { [key: string]: string } = useMemo(() => ({
        'CREATED': 'Created',
        'IN_THE_WAY': 'In the way',
        'IN_YOUR_COUNTRY': 'In your country',
        'IN_MAIL_OFFICE': 'In mail office',
        'DELIVERED': 'Delivered',
        'DELETED': 'Deleted',
    }), [])

    // States for Shipter Service functionality
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
    } | null>(null)

    // Table state management - Fixed: Use consistent state management
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    // Fixed: Memoize columns with stable dependencies
    const columns = useMemo<ColumnDef<OrderData, any>[]>(() => [
        {
            accessorFn: row => `${row.recipient.firstName} ${row.recipient.lastName}`,
            id: 'recipientName',
            header: 'Получатель',
            cell: info => info.getValue(),
            footer: props => props.column.id,
        },
        {
            accessorFn: row => row.orderNumber,
            id: 'orderNumber',
            header: 'Номер заказа',
            cell: info => info.getValue(),
            footer: props => props.column.id,
        },
        {
            accessorFn: row => `${statusText[row.status ?? 'NO_STATUS']}`,
            id: 'status',
            header: 'Статус',
            cell: info => info.getValue(),
            footer: props => props.column.id,
        },
        {
            accessorFn: row => convertToTraditionalDate(row.createdAt),
            id: 'createdAt',
            header: 'Дата создания',
            cell: info => info.getValue(),
            footer: props => props.column.id,
            sortingFn: (a, b) => {
                const dateA = new Date(a.original.createdAt[0], a.original.createdAt[1] - 1, a.original.createdAt[2], a.original.createdAt[3], a.original.createdAt[4], a.original.createdAt[5], a.original.createdAt[6] / 1e6);
                const dateB = new Date(b.original.createdAt[0], b.original.createdAt[1] - 1, b.original.createdAt[2], b.original.createdAt[3], b.original.createdAt[4], b.original.createdAt[5], b.original.createdAt[6] / 1e6);
                return +dateA - +dateB;
            },
        },
        {
            id: 'actions',
            header: 'Действия',
            cell: ({ row }) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        router.push(`/admin/orders/${row.original.id}`);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                    Открыть
                </button>
            ),
            enableSorting: false,
            enableColumnFilter: false,
        },
    ], [statusText]) // Fixed: Removed router from dependencies

    // Fixed: Add data stability check
    const stableData = useMemo(() => orders, [orders])

    const table = useReactTable({
        data: stableData, // Use stable data reference
        columns,
        state: {
            columnFilters,
            pagination
        },
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // Fixed: Add manual pagination to prevent auto-reset
        manualPagination: false,
        // Fixed: Ensure pagination doesn't reset when data changes
        autoResetPageIndex: false,
    })

    // Fixed: Reset pagination only when data actually changes (not on every render)
    const previousOrdersLength = useMemo(() => orders.length, [orders.length])
    useEffect(() => {
        // Only reset pagination if the number of orders significantly changed
        const currentLength = orders.length
        if (Math.abs(currentLength - previousOrdersLength) > 0) {
            // Check if current page would be empty, then reset to first page
            const maxPageIndex = Math.max(0, Math.ceil(currentLength / pagination.pageSize) - 1)
            if (pagination.pageIndex > maxPageIndex) {
                setPagination(prev => ({ ...prev, pageIndex: 0 }))
            }
        }
    }, [orders.length, previousOrdersLength, pagination.pageIndex, pagination.pageSize])

    // Handler for row selection
    const handleRowClick = (orderId: string, event: React.MouseEvent) => {
        if (event.shiftKey) {
            // Shift+click for multi-selection
            event.preventDefault();
            setSelectedOrderIds(prev => {
                if (prev.includes(orderId)) {
                    // Remove if already selected
                    return prev.filter(id => id !== orderId);
                } else {
                    // Add to selection
                    return [...prev, orderId];
                }
            });
        } else if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
            // Regular click for single selection
            setSelectedOrderIds(prev => {
                if (prev.length === 1 && prev[0] === orderId) {
                    // Deselect if clicking the same single selected item
                    return [];
                } else {
                    // Select only this item
                    return [orderId];
                }
            });
        }
    };

    // Handler for creating Shipter service orders (now handles multiple orders)
    const handleCreateShipterOrder = async () => {
        if (selectedOrderIds.length === 0) return
        
        setLoading(true)
        setNotification(null)
        
        try {
            // Process multiple orders
            const results = await Promise.allSettled(
                selectedOrderIds.map(orderId => createShipterServiceOrder(orderId))
            );
            
            let successCount = 0;
            let errors: string[] = [];
            let successDetails: string[] = [];
            
            results.forEach((result, index) => {
                const orderId = selectedOrderIds[index];
                
                if (result.status === 'rejected') {
                    errors.push(`Заказ ${orderId}: ${result.reason}`);
                    return;
                }
                
                const serverResponse = result.value;
                
                // Handle server action response wrapper
                if (serverResponse.status === 'error') {
                    const errorMessages = Object.values(serverResponse.error).flat().join(', ');
                    errors.push(`Заказ ${orderId}: ${errorMessages}`);
                    return;
                }
                
                // Now handle the actual Shipter service response
                const response: ShipterServiceResponse = serverResponse.data;
                
                if (isShipterServiceSuccess(response)) {
                    successCount++;
                    const orderDetails = response.data2[0];
                    if (orderDetails?.TrackingNo && orderDetails?.ReceiptNum) {
                        successDetails.push(`Заказ ${orderId}: Трекинг ${orderDetails.TrackingNo}, Квитанция ${orderDetails.ReceiptNum}`);
                    } else {
                        successDetails.push(`Заказ ${orderId}: успешно создан`);
                    }
                } else {
                    const errorMessage = response.data2[0]?.ErrMsgs?.join(', ') || response.data;
                    errors.push(`Заказ ${orderId}: ${errorMessage}`);
                }
            });
            
            // Show results notification
            if (successCount > 0 && errors.length === 0) {
                const successMessage = successDetails.length > 0 
                    ? `Успешно создано ${successCount} заказов:\n${successDetails.join('\n')}`
                    : `Успешно создано ${successCount} заказов в Shipter`;
                    
                setNotification({
                    message: successMessage,
                    type: 'success'
                });
                // Clear selection after successful creation
                setSelectedOrderIds([]);
            } else if (successCount > 0 && errors.length > 0) {
                const combinedMessage = `Создано ${successCount} заказов. ${successDetails.length > 0 ? `Успешные:\n${successDetails.join('\n')}\n` : ''}Ошибки: ${errors.join('; ')}`;
                setNotification({
                    message: combinedMessage,
                    type: 'info'
                });
            } else {
                setNotification({
                    message: `Ошибки при создании заказов: ${errors.join('; ')}`,
                    type: 'error'
                });
            }
        } catch (error) {
            setNotification({
                message: `Общая ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Auto-hide notification after 7 seconds (increased for longer messages)
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 7000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    return (
        <div className={'w-full min-h-[50rem] flex flex-col justify-between gap-y-2 p-4 md:p-10 bg-gray rounded-3xl'}>
            {/* Notification display */}
            {notification && (
                <div 
                    className={`mb-4 p-3 rounded-md border-l-4 ${
                        notification.type === 'success' 
                            ? 'bg-green-50 border-green-400 text-green-800' 
                            : notification.type === 'error'
                                ? 'bg-red-50 border-red-400 text-red-800'
                                : 'bg-blue-50 border-blue-400 text-blue-800'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{notification.message}</pre>
                        <button 
                            className="text-lg leading-none hover:opacity-70 ml-3 flex-shrink-0" 
                            onClick={() => setNotification(null)}
                            aria-label="Close notification"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-lg md:text-2xl font-semibold mb-2">Заказы</h3>
                {/* Instructions for users */}
                <p className="text-sm text-gray-600 mb-4">
                    Кликните для выбора заказа, Shift+клик для выбора нескольких заказов, используйте кнопку Открыть для просмотра деталей.
                </p>
                
                {/* Action buttons when orders are selected */}
                {selectedOrderIds.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                        <p className="text-sm text-blue-700 mb-2">
                            Выбрано заказов: {selectedOrderIds.length}
                            {selectedOrderIds.length <= 3 && (
                                <span className="block text-xs text-blue-600 mt-1">
                                    ID: {selectedOrderIds.join(', ')}
                                </span>
                            )}
                        </p>
                        <div className="flex flex-row gap-2">
                            <button
                                onClick={handleCreateShipterOrder}
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {loading ? 'Создание...' : `Создать ${selectedOrderIds.length} заказ${selectedOrderIds.length > 1 ? 'ов' : ''} Shipter`}
                            </button>
                            <button
                                onClick={() => setSelectedOrderIds([])}
                                className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Отменить выбор
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className={'w-full border-separate border-spacing-y-5'}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <th key={header.id} className="text-left">
                                                <div className={'flex flex-col gap-y-1'}>
                                                    <div className="font-medium text-gray-700">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                    <div className={'flex justify-start'}>
                                                        {header.column.getCanFilter() ? (
                                                            <div>
                                                                <Filter column={header.column} table={table} />
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr 
                                    key={row.id} 
                                    className={clsx('cursor-pointer transition-colors', {
                                        'bg-blue-50': selectedOrderIds.includes(row.original.id)
                                    })}
                                    onClick={(e) => handleRowClick(row.original.id, e)}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className={'h-[1px]'}>
                                            <div className={clsx('flex items-center h-full p-2 md:p-5 bg-white transition-colors', {
                                                'justify-start rounded-l-full': cell.column.id === 'recipientName',
                                                'justify-end rounded-r-full': cell.column.id === 'actions',
                                                'justify-center': cell.column.id === 'actions',
                                                'bg-blue-100': selectedOrderIds.includes(row.original.id)
                                            })}>
                                                <div className={'text-sm md:text-base'}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination controls */}
                <div className={'flex flex-wrap justify-center items-center gap-2 mt-5'}>
                    <button
                        className={'border rounded p-2 hover:bg-gray-50 disabled:opacity-50'}
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className={'border rounded p-2 hover:bg-gray-50 disabled:opacity-50'}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className={'border rounded p-2 hover:bg-gray-50 disabled:opacity-50'}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className={'border rounded p-2 hover:bg-gray-50 disabled:opacity-50'}
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                    <span className={'flex items-center gap-1 text-sm'}>
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </strong>
                    </span>
                    <span className={'flex items-center gap-1 text-sm'}>
                        | Go to page:
                        <input
                            type={'number'}
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                            className={'border p-1 rounded w-16 text-center'}
                        />
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                        className="border rounded p-1"
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemValue = row.getValue(columnId)
  return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
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

    return typeof firstValue === 'number' ? (
        <div className={'flex space-x-2'}>
            <DebouncedInput
                type={'number'}
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
                className={'w-24 border shadow rounded p-1'}
            />
            <DebouncedInput
                type={'number'}
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
                className={'w-24 border shadow rounded p-1'}
            />
        </div>
    ) : (
        <DebouncedInput
            type={'text'}
            value={(columnFilterValue ?? '') as string}
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
            className={'w-36 border shadow rounded p-1'}
        />
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
    }, [value, onChange, debounce])

    return (
        <input
            {...props}
            value={value}
            onChange={e => setValue(e.target.value)}
        />
    )
}

function convertToTraditionalDate(createdAt: number[]): string {
    // Using array destructuring to get individual date components
    const [year, month, day, hours, minutes, seconds] = createdAt;
    
    // JavaScript months are 0-indexed, so subtract 1 from the month
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    
    // Format the date to a readable string
    const formattedDate = new Intl.DateTimeFormat('ru', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
    
    return formattedDate;
}