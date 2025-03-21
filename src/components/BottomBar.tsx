import React, { useState } from 'react'
import { Link } from 'react-router'
import OptionsPage from '../pages/Employee/OptionsPage'
import { AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

function BottomBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const notifications = useSelector((state: RootState) => state.notifications.count)

    return (
        <nav className='main-func-color w-full h-[62px] fixed bottom-0 flex main-white-text items-center justify-evenly'>
            <span>
                <Link to={'/'}>
                    <i className="fa-solid fa-house-chimney text-2xl"></i>
                </Link>
            </span>
            <span className="relative">
                <Link to={'/'}>
                    <i className="fa-solid fa-bell text-2xl"></i>
                    {notifications > 0 && (
                        <span className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-xs rounded-full px-2">
                            {notifications}
                        </span>
                    )}
                </Link>
            </span>
            <span>
                <Link to={'/dia'}>
                    <i className="fa-solid fa-clock text-2xl"></i>
                </Link>
            </span>
            <span>
                <Link to={'/'}>
                    <i className="fa-solid fa-calendar text-2xl"></i>
                </Link>
            </span>
            <span>
                <i className="fa-solid fa-bars text-2xl cursor-pointer" onClick={() => setIsMenuOpen(true)}></i>
            </span>

            <AnimatePresence>
                {
                    isMenuOpen &&
                    <OptionsPage onClose={() => setIsMenuOpen(false)} />
                }
            </AnimatePresence>
        </nav>
    )
}

export default BottomBar