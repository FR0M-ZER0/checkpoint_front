import React, { useState, useEffect } from 'react'
import TemplateWithFilter from './TemplateWithFilter'
import Clock from '../../components/Clock'
import PointCard from '../../components/PointCard'
import Modal from '../../components/Modal'
import { formatDate } from '../../utils/formatter'

function MarkingPage() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [dayName, setDayName] = useState<string>('')
    const d: Date = new Date()

    const closeModal = (): void => {
        setIsModalVisible(false)
    }

    const openModal = (): void => {
        setIsModalVisible(true)
    }

    useEffect(() => {
        const diasDaSemana = [
            'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
            'quinta-feira', 'sexta-feira', 'sábado'
        ]        
        setDayName(diasDaSemana[d.getDay()])
    }, [])

    return (
        <TemplateWithFilter
            filter={
                <div className='flex w-full flex-col text-center justify-center'>
                    <p className='font-light'>{ formatDate(d) }</p>
                    <p className='text-xl'>{ dayName }</p>
                </div>
            }
        >
            <main className='w-full flex-col text-center'>
                <Clock/>
                <div onClick={openModal} className='mt-12'>
                    <PointCard
                        icon={
                            <i className="fa-solid fa-door-open text-6xl"></i>
                        }
                        period='Início'
                        time='08:00'
                        color='main-green-color'
                    />
                </div>

                <div className='mt-4' onClick={openModal}>
                    <PointCard
                        icon={
                            <i className="fa-solid fa-mug-hot text-6xl"></i>
                        }
                        period='Pausa'
                        time='12:00'
                        color='main-blue-color'
                    />
                </div>

                <div className='mt-4' onClick={openModal}>
                    <PointCard
                        icon={
                            <i className="fa-solid fa-battery-full text-6xl"></i>
                        }
                        period='Retomada'
                        time='13:00'
                        color='main-yellow-color'
                    />
                </div>

                <div className='mt-4' onClick={openModal}>
                    <PointCard
                        icon={
                            <i className="fa-solid fa-door-closed text-6xl"></i>
                        }
                        period='Saída'
                        time='18:00'
                        color='main-red-color'
                    />
                </div>
            </main>
            {
                isModalVisible &&
                <Modal title='Marcar ponto' onClose={closeModal}>
                    <div className='mb-[60px]'>
                        <p>Registrar início: 02h:08min</p>
                    </div>

                    <div className='text-white'>
                        <button className='main-func-color px-8 py-2 rounded-lg mr-4 cursor-pointer'>
                            Confirmar
                        </button>

                        <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer' onClick={closeModal}>
                            Cancelar
                        </button>
                    </div>
                </Modal>
            }
        </TemplateWithFilter>
    )
}

export default MarkingPage