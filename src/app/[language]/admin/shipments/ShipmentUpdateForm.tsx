import React, { useEffect, useState } from 'react'
import { updateShipment } from '@/services/shipments'

export default function ShipmentUpdateForm({ shipment, onUpdated, onCancel }: {
  shipment: any,
  onUpdated?: (updated: any) => void,
  onCancel?: () => void
}) {
  const [form, setForm] = useState({ ...shipment })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pickupDateInput, setPickupDateInput] = useState(
    toDisplayDate(form.pickupDate)
  )

  useEffect(() => {
    setPickupDateInput(toDisplayDate(form.pickupDate))
  }, [form.pickupDate])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: value }))
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

  function toApiDate(displayDate: string): string {
    // from dd.mm.yyyy to yyyy-MM-dd
    const [dd, mm, yyyy] = displayDate.split('.')
    return `${yyyy}-${mm}-${dd}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
     console.log('Updating shipment with data:', form)
      const updated = await updateShipment(form.id, form)
      if (onUpdated) onUpdated(updated)
      alert('Данные посылки обновлены! Пожалуйста, обновите страницу для отображения изменений.')
    } catch (err: any) {
      setError('Ошибка при обновлении посылки')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-xl">
      <h2 className="text-lg font-bold mb-4">Редактировать посылку</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <input name="orderNumber" value={form.orderNumber || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Номер заказа" />
        <input name="trackingNumber" value={form.trackingNumber || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Номер отслеживания" />
        <input name="senderCompany" value={form.senderCompany || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Компания отправителя" />
        <input name="senderPerson" value={form.senderPerson || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Контактное лицо отправителя" />
        <input name="senderPhone" value={form.senderPhone || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Телефон отправителя" />
        <input name="senderTown" value={form.senderTown || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Город отправителя" />
        <input name="senderAddress" value={form.senderAddress || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Адрес отправителя" />
        <input name="receiverPerson" value={form.receiverPerson || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Получатель" />
        <input name="receiverPhone" value={form.receiverPhone || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Телефон получателя" />
        <input name="receiverEmail" value={form.receiverEmail || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Email получателя" />
        <input name="receiverTown" value={form.receiverTown || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Город получателя" />
        <input name="receiverAddress" value={form.receiverAddress || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Адрес получателя" />
        <input name="receiverInn" value={form.receiverInn || ''} onChange={handleChange} className="border p-2 rounded" placeholder="ИНН получателя" />
        <input name="zipCode" value={form.zipCode || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Почтовый индекс" />
        <input name="quantity" type="number" value={form.quantity || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Количество" />
        <input name="price" type="number" value={form.price || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Цена" />
        <input name="enclosure" value={form.enclosure || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Вложение" />
        <input name="labelNumber" value={form.labelNumber || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Номер этикетки" />
        <input name="service" value={form.service || ''} onChange={handleChange} className="border p-2 rounded" placeholder="Сервис доставки" />
        <input
          name="pickupDate"
          value={pickupDateInput}
          onChange={e => {
            const val = e.target.value
            setPickupDateInput(val)
            if (val.length === 10 && /^\d{2}\.\d{2}\.\d{4}$/.test(val)) {
              setForm((prev: any) => ({
                ...prev,
                pickupDate: toApiDate(val)
              }))
            }
          }}
          className="border p-2 rounded"
          placeholder="Дата забора"
          pattern="\d{2}\.\d{2}\.\d{4}"
        />

      </div>
      <div className="flex gap-4 mt-6">
        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? 'Сохраняем...' : 'Сохранить'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
            Отмена
          </button>
        )}
      </div>
    </form>
  )
}