import React from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import AdminEmployeeMarkings from '../../components/AdminEmployeeMarkings'

function MarkingsPage() {
    return (
        <TemplateWithTitle title='Marcações' icon={
            <i className="fa-solid fa-calendar-days text-xl"></i>
        }>
            <div className='mt-6 main-black-color rounded main-white-text p-2'>
                <p className='quicksand font-medium text-center text-lg'>
                    30/01/2024
                </p>
            </div>

            <div className='mt-4'>
                <AdminEmployeeMarkings
                    employeeName='Funcionário 1'
                    startTime='04h: 01min'
                    pauseTime='04h: 01min'
                    resumeTime='04h: 01min'
                    endTime='04h: 01min'
                    icon={
                        <i className="fa-solid fa-pen"></i>
                    }
                />
            </div>

            <div className='mt-12'>
                <AdminEmployeeMarkings
                    employeeName='Funcionário 2'
                    startTime='04h: 01min'
                    pauseTime='04h: 01min'
                    resumeTime='04h: 01min'
                    endTime='04h: 01min'
                    extraTime='02h: 03min'
                    icon={
                        <i className="fa-solid fa-pen"></i>
                    }
                />
            </div>

            <div className='mt-12'>
                <AdminEmployeeMarkings
                    employeeName='Funcionário 3'
                    startTime='04h: 01min'
                    pauseTime='04h: 01min'
                    resumeTime='04h: 01min'
                    endTime='04h: 01min'
                    icon={
                        <i className="fa-solid fa-pen"></i>
                    }
                />
            </div>
        </TemplateWithTitle>
    )
}

export default MarkingsPage