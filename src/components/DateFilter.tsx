import React, { useState, useEffect, useRef } from 'react'
import { formatDate } from '../utils/formatter'

function DateFilter() {
    const [dayName, setDayName] = useState<string>('')
    const d: Date = new Date()
    const dateInputRef = useRef<HTMLInputElement>(null)

    const handleDateClick = () => {
        dateInputRef.current?.showPicker()
    }

    useEffect(() => {
        const diasDaSemana: Array<string> = [
            'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
            'quinta-feira', 'sexta-feira', 'sábado'
        ]        
        setDayName(diasDaSemana[d.getDay()])
    }, [])

    return (
        <div className='flex justify-center items-center w-full text-center relative'>
            <i className="fa-solid fa-chevron-left text-xl"></i>
            <div className='mx-8'>
                <p className='font-light'>{ formatDate(d) }</p>
                <p className='text-xl'>{ dayName }</p>
            </div>
            <i className="fa-solid fa-chevron-right text-xl"></i>
            <input 
                type="date" 
                ref={dateInputRef}
                className="opacity-0 absolute right-0"
            />
            <i className="fa-solid fa-calendar-days text-2xl cursor-pointer absolute right-0" onClick={handleDateClick}></i>
        </div>
    )
}

export default DateFilter