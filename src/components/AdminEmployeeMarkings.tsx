import React from 'react'
import PointButton from './PointButton'

type AdminEmployeeMarkingsProp = {
    employeeName: string
    startTime: string
    pauseTime: string
    resumeTime: string
    endTime: string
}

function AdminEmployeeMarkings({ employeeName, startTime, pauseTime, resumeTime, endTime }: AdminEmployeeMarkingsProp) {
    return (
        <div>
            <p className='mb-4'>{ employeeName }</p>
            <div className='grid grid-cols-2 gap-y-4'>
                <div className='flex items-center'>
                    <div className='h-[64px] w-[64px] mr-2'>
                        <PointButton color='main-green-color' icon={
                            <i className="fa-solid fa-door-open text-3xl"></i>
                        }/>
                    </div>

                    <div>
                        <p>
                            Início
                        </p>

                        <p className='font-light text-sm'>
                            { startTime }
                        </p>
                    </div>
                </div>

                <div className='flex items-center justify-end'>
                    <div className='h-[64px] w-[64px] mr-2'>
                        <PointButton color='main-blue-color' icon={
                            <i className="fa-solid fa-mug-hot text-3xl"></i>
                        }/>
                    </div>

                    <div>
                        <p>
                            Pausa
                        </p>

                        <p className='font-light text-sm'>
                            { pauseTime }
                        </p>
                    </div>
                </div> 

                <div className='flex items-center'>
                    <div className='h-[64px] w-[64px] mr-2'>
                        <PointButton color='main-yellow-color' icon={
                            <i className="fa-solid fa-battery-full text-3xl"></i>
                        }/>
                    </div>

                    <div>
                        <p>
                            Retomada
                        </p>

                        <p className='font-light text-sm'>
                            { resumeTime }
                        </p>
                    </div>
                </div> 

                <div className='flex items-center justify-end'>
                    <div className='h-[64px] w-[64px] mr-2'>
                        <PointButton color='main-red-color' icon={
                            <i className="fa-solid fa-door-closed text-3xl"></i>
                        }/>
                    </div>

                    <div>
                        <p>
                            Saída
                        </p>

                        <p className='font-light text-sm'>
                            { endTime }
                        </p>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default AdminEmployeeMarkings