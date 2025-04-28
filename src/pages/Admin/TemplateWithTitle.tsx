import React, { ReactNode } from 'react'
import Template from './Template'

type templateWithTitleProp = {
    title: string,
    children?: ReactNode
    icon?: ReactNode
    onClick?: () => void
}

function TemplateWithTitle({ children, title, icon, onClick }: templateWithTitleProp) {
    return (
        <Template>
            <div className='flex w-full mt-8 justify-between items-center'>
                <h1 className='text-left text-2xl'>{ title }</h1>

                <span onClick={onClick}>
                    { icon }
                </span>
            </div>

            <div className='w-full'>
                { children }
            </div>
        </Template>
    )
}

export default TemplateWithTitle