import React from 'react'

type SubmitButtonProp = {
    text: string
}

function SubmitButton({ text }: SubmitButtonProp) {
    return (
        <button className='w-full main-gray-color main-button-text rounded-2xl py-2'>
            { text }
        </button>
    )
}

export default SubmitButton