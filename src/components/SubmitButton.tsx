import React from 'react'

type SubmitButtonProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
  };

function SubmitButton({ text }: SubmitButtonProps) {
    return (
        <button className='w-full main-gray-color main-button-text rounded-2xl py-2'>
            { text }
        </button>
    )
}

export default SubmitButton