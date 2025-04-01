import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useNavigate } from 'react-router'

type OptionsPageProp = {
    onClose: () => void
}

function OptionsPage({ onClose }: OptionsPageProp) {
    const notificationCount: number = useSelector((state: RootState) => state.notifications.count)
    const responseCount: number = useSelector((state: RootState) => state.responses.count)

    const totalUnread: number = notificationCount + responseCount
    const [name, setName] = useState<string|null>('')
    const [email, setEmail] = useState<string|null>('')
    const navigate = useNavigate()

    const getCurrentDate = (): string => {
        const today = new Date()
        const year = today.getFullYear()
        const month = (today.getMonth() + 1).toString().padStart(2, '0')
        const day = today.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const currentDate = getCurrentDate()

    const handleLogout = (): void => {
        localStorage.removeItem("nome")
        localStorage.removeItem("email")
        localStorage.removeItem("id")
        localStorage.removeItem("criado_em")
        localStorage.removeItem("ativo")
        navigate('/login')
    }

    useEffect(() => {
        setName(localStorage.getItem("nome"))
        setEmail(localStorage.getItem("email"))
    }, [])

    return (
        <motion.div
            className='min-h-screen min-w-screen bg-white fixed top-0 left-0 main-black-text'
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }} 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className='w-[90%] mx-auto pt-[30px]'>
                <div className='w-full pb-2 border-b-2 border-gray-300'>
                    <div className='flex w-full justify-between items-center mb-6'>
                        <h1 className='text-2xl'>Menu</h1>
                        <i className="fa-solid fa-xmark text-xl main-red-text" onClick={() => onClose()}></i>
                    </div>

                    <div className='flex items-center mb-8'>
                        <div className='h-20 w-20 rounded-lg bg-gray-300 mr-2 flex items-end justify-center'>
                            <i className="fa-solid fa-user-secret text-6xl text-gray-500"></i>
                        </div>
                        <div className='text-sm text-gray-600'>
                            <p>{name}</p>
                            <p>{email}</p>
                        </div>
                    </div>

                    <div>
                        <p className='flex mb-3'>
                            <Link to={'/'}>
                                <i className="fa-solid fa-house mr-2 main-blue-text"></i>
                                <span>Início</span>
                            </Link>
                        </p>

                        <p className='flex mb-3'>
                            <Link to={`/dia/${currentDate}`}>
                                <i className="fa-solid fa-stopwatch mr-2 main-orange-text"></i>
                                <span>Marcação</span>
                            </Link>
                        </p>

                        <p className='flex mb-3 justify-between'>
                            <Link to={'/notificacoes'}>
                                <i className="fa-solid fa-bell mr-2 main-red-text"></i>
                                <span>Notificações</span>
                            </Link>
                            <p>
                                { totalUnread > 0 && (
                                    <span className='text-white text-xs rounded-full px-2 py-1 bg-red-600'>
                                        { totalUnread }
                                    </span>
                                )}
                            </p>
                        </p>

                        <p className='flex mb-3'>
                            <Link to={'/espelho-ponto'}>
                                <i className="fa-solid fa-calendar mr-2 dark-blue-text"></i>
                                <span>Espelho de ponto</span>
                            </Link>
                        </p>

                        <p className='flex mb-3'>
                            <Link to={'/abono'}>
                                <i className="fa-solid fa-briefcase-medical mr-2 sec-func-color-text"></i>
                                <span>Abonos</span>
                            </Link>
                        </p>

                        <p className='flex mb-3'>
                            <Link to={'/folgas'}>
                                <i className="fa-solid fa-bed mr-2 main-button-text"></i>
                                <span>Folgas</span>
                            </Link>
                        </p>

                        <p className='flex mb-3'>
                            <Link to={'/ferias'}>
                                <i className="fa-solid fa-champagne-glasses mr-2 main-black-text"></i>
                                <span>Férias</span>
                            </Link>
                        </p>
                    </div>
                </div>
                <div className='w-full mt-4'>
                    <p className='flex mb-3'>
                        <Link to={'/'}>
                            <i className="fa-solid fa-circle-half-stroke mr-2 main-black-text"></i>
                            <span>Aparência</span>
                        </Link>
                    </p>
                    <p className='flex mb-3 items-center' onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket mr-2 text-red-400"></i>
                        <span>Sair</span>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default OptionsPage