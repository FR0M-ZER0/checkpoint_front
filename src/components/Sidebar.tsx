import { Link, useLocation, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

type SidebarProps = {
    isDarkMode: boolean
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

function Sidebar({ isDarkMode, setIsDarkMode }: SidebarProps) {
    const location = useLocation()
    const pathname = location.pathname
    const navigate = useNavigate()
    const [name, setName] = useState<string|null>('')
    const [email, setEmail] = useState<string|null>('')

    const getCurrentDate = (): string => {
        const today = new Date()
        const year = today.getFullYear()
        const month = (today.getMonth() + 1).toString().padStart(2, '0')
        const day = today.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const handleLogout = (): void => {
        localStorage.removeItem("nome")
        localStorage.removeItem("email")
        localStorage.removeItem("id")
        localStorage.removeItem("criado_em")
        localStorage.removeItem("ativo")
        navigate('/login')
    }

    const currentDate = getCurrentDate()
    const linkBaseClass = "flex items-center mb-2 px-2 py-3 rounded-lg transition-colors duration-200"

    const isActive = (path: string) => pathname === path
    const getLinkClass = (path: string, hoverClass: string) =>
        `${linkBaseClass} ${isActive(path) ? 'bg-white text-[#232566]' : `hover:bg-[#232566] ${hoverClass}`}`

    useEffect(() => {
        setName(localStorage.getItem("nome"))
        setEmail(localStorage.getItem("email"))
    }, [])
    return (
        <nav className="hidden md:flex flex-col w-64 min-h-screen main-func-color p-4 text-slate-300">
            <div className='pb-2 border-b-2 border-gray-600'>
                <div className='flex items-center mb-10'>
                    <div className='h-17 w-17 rounded-lg bg-gray-300 mr-2 flex items-end justify-center'>
                        <i className="fa-solid fa-user-secret text-5xl text-gray-500"></i>
                    </div>
                    <div className='text-sm text-slate-400'>
                        <p>{name}</p>
                        <p>{email}</p>
                    </div>
                </div>

                <Link to="/" className={getLinkClass('/', 'hover:main-blue-text')}>
                    <i className="fa-solid fa-house mr-3"></i>
                    <span>Início</span>
                </Link>

                <Link to={`/dia/${currentDate}`} className={getLinkClass(`/dia/${currentDate}`, 'hover:main-orange-text')}>
                    <i className="fa-solid fa-stopwatch mr-3"></i>
                    <span>Marcação</span>
                </Link>

                <Link to='/notificacoes' className={getLinkClass('/notificacoes', 'hover:main-orange-text')}>
                    <i className="fa-solid fa-bell mr-3"></i>
                    <span>Notificações</span>
                </Link>

                <Link to="/espelho-ponto" className={getLinkClass('/espelho-ponto', 'hover:dark-blue-text')}>
                    <i className="fa-solid fa-calendar mr-3"></i>
                    <span>Espelho de pontos</span>
                </Link>

                <Link to="/abono" className={getLinkClass('/abono', 'hover:sec-func-color-text')}>
                    <i className="fa-solid fa-briefcase-medical mr-3"></i>
                    <span>Abonos</span>
                </Link>

                <Link to="/folgas" className={getLinkClass('/folgas', 'hover:main-button-text')}>
                    <i className="fa-solid fa-bed mr-3"></i>
                    <span>Folgas</span>
                </Link>

                <Link to="/ferias" className={getLinkClass('/ferias', 'hover:main-black-text')}>
                    <i className="fa-solid fa-champagne-glasses mr-3"></i>
                    <span>Férias</span>
                </Link>
            </div>

            <div className='w-full mt-4'>
                <div className='flex items-center justify-between mb-5 bg-[#232566] px-2 py-3 rounded-lg'>
                    <p className="flex items-center">
                        <i className="fa-solid fa-circle-half-stroke mr-3"></i>
                        <span>Modo escuro</span>
                    </p>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" checked={isDarkMode} onChange={() => setIsDarkMode(prev => !prev)} />
                        <div className="w-9 h-4 bg-gray-400 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-5"></div>
                    </label>
                </div>

                <p className={`${linkBaseClass} hover:bg-[#232566] cursor-pointer`} onClick={ handleLogout}>
                    <i className="fa-solid fa-right-from-bracket mr-3"></i>
                    <span>Sair</span>
                </p>
            </div>
        </nav>
    )
}

export default Sidebar
