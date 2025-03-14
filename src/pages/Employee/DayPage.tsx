import React from 'react'
import TemplateWithFilter from './TemplateWithFilter'
import DateFilter from '../../components/DateFilter'
import HoursState from '../../components/HoursState'
import PointButton from '../../components/PointButton'
import SquareButton from '../../components/SquareButton'

function DayPage() {
    return (
        <TemplateWithFilter filter={
            <DateFilter/>
        }>
            <div className='mt-4 w-full'>
                <HoursState/>
            </div>

            <main className='w-full mt-8'>
                <div>
                    <div className='w-full flex justify-between items-center mb-[100px]'>
                        <div className='flex items-center'>
                            <div className='w-[80px] h-[80px] relative'>
                                <PointButton color='main-green-color' icon={
                                    <i className="fa-solid fa-door-open text-3xl"></i>
                                }/>
                                <div className='absolute w-[4px] h-[110px] top-[80px] right-1/2 z-[-1] gray-line-color'></div>
                                <div className='text-[12px] light-gray-text absolute top-[100px] w-[400px] left-[50px]'>
                                    <p className='font-medium'>Realizado por</p>
                                    <p className='font-light'>04h:32min</p>
                                </div>
                            </div>
                            <div className='ml-2'>
                                <p className='text-lg'>Início</p>
                                <p className='font-light text-sm'>04h:10min</p>
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='h-[64px] w-[64px]'>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]'>
                                <SquareButton
                                    text='Exclusão'
                                    icon={
                                        <i className="fa-solid fa-trash text-white"></i>
                                    }
                                    color='btn-red-color'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex justify-between items-center mb-[100px]'>
                        <div className='flex items-center'>
                            <div className='w-[80px] h-[80px] relative'>
                                <PointButton color='main-blue-color' icon={
                                    <i className="fa-solid fa-mug-hot text-3xl"></i>
                                }/>
                                <div className='absolute w-[4px] h-[110px] top-[80px] right-1/2 z-[-1] gray-line-color'></div>
                                <div className='text-[12px] light-gray-text absolute top-[100px] w-[400px] left-[50px]'>
                                    <p className='font-medium'>Realizado por</p>
                                    <p className='font-light'>04h:32min</p>
                                </div>
                            </div>
                            <div className='ml-2'>
                                <p className='text-lg'>Pausa</p>
                                <p className='font-light text-sm'>04h:10min</p>
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='h-[64px] w-[64px]'>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]'>
                                <SquareButton
                                    text='Exclusão'
                                    icon={
                                        <i className="fa-solid fa-trash text-white"></i>
                                    }
                                    color='btn-red-color'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex justify-between items-center mb-[100px]'>
                        <div className='flex items-center'>
                            <div className='w-[80px] h-[80px] relative'>
                                <PointButton color='main-yellow-color' icon={
                                    <i className="fa-solid fa-battery-full text-3xl"></i>
                                }/>
                                <div className='absolute w-[4px] h-[110px] top-[80px] right-1/2 z-[-1] gray-line-color'></div>
                                <div className='text-[12px] light-gray-text absolute top-[100px] w-[400px] left-[50px]'>
                                    <p className='font-medium'>Realizado por</p>
                                    <p className='font-light'>04h:32min</p>
                                </div>
                            </div>
                            <div className='ml-2'>
                                <p className='text-lg'>Retomada</p>
                                <p className='font-light text-sm'>04h:10min</p>
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='h-[64px] w-[64px]'>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]'>
                                <SquareButton
                                    text='Exclusão'
                                    icon={
                                        <i className="fa-solid fa-trash text-white"></i>
                                    }
                                    color='btn-red-color'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex justify-between items-center mb-[100px]'>
                        <div className='flex items-center'>
                            <div className='w-[80px] h-[80px]'>
                            <PointButton color='main-red-color' icon={
                                <i className="fa-solid fa-door-closed text-3xl"></i>
                            }/>
                            </div>
                            <div className='ml-2'>
                                <p className='text-lg'>Saída</p>
                                <p className='font-light text-sm'>04h:10min</p>
                            </div>
                        </div>

                        <div className='flex'>
                            <div className='h-[64px] w-[64px]'>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]'>
                                <SquareButton
                                    text='Exclusão'
                                    icon={
                                        <i className="fa-solid fa-trash text-white"></i>
                                    }
                                    color='btn-red-color'
                                />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>
            
        </TemplateWithFilter>
    )
}

export default DayPage