import React, { useEffect, useState } from "react"
import api from "../../services/api"
import TemplateWithFilter from "./TemplateWithFilter"

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
    const [data, setData] = useState({})
    const [values, setValues] = useState<valueType>({})
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
    const [userId, setUserId] = useState<string|null>('')

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
        } catch (err:unknown) {
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
        fecthDays()
        fetchTotalValues()
    }, [currentYear, userId])

    useEffect(() => {
        setUserId(localStorage.getItem("id"))
    }, [userId])

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
            <div className="mt-4 w-full flex justify-between">
                <div className="light-blue-text ">
                    <p className="quicksand font-bold">{values.totalHorasTrabalhadas}h</p>
                    <p className="text-sm">Horas trab.</p>
                </div>

                <div className="main-orange-text ">
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
                    const monthNumber = index + 1;
                    const daysWithActivities = Object.keys(data)
                        .filter(dateKey => dateKey.startsWith(`${currentYear}-${String(monthNumber).padStart(2, "0")}`))
                        .map(dateKey => ({
                            day: parseInt(dateKey.split("-")[2], 10),
                            status: data[dateKey]
                        }))

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
                                {daysWithActivities.map(({ day, status }) => (
                                    <div
                                        key={day}
                                        className={`h-[50px] flex items-center justify-center text-white font-bold border border-white ${statusColors[status]}`}
                                    >
                                        <p className="quicksand text-lg">{String(day).padStart(2, "0")}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </TemplateWithFilter>
    )
}

export default EspelhoPontoPage
