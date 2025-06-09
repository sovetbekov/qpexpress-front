'use client'

import React, { useState, useEffect } from 'react'
import { getShipments, getShipmentById, changeShipmentStatus, createSpedxOrder, createPickupRequest, getTrackingInfoByShipmentId } from '@/services/shipments'
import { isError } from '@/app/lib/utils'
import ShipmentUpdateForm from './ShipmentUpdateForm'

// Translation mapping for statuses
const statusTranslations: { [key: string]: string } = {
    AT_PICKUP_POINT: 'В пункте выдачи',
    WAITING_AT_THE_WAREHOUSE: 'Ожидает на складе',
    DELIVERED: 'Доставлено',
    SENT_TO_KAZAKHSTAN: 'Отправлено в Казахстан',
    GOING_THROUGH_CUSTOMS: 'Проходит таможню',
    DELIVERING: 'Доставляется',
    // Add more statuses as needed
}

// Translation mapping for field names
const fieldTranslations: { [key: string]: string } = {
    id: 'ID',
    createdAt: 'Дата создания',
    sendDate: 'Дата отправки',
    updatedAt: 'Дата обновления',
    orderNumber: 'Номер заказа',
    trackingNumber: 'Номер отслеживания',
    senderCompany: 'Компания отправителя',
    senderPerson: 'Контактное лицо отправителя',
    senderPhone: 'Телефон отправителя',
    senderTown: 'Город отправителя',
    senderAddress: 'Адрес отправителя',
    receiverPerson: 'Получатель',
    receiverPhone: 'Телефон получателя',
    receiverEmail: 'Email получателя',
    receiverTown: 'Город получателя',
    receiverAddress: 'Адрес получателя',
    receiverInn: 'ИНН получателя',
    zipCode: 'Почтовый индекс',
    products: 'Продукты',
    quantity: 'Количество',
    price: 'Цена',
    status: 'Статус',
    isDeleted: 'Удалено',
    enclosure: 'Вложение',
    labelNumber: 'Номер этикетки',
    spedxOrderResponseNumber: 'Номер ответа Spedx',
}

export default function Page() {
    const [shipments, setShipments] = useState<any[]>([])
    const [selectedShipment, setSelectedShipment] = useState<any | null>(null)
    const [trackingInfo, setTrackingInfo] = useState<any | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [newStatus, setNewStatus] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false)
    const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([])

    // Fetch all shipments on component mount
    useEffect(() => {
        async function fetchShipments() {
            setLoading(true)
            const response = await getShipments()
            if (isError(response)) {
                setError('Ошибка при загрузке списка посылок')
            } else {
                setShipments(response.data)
            }
            setLoading(false)
        }
        fetchShipments()
    }, [])

    // Fetch details of a specific shipment
    async function handleShipmentClick(shipmentId: string) {
        setLoading(true)
        setShowDetails(true)
        const response = await getShipmentById(shipmentId)
        if (isError(response)) {
            setError('Ошибка при загрузке данных о посылке')
        } else {
            setSelectedShipment(response.data)
            setTrackingInfo(null)
        }
        setLoading(false)
    }

    // Fetch tracking info for a specific shipment
    async function handleSpedxShipmentClick(shipmentId: string) {
        setLoading(true)
        const response = await getTrackingInfoByShipmentId(shipmentId)
        if (isError(response)) {
            setError('Ошибка при загрузке информации о трекинге')
        } else {
            setTrackingInfo(response.data.order?.statusHistory?.statuses || [])
        }
        setLoading(false)
    }

    // Handle status change for multiple shipments
    async function handleStatusChange() {
        if (!selectedShipmentIds.length || !newStatus) return
        setLoading(true)
        let errorOccurred = false
        const updatedShipments = [...shipments]
        for (const id of selectedShipmentIds) {
            const response = await changeShipmentStatus(id, newStatus)
            if (isError(response)) {
                errorOccurred = true
            } else {
                const idx = updatedShipments.findIndex(s => s.id === id)
                if (idx !== -1) updatedShipments[idx].status = newStatus
            }
        }
        setShipments(updatedShipments)
        setLoading(false)
        if (errorOccurred) {
            setError('Ошибка при изменении статуса одной или нескольких посылок')
        } else {
            alert('Статус успешно обновлен для выбранных посылок')
        }
    }

    // Handle create Spedx order
    async function handleCreateOrder() {
        if (!selectedShipment) return
        setLoading(true)
        const response = await createSpedxOrder(selectedShipment.id)
        if (isError(response)) {
            setError(`Ошибка при создании заказа: ${response.error}`)
        } else {
            alert(`Заказ успешно создан!`)
        }
        setLoading(false)
    }

    // Handle create pick order
    async function handlePickupRequest() {
        if (!selectedShipment) return
        setLoading(true)
        console.log(selectedShipment.id)

        const response = await createPickupRequest(selectedShipment.id)
            if (isError(response)) {
            setError(`Ошибка при создании заявки на забор: ${response.error}`)
        } else {
            alert(`Заявка на забор успешно создан!`)
        }
        setLoading(false)
    }

    // Handle row click to select a shipment
    function handleRowClick(shipment: any) {
        setSelectedShipment(shipment)
    }

    // Handle checkbox selection for bulk actions
    function handleCheckboxChange(id: string) {
        setSelectedShipmentIds(prev =>
            prev.includes(id)
                ? prev.filter(sid => sid !== id)
                : [...prev, id]
        )
    }

    function toDisplayDate(apiDate?: string | [string, string, string]) {
        if (!apiDate) return ''
        if (Array.isArray(apiDate) && apiDate.length === 3) {
        // [yyyy, mm, dd] -> dd.mm.yyyy with zero-padding
        let [yyyy, mm, dd] = apiDate
        if (mm.toString().length === 1) mm = '0' + mm
        if (dd.toString().length === 1) dd = '0' + dd
        return `${dd}.${mm}.${yyyy}`
        }
        if (typeof apiDate === 'string') {
        const [date] = apiDate.split('T')
        const parts = date.split('-')
        if (parts.length === 3) {
            let [yyyy, mm, dd] = parts
            if (mm.toString().length === 1) mm = '0' + mm
            if (dd.toString().length === 1) dd = '0' + dd
            return `${dd}.${mm}.${yyyy}`
        }
        return apiDate // fallback
        }
        return ''
    }

    function reset() {
        setShowDetails(false)
        setTrackingInfo(null)
    }

    // Filtered shipments
    const filteredShipments = statusFilter
        ? shipments.filter((shipment) => shipment.status === statusFilter)
        : shipments

    // Render loading state
    if (loading) {
        return <div>Загрузка...</div>
    }

    // Render error state
    if (error) {
        return <div>{error}</div>
    }

    // Render tracking info if available
    if (trackingInfo) {
        return (
            <div className="md:p-2">
                <button
                    onClick={() => reset()}
                    className="text-blue-500 underline mb-4"
                >
                    Назад к деталям посылки
                </button>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-4">История трекинга</h1>
                    <ul className="list-disc pl-6">
                        {trackingInfo.map((status: any, index: number) => (
                            <li key={index} className="mb-4">
                                <p><strong>Событие:</strong> {status.title}</p>
                                <p><strong>Сообщение:</strong> {status.message}</p>
                                <p><strong>Время:</strong> {status.eventTime}</p>
                                <p><strong>Местоположение:</strong> {status.eventTown}, {status.country}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    // Render shipment details if a shipment is selected
    if (showDetails) {
        return (
            <div className="md:p-2">
                <button
                    onClick={() => reset()}
                    className="text-blue-500 underline mb-4"
                >
                    Назад к списку
                </button>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold mb-4">Детали посылки</h1>
                    <div className="mt-6 mb-6">
                        <button
                            onClick={() => handleSpedxShipmentClick(selectedShipment.id)}
                            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md"
                        >
                            Получить инфо SpedX
                        </button>
                    </div>
                    {selectedShipment && Object.entries(selectedShipment).map(([key, value]) => {
                        if (key === 'products' && Array.isArray(value)) {
                            return (
                                <div key={key}>
                                    <p><strong>{fieldTranslations[key] || key}:</strong></p>
                                    <ul className="list-disc pl-6">
                                        {value.map((product: any) => (
                                            <li key={product.id} className="mb-4">
                                                <p><strong>ID:</strong> {product.id}</p>
                                                <p><strong>Название:</strong> {product.name}</p>
                                                <p><strong>Описание:</strong> {product.description}</p>
                                                <p><strong>Количество:</strong> {product.quantity}</p>
                                                <p><strong>Цена:</strong> {product.price}</p>
                                                <p><strong>Вес:</strong> {product.weight}</p>
                                                <p><strong>Штрихкод:</strong> {product.barCode}</p>
                                                <p><strong>HS-код:</strong> {product.hsCode}</p>
                                                <p><strong>Удалено:</strong> {product.isDeleted ? 'Да' : 'Нет'}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        }
                        return (
                            <p key={key}>
                                <strong>{fieldTranslations[key] || key}:</strong>{' '}
                                {Array.isArray(value) ? JSON.stringify(value) : String(value)}
                            </p>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="md:p-2 overflow-x-auto">
            <h1 className="text-xl font-bold mb-4">Посылки</h1>

            {selectedShipment && showUpdateForm && (
                <ShipmentUpdateForm
                    shipment={selectedShipment}
                    onUpdated={(updated) => {
                        setSelectedShipment(updated)
                        setShowUpdateForm(false)
                        // Optionally update shipments list here
                    }}
                    onCancel={() => setShowUpdateForm(false)}
                />
            )}

            {/* Status filter dropdown */}
            <div className="mb-4 mt-4 flex flex-wrap items-center gap-4">
                <label htmlFor="statusFilter" className="font-bold">
                    Фильтр по статусу:
                </label>
                <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2"
                >
                    <option value="">Все</option>
                    {Object.keys(statusTranslations).map((status) => (
                        <option key={status} value={status}>
                            {statusTranslations[status]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="w-full overflow-x-auto" style={{ maxHeight: '90vh' }}>
                <div
                    className="min-w-[1000px] max-w-full"
                    style={{
                        overflowY: 'auto',
                        overflowX: 'auto',
                        position: 'relative',
                        height: '60vh',
                        background: '#fff',
                        borderRadius: '0.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        padding: '1rem',
                    }}
                >
                    {/* Actions for selected shipment */}
                    {selectedShipment && (
                        <div
                            className="mb-4 p-4 bg-gray-100 rounded-md z-10"
                            style={{
                                position: 'sticky',
                                top: 0,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            }}
                        >
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                                {selectedShipmentIds.length < 2 && (
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <h2 className="text-lg font-bold mb-2 md:mb-0">
                                            Выбранная посылка: {selectedShipment.orderNumber}
                                        </h2>
                                        <div className='ml-2'>
                                            <button
                                                onClick={() => handleShipmentClick(selectedShipment.id)}
                                                className="text-blue px-0 pt-0 rounded-md"
                                            >
                                                Показать детали
                                            </button>
                                        </div>
                                        {selectedShipment && !showUpdateForm && (
                                            <div>
                                                <button onClick={() => setShowUpdateForm(true)} className="text-blue px-0 pt-0 rounded-md">
                                                    Редактировать
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4">
                                  
                                <div className="">
                                      <label htmlFor="status" className="block font-bold mr-1 mb-1">
                                    Изменить статус:
                                </label>
                                <select
                                    id="status"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="border border-gray-300 rounded-md px-4 py-2 mr-4"
                                >
                                    <option value="">Выберите статус</option>
                                    {Object.keys(statusTranslations).map((status) => (
                                        <option key={status} value={status}>
                                            {statusTranslations[status]}
                                        </option>
                                    ))}
                                </select>
                                </div>
                                <div className="flex flex-row gap-4 mt-4">
                                    <button
                                        onClick={() => {
                                            setSelectedShipmentIds([selectedShipment.id])
                                            handleStatusChange()
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md "
                                        disabled={!newStatus}
                                    >
                                        Обновить статус
                                    </button>
                                    <button
                                    onClick={handleCreateOrder}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                >
                                    Создать заказ
                                </button>
                                <button
                                    onClick={handlePickupRequest}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                >
                                    Подать заявку на забор
                                </button>
                                </div>
                            </div>
                            
                        </div>
                    )}

                    {/* Table of shipments */}
                    <div className="overflow-x-auto w-full h-full">
                        <table className="table-auto w-full min-w-[1000px] border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={filteredShipments.length > 0 && selectedShipmentIds.length === filteredShipments.length}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setSelectedShipmentIds(filteredShipments.map(s => s.id))
                                                } else {
                                                    setSelectedShipmentIds([])
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">Номер заказа</th>
                                    <th className="border border-gray-300 px-4 py-2">Номер отслеживания</th>
                                    <th className="border border-gray-300 px-4 py-2">Отправитель</th>
                                    <th className="border border-gray-300 px-4 py-2">Получатель</th>
                                    <th className="border border-gray-300 px-4 py-2">Статус</th>
                                    <th className="border border-gray-300 px-4 py-2">Сервис</th>
                                    <th className="border border-gray-300 px-4 py-2">Дата забора</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShipments.map((shipment: any) => (
                                    <tr
                                        key={shipment.id}
                                        className={`cursor-pointer ${
                                            selectedShipmentIds.includes(shipment.id) ? 'bg-blue-100' : ''
                                        }`}
                                        onClick={() => handleRowClick(shipment)}
                                    >
                                        <td className="border border-gray-300 px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedShipmentIds.includes(shipment.id)}
                                                onChange={e => {
                                                    e.stopPropagation()
                                                    handleCheckboxChange(shipment.id)
                                                }}
                                            />
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{shipment.orderNumber}</td>
                                        <td className="border border-gray-300 px-4 py-2">{shipment.trackingNumber}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {shipment.senderCompany} ({shipment.senderPerson})
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {shipment.receiverPerson} ({shipment.receiverPhone})
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {statusTranslations[shipment.status] || shipment.status}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{shipment.service}</td>
                                        <td className="border border-gray-300 px-4 py-2">{toDisplayDate(shipment.pickupDate!)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}