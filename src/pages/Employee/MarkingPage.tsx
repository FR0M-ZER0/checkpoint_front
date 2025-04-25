import React, { useState, useEffect, FormEvent } from 'react'
import TemplateWithFilter from './TemplateWithFilter'
import Clock from '../../components/Clock'
import PointCard from '../../components/PointCard'
import Modal from '../../components/Modal'
import { formatDate, formatTime, formatTimeAndMinute } from '../../utils/formatter'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { useMediaQuery } from '../../utils/hooks'

function MarkingPage() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [dayName, setDayName] = useState<string>('')
    const [currentTime, setCurrentTime] = useState<string>('')
    const [markingType, setMarkingType] = useState<string>('')
    const [markingStart, setMarkingStart] = useState<string>('')
    const [markingPause, setMarkingPause] = useState<string>('')
    const [markingResume, setMarkingResume] = useState<string>('')
    const [markingEnd, setMarkingEnd] = useState<string>('')
    const [userId, setUserId] = useState<string|null>('')
    const d: Date = new Date()
    const isDesktop = useMediaQuery('(min-width: 768px)')

    const closeModal = (): void => {
        setIsModalVisible(false)
    }

    const openModal = (type: string): void => {
        setIsModalVisible(true)

        const now: Date = new Date()
        setCurrentTime(formatTime(now))
        setMarkingType(type)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        const data = {
            colaboradorId: userId,
            tipo: markingType
        }

        try {
            await api.post('/marcacoes', data)
            closeModal()
            fetchTodayMarkings()
            toast.success('Marcação registrada')
        } catch (err: unknown) {
            console.error(err)
            toast.error("Você já fez essa marcação hoje")
        }
    }

    const fetchTodayMarkings = async (): Promise<void> => {
        try {
            const response = await api.get(`/marcacoes/colaborador/${userId}/hoje`)
            setMarkingStart(formatTimeAndMinute(response.data[0].dataHora))
            setMarkingPause(formatTimeAndMinute(response.data[1].dataHora))
            setMarkingResume(formatTimeAndMinute(response.data[2].dataHora))
            setMarkingEnd(formatTimeAndMinute(response.data[3].dataHora))
        } catch (err: unknown) {
            console.error(err)
        }
    }

    useEffect(() => {
        const diasDaSemana: string[] = [
            'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
            'quinta-feira', 'sexta-feira', 'sábado'
        ]        
        setDayName(diasDaSemana[d.getDay()])
    }, [])

    useEffect(() => {
        fetchTodayMarkings()
        setUserId(localStorage.getItem('id'))
    }, [userId])

    return (
        <TemplateWithFilter
            showFilter={!isDesktop}
            filter={
                <div className='flex w-full flex-col text-center justify-center'>
                    <p className='font-light'>{ formatDate(d) }</p>
                    <p className='text-xl'>{ dayName }</p>
                </div>
            }
        >
            <main className='w-full min-h-screen flex flex-col items-center md:justify-center text-center md:px-4'>
                <div className='md:flex hidden w-full flex-col text-center justify-center'>
                    <p className='font-light text-lg'>{ formatDate(d) }</p>
                    <p className='text-2xl'>{ dayName }</p>
                </div>
                <Clock/>

                <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl'>
                    <div onClick={() => openModal('ENTRADA')}>
                        <PointCard
                            icon={<i className="fa-solid fa-door-open text-6xl"></i>}
                            period='Início'
                            time={markingStart}
                            color='main-green-color'
                        />
                    </div>

                    <div onClick={() => openModal('PAUSA')}>
                        <PointCard
                            icon={<i className="fa-solid fa-mug-hot text-6xl"></i>}
                            period='Pausa'
                            time={markingPause}
                            color='main-blue-color'
                        />
                    </div>

                    <div onClick={() => openModal('RETOMADA')}>
                        <PointCard
                            icon={<i className="fa-solid fa-battery-full text-6xl"></i>}
                            period='Retomada'
                            time={markingResume}
                            color='main-yellow-color'
                        />
                    </div>

                    <div onClick={() => openModal('SAIDA')}>
                        <PointCard
                            icon={<i className="fa-solid fa-door-closed text-6xl"></i>}
                            period='Saída'
                            time={markingEnd}
                            color='main-red-color'
                        />
                    </div>
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