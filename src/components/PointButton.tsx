import React, { ReactNode } from 'react'

type PointButtonProp = {
    color: string,
    icon: ReactNode,
}

function PointButton({ color, icon }: PointButtonProp) {
    return (
        <div className={`h-full w-full ${color} flex justify-center items-center rounded-full`}>
            <div className='opacity-50'>
                { icon }
            </div>
        </div>
    )
}

export default PointButton