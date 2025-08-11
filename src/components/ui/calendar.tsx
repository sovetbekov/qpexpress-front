"use client"

import React, { useState, useEffect } from 'react'

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  className?: string
}

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  minDate,
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)

  useEffect(() => {
    setSelectedDate(value)
  }, [value])

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Make Monday = 0
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    
    if (minDate) {
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
      const newDateOnly = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
      if (newDateOnly < minDateOnly) {
        return
      }
    }
    
    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  const isDateDisabled = (day: number) => {
    if (!minDate) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return dateOnly < minDateOnly
  }

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return date.toDateString() === selectedDate.toDateString()
  }

  const isToday = (day: number) => {
    const today = new Date()
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return date.toDateString() === today.toDateString()
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2"></div>
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day)
      const isSelected = isDateSelected(day)
      const isTodayDate = isToday(day)

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={`
            p-2 text-sm rounded-lg transition-all duration-200 hover:bg-green-100 
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
            ${isSelected 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'text-gray-700 hover:text-green-700'
            }
            ${isTodayDate && !isSelected 
              ? 'bg-green-50 border border-green-300' 
              : ''
            }
            ${isDisabled 
              ? 'text-gray-300 cursor-not-allowed hover:bg-transparent hover:text-gray-300' 
              : 'cursor-pointer'
            }
          `}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm p-4 w-80 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ChevronLeftIcon />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  )
}

export default Calendar