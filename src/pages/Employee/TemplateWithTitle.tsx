import React, { ReactNode } from 'react'
import Template from './Template'

type templateWithTitleProp = {
    title: string,
    children?: ReactNode
}

function TemplateWithTitle({ children, title }: templateWithTitleProp) {
    return (
        <Template>
            <h1 className=''>{ title }</h1>

            { children }
        </Template>
    )
}

export default TemplateWithTitle