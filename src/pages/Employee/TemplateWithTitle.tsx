import React, { ReactNode } from 'react'
import Template from './Template'

type templateWithTitleProp = {
    title: string,
    children?: ReactNode
}

function TemplateWithTitle({ children, title }: templateWithTitleProp) {
    return (
        <Template>
            <div className='flex md:justify-center w-full mt-4'>
                <h1 className='text-left text-2xl'>{ title }</h1>
            </div>

            { children }
        </Template>
    )
}

export default TemplateWithTitle