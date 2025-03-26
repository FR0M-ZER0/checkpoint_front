import React from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import AdminNotificationBar from '../../components/AdminNotificationBar'
import PointButton from '../../components/PointButton'

function DashboardPage() {
    return (
        <TemplateWithTitle title='Olá gestor 1'>

            <div className='mt-4'>
                <AdminNotificationBar text='Notificações' notifications={10}/>
            </div>

            <p className='font-bold mt-8'>Últimas marcações</p>

            <div className='mt-6'>
                <p className='mb-4'>Funcionário 1</p>
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
                                04h: 01min
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
                                04h: 01min
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
                                04h: 01min
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
                                04h: 01min
                            </p>
                        </div>
                    </div> 
                </div>
            </div>

            <div className='mt-12'>
                <p className='mb-4'>Funcionário 2</p>
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
                                04h: 01min
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
                                04h: 01min
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
                                04h: 01min
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
                                04h: 01min
                            </p>
                        </div>
                    </div> 
                </div>
            </div>
        </TemplateWithTitle>
    )
}

export default DashboardPage