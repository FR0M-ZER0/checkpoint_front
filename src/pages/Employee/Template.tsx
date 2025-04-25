import { ReactNode, useState, useEffect, useRef } from 'react'
import TopBar from '../../components/TopBar'
import BottomBar from '../../components/BottomBar'
import { toast, ToastContainer } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUnreadNotifications } from '../../redux/slices/notificationSlice'
import { RootState } from '../../redux/store'
import { fetchUnreadResponses } from '../../redux/slices/responseSlice'
import SideBar from '../../components/Sidebar'

type templateProps = {
    children?: ReactNode
}

function Template({ children }: templateProps) {
    const dispatch = useDispatch()
    const notificationCount: number = useSelector((state: RootState) => state.notifications.count)
    const responseCount: number = useSelector((state: RootState) => state.responses.count)
    const { responses } = useSelector((state: RootState) => state.responses)
    const prevResponseCount = useRef(responses.length)

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

    useEffect(() => {
        if (responses.length > prevResponseCount.current) {
            toast.info('Nova notificação recebida!')
        }
        prevResponseCount.current = responses.length
    }, [responses.length])

    return (
        <div className='min-w-screen pb-[62px] md:pb-0 min-h-[calc(100vh+162px)] md:min-h-screen'>
            <div className='block md:hidden'>
                <TopBar/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] w-full">
                <div className="hidden md:block">
                    <SideBar />
                </div>
                <div className="w-full flex justify-center">
                    <div className='md:w-[1400px] w-[90%]'>
                        {children}
                    </div>
                </div>
            </div>


            <div className="block md:hidden">
                <BottomBar/>
            </div>
            <ToastContainer
                hideProgressBar={true}
                pauseOnFocusLoss={false}
                theme='colored'
            />
        </div>
    )
}

export default Template