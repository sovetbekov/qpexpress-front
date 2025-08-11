"use client"

import React, { useState, useRef, useEffect } from 'react'
import Calendar from './calendar'

interface DatePickerProps {
  value?: string // yyyy-mm-dd format
  onChange?: (date: string) => void // yyyy-mm-dd format
  placeholder?: string
  minDate?: Date
  className?: string
  disabled?: boolean
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Выберите дату",
  minDate,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    return value ? new Date(value) : undefined
  })
  const containerRef = useRef<HTMLDivElement>(null)

  // Convert date to yyyy-mm-dd format
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Format date for display (dd.mm.yyyy)
  const formatDateForDisplay = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  useEffect(() => {
    setSelectedDate(value ? new Date(value) : undefined)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    const formattedDate = formatDateForInput(date)
    console.log('DatePicker sending formatted date:', formattedDate); // Debug log
    onChange?.(formattedDate)
    setIsOpen(false)
  }

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div
        onClick={handleInputClick}
        className={`
          w-full border rounded-md px-3 py-2 text-sm cursor-pointer transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          ${disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
            : 'bg-white border-green-300 hover:border-green-400'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
            {selectedDate ? formatDateForDisplay(selectedDate) : placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2">
          <Calendar
            value={selectedDate}
            onChange={handleDateSelect}
            minDate={minDate}
            className="shadow-lg"
          />
        </div>
      )}
    </div>
  )
}

export default DatePicker