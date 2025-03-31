import React from 'react'

type AdminNotificationBarProp = {
    text: string
    notifications: number
}

function AdminNotificationBar({ text, notifications }: AdminNotificationBarProp) {
    return (
        <div className='w-full bg-white shadow-lg px-2 py-3 rounded-lg'>
            <div className='flex justify-between'>
                <p className='quicksand font-bold'>
                    { text }
                </p>

                <span className='flex items-center'>
                    <p className='quicksand font-bold mr-2'>
                        { notifications }
                    </p>
                    <i className="fa-solid fa-bell main-red-text text-xl"></i>
                </span>
            </div>
        </div>
    )
}

export default AdminNotificationBar