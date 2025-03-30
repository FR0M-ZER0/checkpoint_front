import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { RootState } from '../redux/store'

function AdminBottomBar() {
    const { count } = useSelector((state: RootState) => state.solicitations)
    return (
        <nav className='main-black-color w-full h-[62px] fixed bottom-0 flex main-white-text items-center justify-evenly'>
            <span>
                <Link to={'/admin/dashboard'}>
                    <i className="fa-solid fa-house-chimney text-2xl"></i>
                </Link>
            </span>
            <span>
                <Link to={'/admin/marcações'}>
                    <i className="fa-solid fa-timeline text-2xl"></i>
                </Link>
            </span>
            <span className="relative">
                <Link to={'/admin/solicitações'}>
                    <i className="fa-solid fa-bell text-2xl"></i>
                    { count > 0 && (
                        <span className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-xs rounded-full px-2">
                            { count }
                        </span>
                    )}
                </Link>
            </span>
        </nav>
    )
}

export default AdminBottomBar