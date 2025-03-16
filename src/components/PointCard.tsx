import React, { ReactNode } from 'react'

type PointCardProp = {
    icon: ReactNode,
    period: string,
    time: string,
    color: string
}

function PointCard({ icon, period, time, color }: PointCardProp) {
    return (
        <div className={`w-full px-3 py-5 pt-8 flex justify-between cursor-pointer ${color} rounded-lg min-h-[116px] items-end`}>
            <div className='opacity-50'>
                { icon }
            </div>
            <div className='flex flex-col items-end'>
                <p>
                    { period }
                </p>

                <p className='text-4xl quicksand'>
                    { time }
                </p>
            </div>
        </div>
    )
}

export default PointCard