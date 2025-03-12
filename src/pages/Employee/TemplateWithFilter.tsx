import React, { ReactNode } from 'react'
import Template from './Template'

type templateWithFilterProp = {
    children?: ReactNode,
    filter: ReactNode
}

function TemplateWithFilter({ children, filter }: templateWithFilterProp) {
    return (
        <Template>
            <div className='mt-4'>
                { filter }
            </div>
            { children }
        </Template>
    )
}

export default TemplateWithFilter