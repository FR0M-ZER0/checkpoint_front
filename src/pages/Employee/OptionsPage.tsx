import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'

type OptionsPageProp = {
    onClose: () => void
}

function OptionsPage({ onClose }: OptionsPageProp) {
    return (
        <motion.div
            className='min-h-screen min-w-screen bg-white fixed top-0 left-0 main-black-text'
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }} 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className='w-[90%] mx-auto pt-[30px]'>
                <div className='flex w-full justify-between items-center mb-6'>
                    <h1 className='text-2xl'>Menu</h1>
                    <i className="fa-solid fa-xmark text-xl main-red-text" onClick={() => onClose()}></i>
                </div>

                <div>
                    <p className='flex mb-3'>
                        <Link to={'/'}>
                            <i className="fa-solid fa-house mr-2 main-blue-text"></i>
                            <span>Início</span>
                        </Link>
                    </p>

                    <p className='flex mb-3'>
                        <Link to={'/dia'}>
                            <i className="fa-solid fa-stopwatch mr-2 main-orange-text"></i>
                            <span>Marcação</span>
                        </Link>
                    </p>

                    <p className='flex mb-3'>
                        <Link>
                            <i className="fa-solid fa-bell mr-2 main-red-text"></i>
                            <span>Notificações</span>
                        </Link>
                    </p>

                    <p className='flex mb-3'>
                        <Link>
                            <i className="fa-solid fa-calendar mr-2 dark-blue-text"></i>
                            <span>Espelho de pontos</span>
                        </Link>
                    </p>

                    <p className='flex mb-3'>
                        <Link to={'/abono'}>
                            <i className="fa-solid fa-briefcase-medical mr-2 sec-func-color-text"></i>
                            <span>Abonos</span>
                        </Link>
                    </p>

                    <p className='flex mb-3'>
                        <Link>
                            <i className="fa-solid fa-bed mr-2 main-button-text"></i>
                            <span>Folgas</span>
                        </Link>
                    </p>

                    <p className='flex mb-3'>
                        <Link>
                            <i className="fa-solid fa-champagne-glasses mr-2 main-black-text"></i>
                            <span>Férias</span>
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default OptionsPage
