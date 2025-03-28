import React, { useState, useEffect, useRef } from 'react'
import { formatDate } from '../utils/formatter'

function DateFilter({ onDateChange }: { onDateChange: (newDate: string) => void }) {
    // Estamos pegando o dia de amanhã porque por algum motivo ele mostra o dia de hoje como se fosse o de ontem (deve ser por causa do fuso horário)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0]
    
    const [dayName, setDayName] = useState<string>('')
    const [currentDate, setCurrentDate] = useState<string>(tomorrowFormatted)
    const d: Date = new Date(currentDate)
    const dateInputRef = useRef<HTMLInputElement>(null)

    const handleDateClick = () => {
        dateInputRef.current?.showPicker()
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value
        setCurrentDate(newDate)
        onDateChange(newDate)
    }

    const goBack = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() - 1)
        const newDate2 = new Date(currentDate)
        newDate2.setDate(newDate2.getDate() - 2)
        const formattedDate = newDate.toISOString().split('T')[0]
        const formattedDate2 = newDate2.toISOString().split('T')[0]
        // Por algum motivo ele sempre está pegando um dia após o anterior, por isso a necessidade do formattedDate2, que ajusta para ele pegar dois dias antes
        setCurrentDate(formattedDate)
        onDateChange(formattedDate2)
    }

    const goForward = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() + 1)
        const newDate2 = new Date(currentDate)
        newDate2.setDate(newDate2.getDate())
        const formattedDate = newDate.toISOString().split('T')[0]
        const formattedDate2 = newDate2.toISOString().split('T')[0]
        // Mesmo coisa com o que está acontecendo acima
        setCurrentDate(formattedDate)
        onDateChange(formattedDate2)
    }

    useEffect(() => {
        const diasDaSemana: Array<string> = [
            'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
            'quinta-feira', 'sexta-feira', 'sábado'
        ]        
        setDayName(diasDaSemana[d.getDay()])
    }, [currentDate])

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
                value={currentDate}
                onChange={handleDateChange}
            />
            <i className="fa-solid fa-calendar-days text-2xl cursor-pointer absolute right-0" onClick={handleDateClick}></i>
        </div>
    )
}

export default DateFilter
