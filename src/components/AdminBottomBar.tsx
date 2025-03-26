import React from 'react'
import { Link } from 'react-router'

function AdminBottomBar() {
    return (
        <nav className='main-black-color w-full h-[62px] fixed bottom-0 flex main-white-text items-center justify-evenly'>
            <span>
                <Link to={'/admin/dashboard'}>
                    <i className="fa-solid fa-house-chimney text-2xl"></i>
                </Link>
            </span>
            <span>
                <Link to={'/'}>
                    <i className="fa-solid fa-timeline text-2xl"></i>
                </Link>
            </span>
            <span>
                <Link to={'/admin/solicitações'}>
                    <i className="fa-solid fa-bell text-2xl"></i>
                </Link>
            </span>
        </nav>
    )
}

export default AdminBottomBar