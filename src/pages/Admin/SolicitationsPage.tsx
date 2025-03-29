import React, { useState } from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import Filter from '../../components/Filter'
import SortBy from '../../components/SortBy'
import AdminNotificationCard from '../../components/AdminNotificationCard'
import { RootState } from '../../redux/store'
import { useSelector } from 'react-redux'
import Modal from '../../components/Modal'
import { formatDate } from '../../utils/formatter'

function NotificationsPage() {
    const { solicitations } = useSelector((state: RootState) => state.solicitations)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [time, setTime] = useState<string>('')
    const [type, setType] = useState<string>('')
    const [period, setPeriod] = useState<string>('')

    const openModal = (horario: string, tipo: string, periodo: string): void => {
        setIsModalVisible(true)
        setTime(horario)
        setType(tipo)
        setPeriod(periodo)
    }

    const closeModal = (): void => {
        setIsModalVisible(false)
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
                        <div className='mb-4' onClick={() => openModal(solicitation.horario, solicitation.tipo, solicitation.periodo)}>
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
                    <form action="">
                        <p>Na marcação de: {period}</p>
                        <p>Tipo: {type === 'edicao' ? 'edição' : 'exclusão'}</p>

                        <div className='w-full flex flex-col items-center my-6'>
                            <p className='font-bold text-xl'>Horário</p>
                            <p className='quicksand text-lg'>{time.slice(0, 5)}</p>
                        </div>
                    </form>
                </Modal>
            }
        </TemplateWithTitle>
    )
}

export default NotificationsPage