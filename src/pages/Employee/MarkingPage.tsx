import React from 'react'
import TemplateWithFilter from './TemplateWithFilter'
import Clock from '../../components/Clock'
import PointCard from '../../components/PointCard'

function MarkingPage() {
    return (
        <TemplateWithFilter
            filter={
                <div className='flex w-full flex-col text-center justify-center'>
                    <p className='font-light'>01/01/2021</p>
                    <p className='text-xl'>Quarta-feira</p>

                    <Clock/>

                    <main className='mt-12'>
                        <div>
                            <PointCard
                                icon={
                                    <i className="fa-solid fa-door-open text-6xl"></i>
                                }
                                period='Início'
                                time='08:00'
                                color='main-green-color'
                            />
                        </div>

                        <div className='mt-4'>
                            <PointCard
                                icon={
                                    <i className="fa-solid fa-mug-hot text-6xl"></i>
                                }
                                period='Pausa'
                                time='12:00'
                                color='main-blue-color'
                            />
                        </div>

                        <div className='mt-4'>
                            <PointCard
                                icon={
                                    <i class="fa-solid fa-battery-full text-6xl"></i>
                                }
                                period='Retomada'
                                time='13:00'
                                color='main-yellow-color'
                            />
                        </div>

                        <div className='mt-4'>
                            <PointCard
                                icon={
                                    <i class="fa-solid fa-door-closed text-6xl"></i>
                                }
                                period='Saída'
                                time='18:00'
                                color='main-red-color'
                            />
                        </div>
                    </main>
                </div>
            }
        >
            
        </TemplateWithFilter>
    )
}

export default MarkingPage