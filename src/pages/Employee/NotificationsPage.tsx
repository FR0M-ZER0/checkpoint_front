import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import TemplateWithTitle from './TemplateWithTitle'
import NotificationCard from '../../components/NotificationCard'
import { formatDate } from '../../utils/formatter'
import Modal from '../../components/Modal'
import { markNotificationAsRead, Notification } from '../../redux/slices/notificationSlice'
import { useDispatch } from 'react-redux'
import { markResponseAsRead, Response } from '../../redux/slices/responseSlice'
import { getNotificationStyles } from '@/utils/notificationStyle'

function NotificationsPage() {
    const { notifications } = useSelector((state: RootState) => state.notifications)
    const { responses } = useSelector((state: RootState) => state.responses)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [selectedNotification, setSelectedNotification] = useState<null | {
        tipo: string
        mensagem: string
        criadoEm: string
    }>(null)
    const dispatch = useDispatch()

    const openModal = async (notification: Notification|Response, type: string): Promise<void> => {
        setSelectedNotification(notification)
        setIsModalVisible(true)

        try {
            if (type === 'notificação') dispatch(markNotificationAsRead(notification.id))
            if (type === 'resposta') dispatch(markResponseAsRead(notification.id))
            console.log('Notificação lida')
        } catch(err: unknown) {
            console.error(err)
        }
    }

    const closeModal = (): void => {
        setSelectedNotification(null)
        setIsModalVisible(false)
    }
    
    return (
        <TemplateWithTitle title='Notificações'>
            <div className='mt-5 w-full'>
                {
                    responses
                    .filter(response => !response.lida)
                    .map(response => (
                        <div className='mb-3'>
                            <NotificationCard 
                                title={response.tipo}
                                message={response.mensagem}
                                date={formatDate(response.criadoEm)}
                                color={'main-blue-color'}
                                openModal={() => openModal(response, 'resposta')}
                            />
                        </div>
                    ))
                }
                {
                    notifications
                        .filter(notification => !notification.lida)
                        .map(notification => {
                            const { background, text } = getNotificationStyles(notification.tipo)
                            return (
                                <div className='mb-3' key={notification.id}>
                                    <NotificationCard 
                                        title={notification.tipo === 'falta' ? 'Você recebeu uma falta' : `Pedido de ${notification.tipo}`}
                                        message={notification.mensagem}
                                        date={formatDate(notification.criadoEm)}
                                        color={`${background} ${text}`}
                                        openModal={() => openModal(notification, 'notificação')}
                                    />
                                </div>
                            )
                        })
                }
            </div>

            {
                isModalVisible &&
                <Modal title={selectedNotification?.tipo === 'falta' ? `Você recebeu uma falta` : `Pedido de ${selectedNotification?.tipo}`} onClose={closeModal}>
                    <div>
                        <p className='mb-2'>{selectedNotification?.mensagem}</p>
                        <p className='text-sm light-gray-text'>{formatDate(selectedNotification ? selectedNotification?.criadoEm : '')}</p>
                    </div>
                </Modal>
            }
        </TemplateWithTitle>
    )
}

export default NotificationsPage