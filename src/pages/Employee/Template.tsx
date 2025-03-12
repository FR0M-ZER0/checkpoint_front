import React, { ReactNode } from 'react'
import TopBar from '../../components/TopBar'
import BottomBar from '../../components/BottomBar'

type templateProps = {
    children?: ReactNode
}

function Template({ children }: templateProps) {
    return (
        <div className='min-h-screen min-w-screen flex flex-col items-center'>
            <TopBar/>
            { children }
            <BottomBar/>
        </div>
    )
}

export default Template