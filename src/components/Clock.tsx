import React, { useState, useEffect} from 'react'

function Clock() {
    const [time, setTime] = useState<Date>(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            <p className='quicksand font-semibold text-6xl'>
                {time.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" })}
            </p>
        </div>
    )
}

export default Clock