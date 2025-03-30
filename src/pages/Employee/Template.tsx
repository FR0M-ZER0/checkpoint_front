import React, { ReactNode, useState, useEffect } from 'react'
import TopBar from '../../components/TopBar'
import BottomBar from '../../components/BottomBar'
import { ToastContainer } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUnreadNotifications } from '../../redux/slices/notificationSlice'
import { RootState } from '../../redux/store'
import { fetchUnreadResponses } from '../../redux/slices/responseSlice'

type templateProps = {
    children?: ReactNode
}

function Template({ children }: templateProps) {
    const dispatch = useDispatch()
    const notificationCount: number = useSelector((state: RootState) => state.notifications.count)
    const responseCount: number = useSelector((state: RootState) => state.responses.count)

    const totalUnread: number = notificationCount + responseCount
    const [userId, setUserId] = useState<string|null>('')

    useEffect(() => {
        dispatch({ type: "websocket/connect" })
        dispatch(fetchUnreadNotifications(userId))
        dispatch(fetchUnreadResponses(userId))

        return () => {
            dispatch({ type: 'websocket/disconnect' })
        }
    }, [dispatch, userId])

    useEffect(() => {
        if (totalUnread > 0) {
            document.title = `(${totalUnread}) Checkpoint`
        } else {
            document.title = "Checkpoint - marcação de ponto online"
        }
    }, [totalUnread])

    useEffect(() => {
        setUserId(localStorage.getItem('id'))
    }, [userId])

    return (
        <div className='min-w-screen pb-[62px]' style={{ minHeight: 'calc(100vh + 162px)' }}>
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