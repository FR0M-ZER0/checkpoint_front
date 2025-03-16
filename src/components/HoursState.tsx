import React from 'react'

function HoursState() {
    return (
        <div className='flex justify-between w-full'>
            <div>
                <p className=''>06h:30min</p>
                <p className='text-sm light-gray-text'>Horas trab.</p>
            </div>
            <div>
                <p className='dark-green-text'>00h:17min</p>
                <p className='text-sm light-gray-text'>Saldo diário</p>
            </div>
            <div>
                <p className='dark-green-text'>02h:01min</p>
                <p className='text-sm light-gray-text'>Saldo mensal</p>
            </div>
        </div>
    )
}

export default HoursState