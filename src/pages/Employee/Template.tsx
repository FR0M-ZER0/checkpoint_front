import React, { ReactNode, useEffect } from 'react'
import TopBar from '../../components/TopBar'
import BottomBar from '../../components/BottomBar'
import { ToastContainer } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { fetchUnreadNotifications } from '../../redux/slices/notificationSlice'

type templateProps = {
    children?: ReactNode
}

function Template({ children }: templateProps) {
    const dispatch = useDispatch()

    useEffect(() => {
        // TODO: colocar o id do colaborador logado
        const colaboradorId: number  = 1
        dispatch({ type: "websocket/connect" })
        dispatch(fetchUnreadNotifications(colaboradorId))

        return () => {
            dispatch({ type: 'websocket/disconnect' })
        }
    }, [dispatch])
    return (
        <div className='min-w-screen' style={{ minHeight: 'calc(100vh + 162px)' }}>
            <TopBar/>
            <div className='w-[90%] flex flex-col items-center' style={{margin: "0 auto"}}>
                { children }
            </div>
            <BottomBar/>
            <ToastContainer
                hideProgressBar={true}
                pauseOnFocusLoss={false}
                theme='colored'
            />
        </div>
    )
}

export default Template