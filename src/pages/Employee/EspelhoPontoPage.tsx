import React, { useState, useEffect } from "react"
import { Link } from "react-router"
import api from "../../services/api"
import TemplateWithFilter from "./TemplateWithFilter"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getDaysInMonth, startOfMonth, getDay } from "date-fns"

type valueType = {
    totalFaltas: number,
    totalFerias: number,
    totalFolgas: number,
    totalHorasTrabalhadas: number
}

type statusColorsType = {
    normal: string,
    ferias: string,
    folga: string,
    falta: string,
}

function EspelhoPontoPage() {
    const [data, setData] = useState<Record<string, string>>({})
    const [values, setValues] = useState<valueType>({ totalFaltas: 0, totalFerias: 0, totalFolgas: 0, totalHorasTrabalhadas: 0 })
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
    const [userId, setUserId] = useState<string | null>('')
    const [loading, setLoading] = useState<boolean>(true)
    const [filterType, setFilterType] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [saldoFerias, setSaldoFerias] = useState<number>(0)

    const fecthDays = async (): Promise<void> => {
        try {
            const response = await api.get(`/dias-trabalho/${userId}`)
            setData(response.data)
        } catch (err: unknown) {
            console.error(err)
        }
    }

    const fetchTotalValues = async (): Promise<void> => {
        try {
            const response = await api.get(`/dias-trabalho/${userId}/resumo`)
            setValues(response.data)
        } catch (err: unknown) {
            console.error(err)
        }
    }

    const fetchFilteredDays = async (type: string): Promise<void> => {
        if (!type) {
            await fecthDays()
            return
        }
    
        try {
            const response = await api.get(`/dias-trabalho/${userId}/filtro/${type}`)
            setData(response.data)
        } catch (err: unknown) {
            console.error(err)
        }
    }    

    const months: string[] = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

    const weekdays: string[] = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]
    const statusColors: statusColorsType & { neutral: string } = {
        normal: "light-blue-color",
        ferias: "dark-green-color",
        folga: "main-orange-color",
        falta: "main-red-color",
        neutral: "bg-gray-300",
    }

    const fetchSaldoFerias = async () => {
        try {
            const response = await api.get(`/api/ferias/saldo-calculado?colaboradorId=${userId}`);
            setSaldoFerias(response.data?.saldo)
        } catch (error: any) {
            console.error("Erro ao buscar saldo:", error)
        }
    }

    const handlePrevYear = () => setCurrentYear(prev => prev - 1)
    const handleNextYear = () => setCurrentYear(prev => prev + 1)

    useEffect(() => {
        const fetchData = async () => {
            await fecthDays()
            await fetchTotalValues()
            setLoading(false)
        }
        if (userId) {
            setLoading(true)
            fetchData()
        }
    }, [currentYear, userId])

    useEffect(() => {
        setUserId(localStorage.getItem("id"))
        fetchSaldoFerias()
    }, [userId])

    useEffect(() => {
        if (userId) {
            setLoading(true)
            fetchFilteredDays(filterType).then(() => setLoading(false))
        }
    }, [currentYear, userId, filterType])
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
    
            if (!target.closest('.status-card')) {
                setSelectedStatus(null)
            }
        }
    
        document.addEventListener('click', handleClickOutside)
    
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    if (loading) {
        return (
            <TemplateWithFilter filter={
                <div className="flex justify-center items-center w-full text-center relative">
                    <i className="fa-solid fa-chevron-left text-xl cursor-pointer" onClick={handlePrevYear}></i>
                    <div className="mx-8">
                        <h1 className="quicksand text-2xl"><Skeleton width={100} baseColor="#dedede" highlightColor="#c5c5c5" /></h1>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xl cursor-pointer" onClick={handleNextYear}></i>
                </div>
            }>
                <div className="mt-4 w-full flex justify-between">
                    <div className="light-blue-text">
                        <p className="quicksand font-bold"><Skeleton width={50} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                        <p className="text-sm"><Skeleton width={60} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                    </div>
                    <div className="main-orange-text">
                        <p className="quicksand font-bold"><Skeleton width={50} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                        <p className="text-sm"><Skeleton width={60} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                    </div>
                    <div className="dark-green-text">
                        <p className="quicksand font-bold"><Skeleton width={50} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                        <p className="text-sm"><Skeleton width={60} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                    </div>
                    <div className="main-red-text">
                        <p className="quicksand font-bold"><Skeleton width={50} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                        <p className="text-sm"><Skeleton width={60} baseColor="#dedede" highlightColor="#c5c5c5" /></p>
                    </div>
                </div>
                <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton height={150} baseColor="#dedede" highlightColor="#c5c5c5" count={3} />
                </div>
            </TemplateWithFilter>
        )
    }

    return (
        <TemplateWithFilter filter={
            <div className="flex justify-center items-center w-full text-center relative">
                <i className="fa-solid fa-chevron-left text-xl cursor-pointer" onClick={handlePrevYear}></i>
                <div className="mx-8">
                    <h1 className="quicksand text-2xl">{currentYear}</h1>
                </div>
                <i className="fa-solid fa-chevron-right text-xl cursor-pointer" onClick={handleNextYear}></i>
            </div>
        }>
            <div className="my-4 w-full md:hidden block">
                <select 
                    name="filtro" 
                    id="filtro" 
                    className="text-sm w-full" 
                    value={filterType} 
                    onChange={(e) => {
                        const selectedFilter = e.target.value;
                        setFilterType(selectedFilter);
                        fetchFilteredDays(selectedFilter);
                    }}
                >
                    <option value="">Filtre por</option>
                    <option value="folga">Folga</option>
                    <option value="ferias">Férias</option>
                    <option value="marcacao">Normal</option>
                    <option value="falta">Ausência</option>
                </select>
            </div>

            <div className="mt-4 w-full">
                <div className="flex justify-between md:hidden">
                    <div className="light-blue-text">
                        <p className="quicksand font-bold">{values.totalHorasTrabalhadas}h</p>
                        <p className="text-sm">Horas trab.</p>
                    </div>

                    <div className="main-orange-text">
                        <p className="quicksand font-bold">{values.totalFolgas}d</p>
                        <p className="text-sm">Folgas</p>
                    </div>

                    <div className="dark-green-text">
                        <p className="quicksand font-bold">{values.totalFerias}d</p>
                        <p className="text-sm">Férias</p>
                    </div>

                    <div className="main-red-text">
                        <p className="quicksand font-bold">{values.totalFaltas}d</p>
                        <p className="text-sm">Faltas</p>
                    </div>
                </div>

                <div className="hidden md:flex gap-4">
                    <div
                        onClick={() => setSelectedStatus(selectedStatus === 'normal' ? null : 'normal')}
                        className="cursor-pointer flex items-center gap-2 light-blue-color text-white px-6 py-4 rounded-lg w-full status-card"
                    >
                        <div className="mr-4 h-14 w-14 bg-[#006ADA] flex justify-center items-center rounded-xl shadow-md">
                            <i className="fa-solid fa-gavel text-2xl"></i>
                        </div>
                        <div>
                            <p className="quicksand text-sm font-semibold">Horas trabalhadas</p>
                            <p className="font-bold text-lg">{values.totalHorasTrabalhadas}h</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setSelectedStatus(selectedStatus === 'falta' ? null : 'falta')}
                        className="cursor-pointer flex items-center gap-2 main-red-color text-white px-6 py-4 rounded-lg w-full status-card"
                    >
                        <div className="mr-4 h-14 w-14 bg-[#C90F03] flex justify-center items-center rounded-xl shadow-md">
                            <i className="fa-solid fa-notes-medical text-2xl"></i>
                        </div>
                        <div>
                            <p className="quicksand text-sm font-semibold">Faltas</p>
                            <p className="font-bold text-lg">{values.totalFaltas}d</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setSelectedStatus(selectedStatus === 'folga' ? null : 'folga')}
                        className="cursor-pointer flex items-center gap-2 main-orange-color text-white px-6 py-4 rounded-lg w-full status-card"
                    >
                        <div className="mr-4 h-14 w-14 bg-[#B73607] flex justify-center items-center rounded-xl shadow-md">
                            <i className="fa-solid fa-bed text-2xl"></i>
                        </div>
                        <div>
                            <p className="quicksand text-sm font-semibold">Folgas</p>
                            <p className="font-bold text-lg">{values.totalFolgas}d</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setSelectedStatus(selectedStatus === 'ferias' ? null : 'ferias')}
                        className="cursor-pointer flex items-center gap-2 dark-green-color text-white px-6 py-4 rounded-lg w-full status-card"
                    >
                        <div className="mr-4 h-14 w-14 bg-[#0A8246] flex justify-center items-center rounded-xl shadow-md">
                            <i className="fa-solid fa-champagne-glasses text-2xl"></i>
                        </div>
                        <div className="w-full">
                            <p className="quicksand text-sm font-semibold">Férias</p>
                            <div className="flex justify-between items-center w-full">
                                <p className="font-bold text-lg">{values.totalFerias}d</p>
                                <p className="text-sm text-gray-200">Saldo disponível: {saldoFerias}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {months.map((month, index) => {
                    const totalDays = getDaysInMonth(new Date(currentYear, index))
                    const firstDayWeekday = getDay(startOfMonth(new Date(currentYear, index)))

                    const fullMonthDays = Array.from({ length: totalDays }, (_, dayIndex) => {
                        const day = dayIndex + 1
                        const formattedDay = String(day).padStart(2, "0")
                        const formattedMonth = String(index + 1).padStart(2, "0")
                        const formattedDate = `${currentYear}-${formattedMonth}-${formattedDay}`
                        const status = data[formattedDate] || "neutral"
                        return { day, status, date: formattedDate }
                    })

                    return (
                        <div key={month} className="my-4">
                            <h2 className="text-xl font-bold text-center mb-3">{month}</h2>

                            <div className="grid grid-cols-7">
                                {weekdays.map((day) => (
                                    <div key={day} className="font-light px-1 text-sm">{day}</div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayWeekday === 0 ? 6 : firstDayWeekday - 1 }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}

                                {fullMonthDays.map(({ day, status, date }) => (
                                    <Link key={day} to={`/dia/${date}`}>
                                        <div
                                            className={`h-[50px] flex items-center justify-center text-white font-bold ${statusColors[status]} 
                                                ${selectedStatus && selectedStatus !== status ? 'opacity-40' : ''}
                                            `}
                                        >
                                            <p className="quicksand text-lg">{String(day).padStart(2, "0")}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </TemplateWithFilter>
    )
}

export default EspelhoPontoPage
