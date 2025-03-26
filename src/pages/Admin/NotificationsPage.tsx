import React from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import Filter from '../../components/Filter'
import SortBy from '../../components/SortBy'
import AdminNotificationCard from '../../components/AdminNotificationCard'

function NotificationsPage() {
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
                <AdminNotificationCard
                    name='Func. 1'
                    date='02/02/2022'
                    type='Férias'
                    dayStart='01/02/2022'
                    dayEnd='14/02/2022'
                    observation='Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet'
                />
            </div>
        </TemplateWithTitle>
    )
}

export default NotificationsPage