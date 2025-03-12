import React from 'react'
import { Link } from 'react-router'

function BottomBar() {
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
                <Link to={'/'}>
                    <i className="fa-solid fa-clock text-2xl"></i>
                </Link>
            </span>
            <span>
                <Link to={'/'}>
                    <i className="fa-solid fa-calendar text-2xl"></i>
                </Link>
            </span>
            <span>
                <Link to={'/'}>
                    <i className="fa-solid fa-bars text-2xl"></i>
                </Link>
            </span>
        </nav>
    )
}

export default BottomBar