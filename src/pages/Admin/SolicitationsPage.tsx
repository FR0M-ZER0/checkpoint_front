import React, { FormEvent, useState } from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import Filter from '../../components/Filter'
import SortBy from '../../components/SortBy'
import AdminNotificationCard from '../../components/AdminNotificationCard'
import { RootState } from '../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import Modal from '../../components/Modal'
import { formatDate } from '../../utils/formatter'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { removeSolicitation } from '../../redux/slices/solicitationSlice'

function NotificationsPage() {
    const { solicitations } = useSelector((state: RootState) => state.solicitations)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [time, setTime] = useState<string>('')
    const [type, setType] = useState<string>('')
    const [period, setPeriod] = useState<string>('')
    const [markingId, setMarkingId] = useState<string>('')
    const [solicitationId, setSolicitationId] = useState<string>('')
    const dispatch = useDispatch()

    const openModal = (horario: string, tipo: string, periodo: string, marcacaoId: string, solicitacaoId: string): void => {
        setIsModalVisible(true)
        setTime(horario)
        setType(tipo)
        setPeriod(periodo)
        setMarkingId(marcacaoId)
        setSolicitationId(solicitacaoId)
    }

    const closeModal = (): void => {
        setIsModalVisible(false)
    }

    const handleAccept = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        try {
            await api.put(`/ajuste-ponto/solicitacao/${solicitationId}`, {status: 'aceito'})

            if (type === 'edicao') {
                await api.put(`/marcacoes/${markingId}/horario`, {novoHorario: time})
            } else {
                await api.delete(`/marcacoes/${markingId}`)
            }

            toast.success('Ajuste realizado com sucesso')
            dispatch(removeSolicitation(solicitationId))
            closeModal()
        } catch (err: unknown) {
            console.error(err)
        }
    }

    const handleReject = async (): Promise<void> => {
        try {
            await api.put(`/ajuste-ponto/solicitacao/${solicitationId}`, {status: 'aceito'})
            closeModal()
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <TemplateWithTitle title='Solicitações'>
            <div>
                <div className='mt-6'>
                    <Filter/>
                </div>

                <div className='mt-4'>
                    <SortBy/>
                </div>
            </div>

            <div className='mt-8'>
                {
                    solicitations.map(solicitation => (
                        <div className='mb-4' onClick={() => openModal(solicitation.horario, solicitation.tipo, solicitation.periodo, solicitation.marcacaoId, solicitation.id)}>
                            <AdminNotificationCard
                                name='Func. 1'
                                date={formatDate(solicitation.criadoEm)}
                                type='Ajuste de ponto'
                                period={solicitation.periodo}
                                observation={solicitation.observacao}
                            />
                        </div>
                    ))
                }
            </div>

            {
                isModalVisible &&
                <Modal title='Solicitação para ajuste no ponto' onClose={closeModal}>
                    <form onSubmit={handleAccept}>
                        <p>Na marcação de: {period}</p>

                        {
                            type === 'edicao' &&
                            <p>Edição no horário do ponto</p>
                        }

                        {
                            type === 'exclusao' &&
                            <div className='flex justify-center my-8'>
                                <p className='font-bold main-red-text text-xl'>
                                    Exclusão do ponto
                                </p>
                            </div>
                        }

                        {
                            time &&
                            <div className='w-full flex flex-col items-center my-8'>
                                <p className='font-bold text-xl'>Horário</p>
                                <p className='quicksand text-lg'>{time.slice(0, 5)}</p>
                            </div>
                        }

                        <div className='text-white flex justify-between'>
                            <button className='main-func-color px-8 py-2 rounded-lg mr-4 cursor-pointer'>
                                Aceitar
                            </button>

                            <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer' onClick={handleReject}>
                                Rejeitar
                            </button>
                        </div>
                    </form>
                </Modal>
            }
        </TemplateWithTitle>
    )
}

export default NotificationsPage