import React, { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import AdminBottomBar from '../../components/AdminBottomBar'

type templateProps = {
    children?: ReactNode
}

function Template({ children }: templateProps) {
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