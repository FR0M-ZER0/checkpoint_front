import React, { ReactNode } from 'react'
import TopBar from '../../components/TopBar'
import BottomBar from '../../components/BottomBar'

type templateProps = {
    children?: ReactNode
}

function Template({ children }: templateProps) {
    return (
        <div className='min-h-screen min-w-screen'>
            <TopBar/>
            <div className='w-[90%] flex flex-col items-center' style={{margin: "0 auto"}}>
                { children }
            </div>
            <BottomBar/>
        </div>
    )
}

export default Template