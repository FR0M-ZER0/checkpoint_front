import React from 'react'

type NotificationCardProp = {
    title: string
    message: string
    date: string
    color: string
    openModal: () => void
}

function NotificationCard({ title, message, date, color, openModal }: NotificationCardProp) {
    return (
        <div className={`w-full bg-red-300 rounded-xl p-3 max-h-[100px] h-[100px] ${color}`} onClick={openModal}>
            <div className='flex justify-between'>
                <p className='font-semibold mb-2'>
                    { title }
                </p>

                <p className='text-sm font-light'>
                    { date }
                </p>
            </div>

            <p className='text-sm line-clamp-2'>
                {message}
            </p>
        </div>
    )
}

export default NotificationCard