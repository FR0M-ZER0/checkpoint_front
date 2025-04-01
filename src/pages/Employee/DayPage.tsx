import React, { useState, useEffect, FormEvent, ReactNode } from 'react'
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
import { useParams } from 'react-router'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function DayPage() {
    const [loading, setLoading] = useState<boolean>(true)
    const [dayType, setDayType] = useState<string>('')
    const [faltaDetails, setFaltaDetails] = useState<string>('')

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

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [modalType, setModalType] = useState<string>('')
    const [markingId, setMarkingId] = useState<string>('')
    const [periodo, setPeriodo] = useState<string>('')
    const [horario, setHorario] = useState<string>('')
    const [observacao, setObservacao] = useState<string>('')

    const [userId, setUserId] = useState<string | null>('')
    const getCurrentDate = (): string => {
        const today = new Date()
        const year = today.getFullYear()
        const month = (today.getMonth() + 1).toString().padStart(2, '0')
        const day = today.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }
    const { date } = useParams<{ date: string }>()
    const [currentDate, setCurrentDate] = useState<string>(date || getCurrentDate())

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

    const fetchDate = async (selectedDate: string): Promise<void> => {
        if (!userId) return
        try {
            const response = await api.get(`/dias-trabalho/${userId}/${selectedDate}`)
            const data = response.data
            setDayType(data.tipo)
            if(data.tipo === 'normal'){
                if(data.marcacoes && data.marcacoes.length === 4) {
                    setMarkingStart(formatStringToTime(data.marcacoes[0].dataHora))
                    setMarkingStartId(data.marcacoes[0].id)

                    setMarkingPause(formatStringToTime(data.marcacoes[1].dataHora))
                    setMarkingPauseId(data.marcacoes[1].id)

                    setMarkingResume(formatStringToTime(data.marcacoes[2].dataHora))
                    setMarkingResumeId(data.marcacoes[2].id)

                    setMarkingEnd(formatStringToTime(data.marcacoes[3].dataHora))
                    setMarkingEndId(data.marcacoes[3].id)

                    setDonetimeStart(calculateWorkTime(data.marcacoes[0].dataHora, data.marcacoes[1].dataHora))
                    setDonetimePause(calculateWorkTime(data.marcacoes[1].dataHora, data.marcacoes[2].dataHora))
                    setDonetimeResume(calculateWorkTime(data.marcacoes[2].dataHora, data.marcacoes[3].dataHora))
                }
            } else {
                setMarkingStart('')
                setMarkingPause('')
                setMarkingResume('')
                setMarkingEnd('')
                setDonetimeStart('')
                setDonetimePause('')
                setDonetimeResume('')
                if(data.tipo === 'falta' && data.detalhes) {
                    setFaltaDetails(data.detalhes.tipoFalta)
                } else {
                    setFaltaDetails('')
                }
            }
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
            toast.success('Solicitação de ajuste enviada')
            closeModal()
        } catch (err: unknown) {
            console.error(err)
            toast.error('Um erro aconteceu')
        }
    }

    useEffect(() => {
        setUserId(localStorage.getItem('id'))
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await fetchDate(currentDate)
            setLoading(false)
        }

        if (userId) {
            setLoading(true)
            fetchData()
        }
    }, [currentDate, userId])

    if(dayType !== 'normal'){
        let message = ''
        if(dayType === 'ferias') message = 'Você estava de férias neste dia'
        else if(dayType === 'folga') message = 'Você folgou neste dia'
        else if(dayType === 'falta') message = `Você se ${faltaDetails === 'Atraso' ? 'atrasou' :  'ausentou'} neste dia`
        else message = 'Não há dados registrados neste dia'
        
        let circleColor: string = ''
        if(dayType === 'folga') circleColor = 'main-orange-color'
        else if(dayType === 'ferias') circleColor = 'dark-green-color'
        else if(dayType === 'falta') circleColor = 'main-red-color'
        else circleColor = 'bg-gray-500'

        let icon: ReactNode
        if(dayType === 'folga') icon = <i className="fa-solid fa-bed opacity-50"></i>
        else if(dayType === 'ferias') icon = <i className="fa-solid fa-plane opacity-50"></i>
        else if(dayType === 'falta') icon = <i className="fa-solid fa-briefcase-medical opacity-50"></i>
        else circleColor = 'hidden'

        return (
            <TemplateWithFilter filter={<DateFilter currentDate={currentDate} onDateChange={handleDateChange}/>}>{
                loading ? 
                <>
                    <div className='flex justify-between w-full mt-4'>
                        <div>
                            <p className=''><Skeleton width={100} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                            <p className='text-sm light-gray-text'><Skeleton width={100} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                        </div>
                        <div>
                            <p className='dark-green-text'><Skeleton width={100} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                            <p className='text-sm light-gray-text'><Skeleton width={100} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                        </div>
                        <div>
                            <p className='dark-green-text'><Skeleton width={100} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                            <p className='text-sm light-gray-text'><Skeleton width={100} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                        </div>
                    </div>

                    <div className='w-full flex justify-evenly'>
                        <div className='flex flex-col'>
                            <div>
                                <Skeleton width={80} height={80} baseColor="#dedede" highlightColor="#c5c5c5" count={4} />     
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex'>
                                <Skeleton width={80} height={80} baseColor="#dedede" highlightColor="#c5c5c5" count={4} />     
                                <Skeleton width={80} height={80} baseColor="#dedede" highlightColor="#c5c5c5" count={4} />     
                            </div>
                        </div>
                    </div>
                </>
                :
                <div className="flex flex-col justify-center items-center" style={{minHeight: '100vw'}}>
                    <div className={`h-[100px] w-[100px] rounded-full flex justify-center items-center ${circleColor} text-4xl`}>
                        {icon}
                    </div>
                    <p className="mt-2">{message}</p>
                </div>
            }
            </TemplateWithFilter>
        )
    }

    return (
        <TemplateWithFilter filter={<DateFilter currentDate={currentDate} onDateChange={handleDateChange}/>}>
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