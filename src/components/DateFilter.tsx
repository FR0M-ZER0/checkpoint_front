import React, { useState, useEffect, useRef } from 'react'
import { formatDate } from '../utils/formatter'

type DateFilterProps = {
  currentDate: string,
  onDateChange: (newDate: string) => void
}

function DateFilter({ currentDate, onDateChange }: DateFilterProps) {
    const [localDate, setLocalDate] = useState<string>(currentDate)
    const d: Date = new Date(localDate + 'T00:00:00')
    const dateInputRef = useRef<HTMLInputElement>(null)
    console.log(`O d é ${d}`)

    useEffect(() => {
        setLocalDate(currentDate)
    }, [currentDate])

    const handleDateClick = () => {
        dateInputRef.current?.showPicker()
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value
        setLocalDate(newDate)
        onDateChange(newDate)
    }

    const goBack = () => {
        const newDateObj = new Date(localDate)
        newDateObj.setDate(newDateObj.getDate() - 1)
        const formattedDate = newDateObj.toISOString().split('T')[0]
        setLocalDate(formattedDate)
        onDateChange(formattedDate)
    }

    const goForward = () => {
        const newDateObj = new Date(localDate)
        newDateObj.setDate(newDateObj.getDate() + 1)
        const formattedDate = newDateObj.toISOString().split('T')[0]
        setLocalDate(formattedDate)
        onDateChange(formattedDate)
    }

    const [dayName, setDayName] = useState<string>('')
    useEffect(() => {
        const diasDaSemana: Array<string> = [
            'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
            'quinta-feira', 'sexta-feira', 'sábado'
        ]        
        setDayName(diasDaSemana[d.getDay()])
    }, [localDate])

    return (
        <div className='flex justify-center items-center w-full text-center relative'>
            <i className="fa-solid fa-chevron-left text-xl cursor-pointer" onClick={goBack}></i>
            <div className='mx-8'>
                <p className='font-light'>{ formatDate(d) }</p>
                <p className='text-xl'>{ dayName }</p>
            </div>
            <i className="fa-solid fa-chevron-right text-xl cursor-pointer" onClick={goForward}></i>
            <input 
                type="date" 
                ref={dateInputRef}
                className="opacity-0 absolute right-[50px] w-[10px]"
                value={localDate}
                onChange={handleDateChange}
            />
            <i className="fa-solid fa-calendar-days text-2xl cursor-pointer absolute right-0" onClick={handleDateClick}></i>
        </div>
    )
}

export default DateFilter
