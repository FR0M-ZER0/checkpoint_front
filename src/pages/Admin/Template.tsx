import React, { ReactNode, useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import AdminBottomBar from '../../components/AdminBottomBar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { fetchPendingSolicitations } from '../../redux/slices/solicitationSlice'

type templateProps = {
    children?: ReactNode
}

function Template({ children }: templateProps) {
    const dispatch = useDispatch()
    const { count } = useSelector((state: RootState) => state.solicitations)
    const [adminId, setAdminId] = useState<string|null>('')

    useEffect(() => {
        dispatch({ type: "websocket/connect" })
        dispatch(fetchPendingSolicitations())

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
    return (
        <div className='min-w-screen pb-[62px]' style={{ minHeight: 'calc(100vh + 162px)', backgroundColor: '#EDEDED' }}>
            <div className='w-[90%] flex flex-col items-center' style={{margin: "0 auto"}}>
                { children }
            </div>
            <AdminBottomBar/>
            <ToastContainer
                hideProgressBar={true}
                pauseOnFocusLoss={false}
                theme='colored'
            />
        </div>
    )
}

export default Template