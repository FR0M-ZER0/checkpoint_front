import React, { useState } from 'react'
import { Link } from 'react-router'
import OptionsPage from '../pages/Employee/OptionsPage'
import { AnimatePresence } from 'framer-motion'

function BottomBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    return (
        <nav className='main-func-color w-full h-[62px] fixed bottom-0 flex main-white-text items-center justify-evenly'>
            <span>
                <Link to={'/'}>
                    <i className="fa-solid fa-house-chimney text-2xl"></i>
                </Link>
            </span>
            <span>
                <Link to={'/'}>
                    <i className="fa-solid fa-bell text-2xl"></i>
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
                    <OptionsPage onClose={() => setIsMenuOpen(false)}/>
                }
            </AnimatePresence>
        </nav>
    )
}

export default BottomBar