import React, { ReactNode } from 'react'
import Template from './Template'

type TemplateWithFilterProps = {
    children?: ReactNode,
    filter: ReactNode,
    showFilter?: boolean
}

function TemplateWithFilter({ children, filter, showFilter = true }: TemplateWithFilterProps) {
    return (
        <Template>
            {
                showFilter ? (
                    <>
                        <div className='mt-4 w-full'>
                            {filter}
                        </div>
                        {children}
                    </>
                ) : (
                    <>
                        {children}
                    </>
                )
            }
        </Template>
    )
}

export default TemplateWithFilter