import React, { useState, useEffect } from "react"
import { Link } from "react-router"
import api from "../../services/api"
import TemplateWithFilter from "./TemplateWithFilter"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

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

    const statusColors: statusColorsType = {
        normal: "light-blue-color",
        ferias: "dark-green-color",
        folga: "main-orange-color",
        falta: "main-red-color",
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
    }, [])

    useEffect(() => {
        if (userId) {
            setLoading(true)
            fetchFilteredDays(filterType).then(() => setLoading(false))
        }
    }, [currentYear, userId, filterType])    

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
            <div className="my-4 w-full">
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

            <div className="mt-4 w-full flex justify-between">
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
            <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {months.map((month, index) => {
                    const monthNumber = index + 1
                    const daysWithActivities = Object.keys(data)
                        .filter(dateKey => dateKey.startsWith(`${currentYear}-${String(monthNumber).padStart(2, "0")}`))
                        .map(dateKey => ({
                            day: parseInt(dateKey.split("-")[2], 10),
                            status: data[dateKey]
                        }))
                        .sort((a, b) => a.day - b.day)
                    if (daysWithActivities.length === 0) return null

                    return (
                        <div key={month} className="my-4">
                            <h2 className="text-xl font-bold text-center mb-3">{month}</h2>
                            <div className="grid grid-cols-7">
                                {weekdays.map((day) => (
                                    <div key={day} className="font-light px-1 text-sm">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {daysWithActivities.map(({ day, status }) => {
                                    const formattedDay = String(day).padStart(2, "0")
                                    const formattedMonth = String(index + 1).padStart(2, "0")
                                    const formattedDate = `${currentYear}-${formattedMonth}-${formattedDay}`
                                    return (
                                        <Link key={day} to={`/dia/${formattedDate}`}>
                                            <div
                                                className={`h-[50px] flex items-center justify-center text-white font-bold border border-white ${statusColors[status]}`}
                                            >
                                                <p className="quicksand text-lg">{formattedDay}</p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </TemplateWithFilter>
    )
}

export default EspelhoPontoPage
