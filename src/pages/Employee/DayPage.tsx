import React, { useState } from 'react'
import TemplateWithFilter from './TemplateWithFilter'
import DateFilter from '../../components/DateFilter'
import HoursState from '../../components/HoursState'
import PointButton from '../../components/PointButton'
import SquareButton from '../../components/SquareButton'
import Modal from '../../components/Modal'

function DayPage() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [modalType, setModalType] = useState<string>('')

    const openModal = (type: string): void => {
        setIsModalVisible(true)
        setModalType(type)
    }

    const closeModal = (): void => {
        setIsModalVisible(false)
    }

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
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('edit')}>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('delete')}>
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
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('edit')}>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('delete')}>
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
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('edit')}>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('delete')}>
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
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('edit')}>
                                <SquareButton
                                    text='Edição'
                                    icon={
                                        <i className="fa-solid fa-pen text-white"></i>
                                    }
                                    color='btn-blue-color'
                                />
                            </div>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('delete')}>
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

            {
                isModalVisible &&
                <Modal title={`Solicitar ${modalType === 'edit' ? 'ajuste' : 'exclusão'}`} onClose={closeModal}>
                    <form action="">
                        <div className='mb-[60px]'>
                            <label htmlFor="observation">Observação</label>
                            <textarea name="observation" rows={5} className='main-background-color block w-full p-2 rounded'></textarea>
                        </div>

                        <div className='text-white'>
                            <button className='main-func-color px-8 py-2 rounded-lg mr-4 cursor-pointer'>
                                Confirmar
                            </button>

                            <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer'>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </Modal>
            }
        </TemplateWithFilter>
    )
}

export default DayPage