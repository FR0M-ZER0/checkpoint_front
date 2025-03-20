import React, { ReactNode } from 'react'
import TopBar from '../../components/TopBar'
import BottomBar from '../../components/BottomBar'
import { ToastContainer } from 'react-toastify'

type templateProps = {
    children?: ReactNode
}

function Template({ children }: templateProps) {
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