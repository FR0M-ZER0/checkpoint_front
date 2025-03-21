import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import TemplateWithTitle from './TemplateWithTitle'
import NotificationCard from '../../components/NotificationCard'
import { formatDate } from '../../utils/formatter'
import Modal from '../../components/Modal'
import { Notification } from '../../redux/slices/notificationSlice'

function NotificationsPage() {
    const { notifications } = useSelector((state: RootState) => state.notifications)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [selectedNotification, setSelectedNotification] = useState<null | {
        tipo: string
        mensagem: string
        criadoEm: string
    }>(null)

    const openModal = (notification: Notification): void => {
        setSelectedNotification(notification)
        setIsModalVisible(true)
    }

    const closeModal = (): void => {
        setSelectedNotification(null)
        setIsModalVisible(false)
    }
    
    return (
        <TemplateWithTitle title='Notificações'>
            <div className='mt-5 w-full'>
                {
                    notifications.map(notification => (
                        <div className='mb-3'>
                            <NotificationCard 
                                title={notification.tipo}
                                message={notification.mensagem}
                                date={formatDate(notification.criadoEm)}
                                // TODO: colocar uma cor diferente por tipo
                                color={'main-green-color'}
                                openModal={() => openModal(notification)}
                            />
                        </div>
                    ))
                }
            </div>

            {
                isModalVisible &&
                <Modal title={`Pedido de ${selectedNotification?.tipo}`} onClose={closeModal}>
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