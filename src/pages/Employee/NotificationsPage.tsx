import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import TemplateWithTitle from './TemplateWithTitle'
import NotificationCard from '../../components/NotificationCard'
import { formatDate } from '../../utils/formatter'

function NotificationsPage() {
    const { notifications } = useSelector((state: RootState) => state.notifications)
    
    return (
        <TemplateWithTitle title='Notificações'>
            <div className='mt-5'>
                {
                    notifications.map(notification => (
                        <div className='mb-3'>
                            <NotificationCard 
                                title={notification.tipo}
                                message={notification.mensagem}
                                date={formatDate(notification.criadoEm)}
                                // TODO: colocar uma cor diferente por tipo
                                color={'main-green-color'}
                            />
                        </div>
                    ))
                }
            </div>
        </TemplateWithTitle>
    )
}

export default NotificationsPage