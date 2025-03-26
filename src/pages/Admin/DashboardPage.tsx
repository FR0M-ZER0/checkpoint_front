import React from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import AdminNotificationBar from '../../components/AdminNotificationBar'
import AdminEmployeeMarkings from '../../components/AdminEmployeeMarkings'

function DashboardPage() {
    return (
        <TemplateWithTitle title='Olá gestor 1'>

            <div className='mt-4'>
                <AdminNotificationBar text='Notificações' notifications={10}/>
            </div>

            <p className='font-bold mt-8'>Últimas marcações</p>

            <div className='mt-6'>
                <AdminEmployeeMarkings
                    employeeName='Funcionário 1'
                    startTime='04h: 01min'
                    pauseTime='04h: 01min'
                    resumeTime='04h: 01min'
                    endTime='04h: 01min'
                />
            </div>

            <div className='mt-12'>
                <AdminEmployeeMarkings
                    employeeName='Funcionário 2'
                    startTime='04h: 01min'
                    pauseTime='04h: 01min'
                    resumeTime='04h: 01min'
                    endTime='04h: 01min'
                />
            </div>
        </TemplateWithTitle>
    )
}

export default DashboardPage