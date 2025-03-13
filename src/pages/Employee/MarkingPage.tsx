import React, { useState } from 'react'
import TemplateWithFilter from './TemplateWithFilter'
import Clock from '../../components/Clock'
import PointCard from '../../components/PointCard'
import Modal from '../../components/Modal'

function MarkingPage() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const closeModal = (): void => {
        setIsModalVisible(false)
    }

    const openModal = (): void => {
        setIsModalVisible(true)
    }

    return (
        <TemplateWithFilter
            filter={
                <div className='flex w-full flex-col text-center justify-center'>
                    <p className='font-light'>01/01/2021</p>
                    <p className='text-xl'>Quarta-feira</p>

                    <Clock/>

                    <main className='mt-12'>
                        <div onClick={openModal}>
                            <PointCard
                                icon={
                                    <i className="fa-solid fa-door-open text-6xl"></i>
                                }
                                period='Início'
                                time='08:00'
                                color='main-green-color'
                            />
                        </div>

                        <div className='mt-4' onClick={openModal}>
                            <PointCard
                                icon={
                                    <i className="fa-solid fa-mug-hot text-6xl"></i>
                                }
                                period='Pausa'
                                time='12:00'
                                color='main-blue-color'
                            />
                        </div>

                        <div className='mt-4' onClick={openModal}>
                            <PointCard
                                icon={
                                    <i class="fa-solid fa-battery-full text-6xl"></i>
                                }
                                period='Retomada'
                                time='13:00'
                                color='main-yellow-color'
                            />
                        </div>

                        <div className='mt-4' onClick={openModal}>
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
            {
                isModalVisible &&
                <Modal title='Marcar ponto' onClose={closeModal}>
                    <div className='mb-[60px]'>
                        <p>Registrar início: 02h:08min</p>
                    </div>

                    <div className='text-white'>
                        <button className='main-func-color px-8 py-2 rounded-lg mr-4 cursor-pointer'>
                            Confirmar
                        </button>

                        <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer' onClick={closeModal}>
                            Cancelar
                        </button>
                    </div>
                </Modal>
            }
        </TemplateWithFilter>
    )
}

export default MarkingPage