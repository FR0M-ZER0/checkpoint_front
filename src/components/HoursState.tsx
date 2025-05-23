import React from 'react'

type HoursStateProp = {
    totalTime: string
}

function HoursState({ totalTime }: HoursStateProp) {
    return (
        <div className='flex justify-between mx-0 md:mx-auto md:w-[600px] w-full'>
            <div>
                <p className=''>{totalTime}</p>
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