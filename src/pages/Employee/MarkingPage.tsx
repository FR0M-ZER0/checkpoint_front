import React, { useState, useEffect } from 'react'
import TemplateWithFilter from './TemplateWithFilter'
import Clock from '../../components/Clock'
import PointCard from '../../components/PointCard'
import Modal from '../../components/Modal'
import { formatDate, formatTime, formatTimeAndMinute } from '../../utils/formatter'
import api from '../../services/api'
import { toast } from 'react-toastify'

function MarkingPage() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [dayName, setDayName] = useState<string>('')
    const [currentTime, setCurrentTime] = useState<string>('')
    const [markingType, setMarkingType] = useState<string>('')
    const [markingStart, setMarkingStart] = useState<string>('')
    const [markingPause, setMarkingPause] = useState<string>('')
    const [markingResume, setMarkingResume] = useState<string>('')
    const [markingEnd, setMarkingEnd] = useState<string>('')
    const d: Date = new Date()

    const closeModal = (): void => {
        setIsModalVisible(false)
    }

    const openModal = (type: string): void => {
        setIsModalVisible(true)

        const now = new Date()
        setCurrentTime(formatTime(now))
        setMarkingType(type)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = {
            // TODO: mudar para o id do usuário autenticado
            colaboradorId: 8,
            tipo: markingType
        }

        try {
            await api.post('/marcacoes', data)
            closeModal()
            fetchTodayMarkings()
            toast.success('Marcação registrada')
        } catch (err) {
            toast.error("Você já fez essa marcação hoje")
        }
    }

    const fetchTodayMarkings = async () => {
        try {
            const response = await api.get(`/marcacoes/colaborador/${8}/hoje`)
            setMarkingStart(formatTimeAndMinute(response.data[0].dataHora))
            setMarkingPause(formatTimeAndMinute(response.data[1].dataHora))
            setMarkingResume(formatTimeAndMinute(response.data[2].dataHora))
            setMarkingEnd(formatTimeAndMinute(response.data[3].dataHora))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const diasDaSemana = [
            'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
            'quinta-feira', 'sexta-feira', 'sábado'
        ]        
        setDayName(diasDaSemana[d.getDay()])
    }, [])

    useEffect(() => {
        fetchTodayMarkings()
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
                <div onClick={() => openModal('ENTRADA')} className='mt-12'>
                    <PointCard
                        icon={
                            <i className="fa-solid fa-door-open text-6xl"></i>
                        }
                        period='Início'
                        time={markingStart}
                        color='main-green-color'
                    />
                </div>

                <div className='mt-4' onClick={() => openModal('PAUSA')}>
                    <PointCard
                        icon={
                            <i className="fa-solid fa-mug-hot text-6xl"></i>
                        }
                        period='Pausa'
                        time={markingPause}
                        color='main-blue-color'
                    />
                </div>

                <div className='mt-4' onClick={() => openModal('RETOMADA')}>
                    <PointCard
                        icon={
                            <i className="fa-solid fa-battery-full text-6xl"></i>
                        }
                        period='Retomada'
                        time={markingResume}
                        color='main-yellow-color'
                    />
                </div>

                <div className='mt-4' onClick={() => openModal('SAIDA')}>
                    <PointCard
                        icon={
                            <i className="fa-solid fa-door-closed text-6xl"></i>
                        }
                        period='Saída'
                        time={markingEnd}
                        color='main-red-color'
                    />
                </div>
            </main>
            {
                isModalVisible &&
                <Modal title='Marcar ponto' onClose={closeModal}>
                    <div className='mb-[60px]'>
                        <p>Registrar início: { currentTime }</p>
                    </div>

                    <form className='text-white w-full flex justify-between' onSubmit={(e) => handleSubmit(e)}>
                        <button className='main-func-color px-8 py-2 rounded-lg cursor-pointer' type='submit'>
                            Confirmar
                        </button>

                        <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer' onClick={closeModal}>
                            Cancelar
                        </button>
                    </form>
                </Modal>
            }
        </TemplateWithFilter>
    )
}

export default MarkingPage