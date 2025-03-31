import React, { useState, useEffect, FormEvent } from 'react'
import TemplateWithFilter from './TemplateWithFilter'
import DateFilter from '../../components/DateFilter'
import HoursState from '../../components/HoursState'
import PointButton from '../../components/PointButton'
import SquareButton from '../../components/SquareButton'
import Modal from '../../components/Modal'
import api from '../../services/api'
import { formatStringToTime } from '../../utils/formatter'
import { calculateWorkTime } from '../../utils/comparisons'
import { toast } from 'react-toastify'

function DayPage() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [modalType, setModalType] = useState<string>('')
    const [markingStart, setMarkingStart] = useState<string>('')
    const [markingPause, setMarkingPause] = useState<string>('')
    const [markingResume, setMarkingResume] = useState<string>('')
    const [markingEnd, setMarkingEnd] = useState<string>('')
    const [markingStartId, setMarkingStartId] = useState<string>('')
    const [markingPauseId, setMarkingPauseId] = useState<string>('')
    const [markingResumeId, setMarkingResumeId] = useState<string>('')
    const [markingEndId, setMarkingEndId] = useState<string>('')
    const [doneTimeStart, setDonetimeStart] = useState<string>('')
    const [doneTimePause, setDonetimePause] = useState<string>('')
    const [doneTimeResume, setDonetimeResume] = useState<string>('')
    const [horario, setHorario] = useState<string>('')
    const [observacao, setObservacao] = useState<string>('')
    const [markingId, setMarkingId] = useState<string>('')
    const [periodo, setPeriodo] = useState<string>('')
    const [userId, setUserId] = useState<string|null>('')

    const openModal = (type: string, id: string, marcacaoPeriodo: string): void => {
        setIsModalVisible(true)
        setModalType(type)
        setMarkingId(id)
        setPeriodo(marcacaoPeriodo)
    }

    const closeModal = (): void => {
        setIsModalVisible(false)
        setObservacao('')
        setHorario('')
    }

    const getCurrentDate = (): string => {
        const today = new Date()
        const year = today.getFullYear()
        const month = (today.getMonth() + 1).toString().padStart(2, '0')
        const day = today.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }
    const [currentDate, setCurrentDate] = useState<string>(getCurrentDate())

    const fetchDate = async (selectedDate: string): Promise<void> => {
        try {
            const response = await api.get(`/marcacoes/colaborador/${userId}/data/${selectedDate}`)
            setMarkingStart(formatStringToTime(response.data[0].dataHora))
            setMarkingStartId(response.data[0].id)

            setMarkingPause(formatStringToTime(response.data[1].dataHora))
            setMarkingPauseId(response.data[1].id)

            setMarkingResume(formatStringToTime(response.data[2].dataHora))
            setMarkingResumeId(response.data[2].id)

            setMarkingEnd(formatStringToTime(response.data[3].dataHora))
            setMarkingEndId(response.data[3].id)

            setDonetimeStart(calculateWorkTime(response.data[0].dataHora, response.data[1].dataHora))
            setDonetimePause(calculateWorkTime(response.data[1].dataHora, response.data[2].dataHora))
            setDonetimeResume(calculateWorkTime(response.data[2].dataHora, response.data[3].dataHora))
        } catch (err: unknown) {
            console.error(err)
        }
    }

    const handleDateChange = (newDate: string) => {
        setCurrentDate(newDate)
    }

    const handleModalSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        const formData = {
            marcacaoId: markingId,
            periodo,
            tipo: modalType === 'edit' ? 'edicao' : 'exclusao',
            status: 'pendente',
            observacao,
            horario
        }

        try {
            await api.post('/ajuste-ponto/solicitacao', formData)
            toast.success('Solicitação de ajuste enviado')
            closeModal()
        } catch (err: unknown) {
            console.error(err)
            toast.error('Um erro aconteceu')
        }
    }

    useEffect(() => {
        fetchDate(currentDate)
        setUserId(localStorage.getItem('id'))
    }, [currentDate, userId])
    return (
        <TemplateWithFilter filter={
            <DateFilter onDateChange={handleDateChange}/>
        }>
            <div className='mt-4 w-full'>
                <HoursState/>
            </div>

            <main className='w-full mt-8'>
                <div>
                    <div className='w-full flex justify-between items-center mb-[100px]'>
                        <div className='flex items-center'>
                            <div className='w-[80px] h-[80px] relative'>
                                <PointButton color='main-green-color' icon={
                                    <i className="fa-solid fa-door-open text-3xl"></i>
                                }/>
                                <div className='absolute w-[4px] h-[110px] top-[80px] right-1/2 z-[-1] gray-line-color'></div>
                                <div className='text-[12px] light-gray-text absolute top-[100px] w-[400px] left-[50px]'>
                                    <p className='font-medium'>Realizado por</p>
                                    <p className='font-light'>{doneTimeStart}</p>
                                </div>
                            </div>
                            <div className='ml-2'>
                                <p className='text-lg'>Início</p>
                                <p className='font-light text-sm'>{markingStart}</p>
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('edit', markingStartId, 'inicio')}>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('delete', markingStartId, 'inicio')}>
                                <SquareButton
                                    text='Exclusão'
                                    icon={
                                        <i className="fa-solid fa-trash text-white"></i>
                                    }
                                    color='btn-red-color'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex justify-between items-center mb-[100px]'>
                        <div className='flex items-center'>
                            <div className='w-[80px] h-[80px] relative'>
                                <PointButton color='main-blue-color' icon={
                                    <i className="fa-solid fa-mug-hot text-3xl"></i>
                                }/>
                                <div className='absolute w-[4px] h-[110px] top-[80px] right-1/2 z-[-1] gray-line-color'></div>
                                <div className='text-[12px] light-gray-text absolute top-[100px] w-[400px] left-[50px]'>
                                    <p className='font-medium'>Realizado por</p>
                                    <p className='font-light'>{doneTimePause}</p>
                                </div>
                            </div>
                            <div className='ml-2'>
                                <p className='text-lg'>Pausa</p>
                                <p className='font-light text-sm'>{markingPause}</p>
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('edit', markingPauseId, 'pausa')}>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('delete', markingPauseId, 'pausa')}>
                                <SquareButton
                                    text='Exclusão'
                                    icon={
                                        <i className="fa-solid fa-trash text-white"></i>
                                    }
                                    color='btn-red-color'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex justify-between items-center mb-[100px]'>
                        <div className='flex items-center'>
                            <div className='w-[80px] h-[80px] relative'>
                                <PointButton color='main-yellow-color' icon={
                                    <i className="fa-solid fa-battery-full text-3xl"></i>
                                }/>
                                <div className='absolute w-[4px] h-[110px] top-[80px] right-1/2 z-[-1] gray-line-color'></div>
                                <div className='text-[12px] light-gray-text absolute top-[100px] w-[400px] left-[50px]'>
                                    <p className='font-medium'>Realizado por</p>
                                    <p className='font-light'>{doneTimeResume}</p>
                                </div>
                            </div>
                            <div className='ml-2'>
                                <p className='text-lg'>Retomada</p>
                                <p className='font-light text-sm'>{markingResume}</p>
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('edit', markingResumeId, 'retomada')}>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('delete', markingResumeId, 'retomada')}>
                                <SquareButton
                                    text='Exclusão'
                                    icon={
                                        <i className="fa-solid fa-trash text-white"></i>
                                    }
                                    color='btn-red-color'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex justify-between items-center mb-[100px]'>
                        <div className='flex items-center'>
                            <div className='w-[80px] h-[80px]'>
                            <PointButton color='main-red-color' icon={
                                <i className="fa-solid fa-door-closed text-3xl"></i>
                            }/>
                            </div>
                            <div className='ml-2'>
                                <p className='text-lg'>Saída</p>
                                <p className='font-light text-sm'>{markingEnd}</p>
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('edit', markingEndId, 'saida')}>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('delete', markingEndId, 'saida')}>
                                <SquareButton
                                    text='Exclusão'
                                    icon={
                                        <i className="fa-solid fa-trash text-white"></i>
                                    }
                                    color='btn-red-color'
                                />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>

            {
                isModalVisible &&
                <Modal title={`Solicitar ${modalType === 'edit' ? 'ajuste' : 'exclusão'}`} onClose={closeModal}>
                    <form onSubmit={handleModalSubmit}>
                        {
                            modalType === 'edit' &&
                            <div className='mb-4'>
                                <label htmlFor="markingTime">Horário</label>
                                <input type="time" name="markingTime" className='w-full main-background-color' value={horario} onChange={e => setHorario(e.target.value)}/>
                            </div>
                        }
                        <div className='mb-[60px]'>
                            <label htmlFor="observation">Observação</label>
                            <textarea name="observation" rows={5} className='main-background-color block w-full p-2 rounded shadow-md' value={observacao} onChange={e => setObservacao(e.target.value)}></textarea>
                        </div>

                        <div className='text-white flex justify-between'>
                            <button className='main-func-color px-8 py-2 rounded-lg mr-4 cursor-pointer'>
                                Confirmar
                            </button>

                            <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer' onClick={closeModal}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </Modal>
            }
        </TemplateWithFilter>
    )
}

export default DayPage