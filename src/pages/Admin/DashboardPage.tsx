import React from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import AdminNotificationBar from '../../components/AdminNotificationBar'

function DashboardPage() {
    return (
        <TemplateWithTitle title='Olá gestor 1'>

            <div className='mt-4 w-full'>
                <AdminNotificationBar text='Notificações' notifications={10}/>
            </div>
        </TemplateWithTitle>
    )
}

export default DashboardPage