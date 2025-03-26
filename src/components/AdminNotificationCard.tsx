import React from 'react'

type AdminNotificationCardProp = {
    /**
     * Padrão
     */
    type: string
    date: string
    name: string
    observation?: string

    /**
     * Usado em todos os pedidos que precisam de dia (folga, férias, abono) :D
     */
    dayStart?: string
    dayEnd?: string

    /**
     * Abono de falta
     */
    file?: string
    reason?: string
    justification?: string


    /**
     * Para ajustes de marcações
     */
    period?: string
    markingTime?: string
    markingType?: string

    openModal: () => void
}

function AdminNotificationCard({ type, date, name, observation, dayStart, dayEnd, file, reason, justification, period, markingTime, markingType, openModal }: AdminNotificationCardProp) {
    return (
        <div className='w-full rounded-xl p-3 notification-admin-color flex justify-between' onClick={openModal}>
            <div className='flex flex-col'>
                <div className='w-[54px] h-[54px] rounded-full bg-white'>
                </div>

                <div className='light-gray-text text-sm mt-4'>
                    <p>
                        { name }
                    </p>

                    <p className='text-light'>
                        { date }
                    </p>
                </div>
            </div>

            <div className='flex-grow'>
                <p>
                    { type }
                </p>

                <p>
                    { dayStart } até { dayEnd }
                </p>
            </div>
        </div>
    )
}

export default AdminNotificationCard