import React, { useState } from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import SubmitButton from '../../components/SubmitButton'
import calendarSVG from '../../assets/calendar.svg'

function JustificationPage() {
    const [fileName, setFileName] = useState<string>('')

    const handleImageClick = (): void => {
        document.getElementById('arquivo')?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name)
        }
    }

    return (
        <TemplateWithTitle title='Abonar ausência ou atraso'>
            <form className='mt-8 w-full'>
                <div>
                    <label htmlFor="reason">Motivo</label>
                    <select className='w-full mt-2' name='reason'>
                        <option value="" disabled selected>Selectione uma opção</option>
                        <option value="">Doença</option>
                        <option value="">Luto</option>
                        <option value="">Compromissos legais</option>
                        <option value="">Força maior</option>
                        <option value="">Outros</option>
                    </select>
                </div>

                <div className='flex w-full justify-between mt-8'>
                    <div className='flex items-center'>
                        <input type="radio" name='falta' id='ausencia' className='mr-2'/>
                        <label htmlFor="ausencia">Ausência</label>
                    </div>

                    <div className='flex items-center'>
                        <input type="radio" name='falta' id='atraso' className='mr-2'/>
                        <label htmlFor="atraso">Atraso</label>
                    </div>
                </div>

                <div className='w-full flex justify-between mt-8'>
                    <div className='w-1/2'>
                        <label htmlFor="data">Data</label>
                        <input type="date" className='mt-2 mb-4' name='data'/>
                    </div>

                    <div className='w-1/2'>
                        <img src={calendarSVG} alt="" />
                    </div>
                </div>

                <div className='mt-8'>
                    <label htmlFor="justificativa">Justificativa</label>
                    <div className='relative'>
                        <textarea name="justificativa" className='w-full mt-2' rows={6}>
                        </textarea>
                        <p className='absolute bottom-[8px] left-[14px] light-gray-text'>
                            { fileName }
                        </p>
                        <i className="fa-regular fa-file-image text-lg absolute bottom-[8px] right-[14px] cursor-pointer" onClick={handleImageClick}></i>
                        <input type="file" id="arquivo" hidden onChange={handleFileChange}/>
                    </div>
                </div>

                <div className='mt-8'>
                    <SubmitButton text='Enviar'/>
                </div>
            </form>
        </TemplateWithTitle>
    )
}

export default JustificationPage