import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { DashboardSidebar } from "@/components/admin/Sidebar"
import { DashboardHeader } from "@/components/admin/Header"
import { fetchFolgaSolicitations, fetchSolicitations, fetchVacationSolicitations } from '@/redux/slices/solicitationSlice'
import { toast, ToastContainer } from 'react-toastify'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const dispatch = useDispatch()
    const { count, solicitations } = useSelector((state: RootState) => state.solicitations)
    const [adminId, setAdminId] = useState<string|null>('')
    const prevSolicitationCount = useRef(solicitations.length)

    useEffect(() => {
        dispatch({ type: "websocket/connect" })
        dispatch(fetchSolicitations())
        dispatch(fetchVacationSolicitations())
        dispatch(fetchFolgaSolicitations())

        return () => {
            dispatch({ type: 'websocket/disconnect' })
        }
    }, [dispatch])

    useEffect(() => {
        if (count > 0) {
            document.title = `(${count}) Checkpoint`
        } else {
            document.title = "Checkpoint - marcação de ponto online"
        }
    }, [count])

    useEffect(() => {
        setAdminId(localStorage.getItem('admin_id'))
    }, [adminId])

    useEffect(() => {
        if (solicitations.length > prevSolicitationCount.current) {
            toast.info('Nova solicitação recebida!')
        }
        prevSolicitationCount.current = solicitations.length
    }, [solicitations.length])

	return (
		<div className="flex min-h-screen flex-col">
			<DashboardHeader />
			<div className="flex flex-1">
				<DashboardSidebar />
				<main className="flex-1 p-6 md:p-8 bg-white">{children}</main>
			</div>
			<ToastContainer
				hideProgressBar={true}
				pauseOnFocusLoss={false}
				theme='colored'
			/>
		</div>
	)
}
