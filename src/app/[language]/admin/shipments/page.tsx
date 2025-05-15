    'use client'

    import React, { useState, useEffect } from 'react'
    import { getShipments, getShipmentById, changeShipmentStatus, createSpedxOrder, getTrackingInfoByShipmentId } from '@/services/shipments'
    import { isError } from '@/app/lib/utils'

    // Translation mapping for statuses
    const statusTranslations: { [key: string]: string } = {
        // PENDING: 'В ожидании',
        WAITING_AT_THE_WAREHOUSE: 'Ожидает на складе',
        // DELIVERED: 'Доставлено',
        SENT_TO_KAZAKHSTAN: 'Отправлено в Казахстан',
        GOING_THROUGH_CUSTOMS: 'Проходит таможню',
        // RETURNED: 'Возвращено',
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
                setTrackingInfo(null) // Reset tracking info when viewing shipment details
            }
            setLoading(false)
        }

        // Fetch tracking info for a specific shipment
        async function handleSpedxShipmentClick(shipmentId: string) {
            setLoading(true)
            const response = await getTrackingInfoByShipmentId(shipmentId)
            console.log('Tracking info response:', response)
            if (isError(response)) {
                setError('Ошибка при загрузке информации о трекинге')
            } else {
                setTrackingInfo(response.data.order?.statusHistory?.statuses || [])
            }
            setLoading(false)
        }

        // Handle status change
        async function handleStatusChange() {
            if (!selectedShipment || !newStatus) return
            setLoading(true)
            const response = await changeShipmentStatus(selectedShipment.id, newStatus)
            if (isError(response)) {
                setError('Ошибка при изменении статуса')
            } else {
                alert('Статус успешно обновлен')
                const updatedShipments = shipments.map((shipment) =>
                    shipment.id === selectedShipment.id ? { ...shipment, status: newStatus } : shipment
                )
                setShipments(updatedShipments)
                setSelectedShipment({ ...selectedShipment, status: newStatus })
            }
            setLoading(false)
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

        // Handle row click to select a shipment
        function handleRowClick(shipment: any) {
            setSelectedShipment(shipment)
        }

        function reset() {
            setShowDetails(false);
            setTrackingInfo(null);
        }

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
                <div className={'md:p-2'}>
                    <button
                        onClick={() => reset()}
                        className={'text-blue-500 underline mb-4'}
                    >
                        Назад к деталям посылки
                    </button>
                    <div className={'bg-white p-6 rounded-lg shadow-md'}>
                        <h1 className={'text-xl font-bold mb-4'}>История трекинга</h1>
                        <ul className={'list-disc pl-6'}>
                            {trackingInfo.map((status: any, index: number) => (
                                <li key={index} className={'mb-4'}>
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
                <div className={'md:p-2'}>
                    <button
                        onClick={() => reset()}
                        className={'text-blue-500 underline mb-4'}
                    >
                        Назад к списку
                    </button>
                    <div className={'bg-white p-6 rounded-lg shadow-md'}>
                        <h1 className={'text-xl font-bold mb-4'}>Детали посылки</h1>
                    
                        <div className={'mt-6 mb-6'}>
                            <button
                                onClick={() => handleSpedxShipmentClick(selectedShipment.id)}
                                className={'bg-blue-500 text-white px-4 py-2 ml-2 rounded-md'}
                            >
                                Получить инфо SpedX
                            </button>
                        </div>
                        {selectedShipment && Object.entries(selectedShipment).map(([key, value]) => {
                            if (key === 'products' && Array.isArray(value)) {
                                return (
                                    <div key={key}>
                                        <p><strong>{fieldTranslations[key] || key}:</strong></p>
                                        <ul className={'list-disc pl-6'}>
                                            {value.map((product: any) => (
                                                <li key={product.id} className={'mb-4'}>
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
            <div className={'md:p-2'}>
                <h1 className={'text-xl font-bold mb-4'}>Посылки</h1>

                {/* Button to trigger handleShipmentClick */}
                

                {/* Actions for selected shipment */}
                {selectedShipment && (
                    <div className={'mb-4 p-4 bg-gray-100 rounded-md'}>
                        <div className="flex flex-row gap-6 items-center">
                            <h2 className={'text-lg font-bold mb-2'}>Выбранная посылка: {selectedShipment.orderNumber}</h2>
                        <div className={'mb-4'}>
                                <button
                                    onClick={() => handleShipmentClick(selectedShipment.id)}
                                    className={'text-blue px-0 pt-2 rounded-md'}
                                >
                                    Показать детали
                                </button>
                        </div>
                        </div>
                        
                        <div className={'flex items-center'}>
                            
                            <label htmlFor="status" className={'block font-bold mr-2'}>
                                Изменить статус:
                            </label>
                            <select
                                id="status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className={'border border-gray-300 rounded-md px-4 py-2 mr-4'}
                            >
                                <option value="">Выберите статус</option>
                                {Object.keys(statusTranslations).map((status) => (
                                    <option key={status} value={status}>
                                        {statusTranslations[status]}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleStatusChange}
                                className={'bg-blue-500 text-white px-4 py-2 rounded-md mr-4'}
                            >
                                Обновить статус
                            </button>
                            <button
                                onClick={handleCreateOrder}
                                className={'bg-green-500 text-white px-4 py-2 rounded-md'}
                            >
                                Создать заказ
                            </button>
                            
                        </div>
                        
                    </div>
                )}

                {/* Table of shipments */}
                <table className={'table-auto w-full border-collapse border border-gray-300'}>
                    <thead>
                        <tr className={'bg-gray-100'}>
                            <th className={'border border-gray-300 px-4 py-2'}>Номер заказа</th>
                            <th className={'border border-gray-300 px-4 py-2'}>Номер отслеживания</th>
                            <th className={'border border-gray-300 px-4 py-2'}>Отправитель</th>
                            <th className={'border border-gray-300 px-4 py-2'}>Получатель</th>
                            <th className={'border border-gray-300 px-4 py-2'}>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.map((shipment: any) => (
                            <tr
                                key={shipment.id}
                                className={` cursor-pointer ${
                                    selectedShipment?.id === shipment.id ? 'bg-blue-100' : ''
                                }`}
                                onClick={() => handleRowClick(shipment)}
                            >
                                <td className={'border border-gray-300 px-4 py-2'}>{shipment.orderNumber}</td>
                                <td className={'border border-gray-300 px-4 py-2'}>{shipment.trackingNumber}</td>
                                <td className={'border border-gray-300 px-4 py-2'}>
                                    {shipment.senderCompany} ({shipment.senderPerson})
                                </td>
                                <td className={'border border-gray-300 px-4 py-2'}>
                                    {shipment.receiverPerson} ({shipment.receiverPhone})
                                </td>
                                <td className={'border border-gray-300 px-4 py-2'}>
                                    {statusTranslations[shipment.status] || shipment.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }