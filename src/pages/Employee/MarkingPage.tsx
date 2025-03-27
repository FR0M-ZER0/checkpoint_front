<<<<<<< HEAD
import React, { useState, useEffect, FormEvent } from 'react'
=======
import React, { useState, useEffect } from 'react'
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
import TemplateWithFilter from './TemplateWithFilter'
import Clock from '../../components/Clock'
import PointCard from '../../components/PointCard'
import Modal from '../../components/Modal'
<<<<<<< HEAD
import { formatDate, formatTime, formatTimeAndMinute } from '../../utils/formatter'
import api from '../../services/api'
import { toast } from 'react-toastify'
=======
import { formatDate } from '../../utils/formatter'
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)

function MarkingPage() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [dayName, setDayName] = useState<string>('')
<<<<<<< HEAD
    const [currentTime, setCurrentTime] = useState<string>('')
    const [markingType, setMarkingType] = useState<string>('')
    const [markingStart, setMarkingStart] = useState<string>('')
    const [markingPause, setMarkingPause] = useState<string>('')
    const [markingResume, setMarkingResume] = useState<string>('')
    const [markingEnd, setMarkingEnd] = useState<string>('')
=======
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
    const d: Date = new Date()

    const closeModal = (): void => {
        setIsModalVisible(false)
    }

<<<<<<< HEAD
    const openModal = (type: string): void => {
        setIsModalVisible(true)

        const now: Date = new Date()
        setCurrentTime(formatTime(now))
        setMarkingType(type)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        const data = {
            // TODO: mudar para o id do usuário autenticado
            colaboradorId: 9,
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
            const response = await api.get(`/marcacoes/colaborador/${9}/hoje`)
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
=======
    const openModal = (): void => {
        setIsModalVisible(true)
    }

    useEffect(() => {
        const diasDaSemana = [
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
            'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
            'quinta-feira', 'sexta-feira', 'sábado'
        ]        
        setDayName(diasDaSemana[d.getDay()])
    }, [])

<<<<<<< HEAD
    useEffect(() => {
        fetchTodayMarkings()
    }, [])

=======
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
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
<<<<<<< HEAD
                <div onClick={() => openModal('ENTRADA')} className='mt-12'>
=======
                <div onClick={openModal} className='mt-12'>
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                    <PointCard
                        icon={
                            <i className="fa-solid fa-door-open text-6xl"></i>
                        }
                        period='Início'
<<<<<<< HEAD
                        time={markingStart}
=======
                        time='08:00'
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                        color='main-green-color'
                    />
                </div>

<<<<<<< HEAD
                <div className='mt-4' onClick={() => openModal('PAUSA')}>
=======
                <div className='mt-4' onClick={openModal}>
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                    <PointCard
                        icon={
                            <i className="fa-solid fa-mug-hot text-6xl"></i>
                        }
                        period='Pausa'
<<<<<<< HEAD
                        time={markingPause}
=======
                        time='12:00'
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                        color='main-blue-color'
                    />
                </div>

<<<<<<< HEAD
                <div className='mt-4' onClick={() => openModal('RETOMADA')}>
=======
                <div className='mt-4' onClick={openModal}>
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                    <PointCard
                        icon={
                            <i className="fa-solid fa-battery-full text-6xl"></i>
                        }
                        period='Retomada'
<<<<<<< HEAD
                        time={markingResume}
=======
                        time='13:00'
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                        color='main-yellow-color'
                    />
                </div>

<<<<<<< HEAD
                <div className='mt-4' onClick={() => openModal('SAIDA')}>
=======
                <div className='mt-4' onClick={openModal}>
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                    <PointCard
                        icon={
                            <i className="fa-solid fa-door-closed text-6xl"></i>
                        }
                        period='Saída'
<<<<<<< HEAD
                        time={markingEnd}
=======
                        time='18:00'
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                        color='main-red-color'
                    />
                </div>
            </main>
            {
                isModalVisible &&
                <Modal title='Marcar ponto' onClose={closeModal}>
                    <div className='mb-[60px]'>
<<<<<<< HEAD
                        <p>Registrar início: { currentTime }</p>
                    </div>

                    <form className='text-white w-full flex justify-between' onSubmit={(e) => handleSubmit(e)}>
                        <button className='main-func-color px-8 py-2 rounded-lg cursor-pointer' type='submit'>
=======
                        <p>Registrar início: 02h:08min</p>
                    </div>

                    <div className='text-white w-full flex justify-between'>
                        <button className='main-func-color px-8 py-2 rounded-lg cursor-pointer'>
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                            Confirmar
                        </button>

                        <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer' onClick={closeModal}>
                            Cancelar
                        </button>
<<<<<<< HEAD
                    </form>
=======
                    </div>
>>>>>>> ad9c352 (Adiciona página de login das roles Employee e Admin)
                </Modal>
            }
        </TemplateWithFilter>
    )
}

export default MarkingPage