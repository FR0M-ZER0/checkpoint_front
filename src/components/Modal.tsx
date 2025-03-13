import React, { ReactNode } from 'react'

type ModalProp = {
    title: string,
    children: ReactNode,
    onClose: () => void,
    onSubmit?: () => void
}

function Modal({ title, children, onClose, onSubmit }: ModalProp) {
    // Função para fechar o modal ao clicar no background
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    // Função para envio de formulários
    const handleSubmit = () => {
        // TODO: Passar o onSubmit aqui quando for implementado
        console.log("teste")
    }

    return (
        <div className='bg-[rgba(0,0,0,0.8)] fixed top-0 left-0 w-screen h-screen z-50 flex justify-center items-center' onClick={handleBackgroundClick}>
            <div className='min-w-[80%] bg-white px-4 py-8 rounded'>
                <h2 className='text-2xl mb-4'>
                    { title }
                </h2>

                <div>
                    { children }
                </div>
            </div>
        </div>
    )
}

export default Modal