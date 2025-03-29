import React, { useState } from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import Filter from '../../components/Filter'
import SortBy from '../../components/SortBy'
import AdminNotificationCard from '../../components/AdminNotificationCard'
import { RootState } from '../../redux/store'
import { useSelector } from 'react-redux'

function NotificationsPage() {
    const { solicitations } = useSelector((state: RootState) => state.solicitations)
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
                        <div className='mb-4'>
                            <AdminNotificationCard
                                name='Func. 1'
                                date='02/02/2022'
                                type='Ajuste de ponto'
                                period={solicitation.periodo}
                                observation={solicitation.observacao}
                            />
                        </div>
                    ))
                }
            </div>
        </TemplateWithTitle>
    )
}

export default NotificationsPage