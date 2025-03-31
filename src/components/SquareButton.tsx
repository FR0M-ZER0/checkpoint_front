import React, { ReactNode } from 'react'

type SquareButtonProp = {
    icon: ReactNode,
    text: string,
    color: string
}

function SquareButton({ icon, text, color }: SquareButtonProp) {
    return (
        <div className={`h-full w-full flex flex-col items-center justify-center ${color} p-2`}>
            { icon }
            <p className='text-white text-light text-sm mt-2'>
                {text}
            </p>
        </div>
    )
}

export default SquareButton