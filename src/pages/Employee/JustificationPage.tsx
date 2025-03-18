import React, { useEffect, useState } from 'react'
import TemplateWithTitle from './TemplateWithTitle'
import SubmitButton from '../../components/SubmitButton'
import calendarSVG from '../../assets/calendar.svg'
import api from '../../services/api'
import { formatDate } from '../../utils/formatter'

interface Absence {
    id: number,
    criadoEm: Date,
    tipo: 'Atraso' | 'Ausencia'
}

function JustificationPage() {
    const [fileName, setFileName] = useState<string>('')
    const [absences, setAbsences] = useState<Absence[]>([])
    const [selectedType, setSelectedType] = useState<'Atraso' | 'Ausencia'>('Ausencia')

    const handleImageClick = (): void => {
        document.getElementById('arquivo')?.click()
    }

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedType(event.target.value as 'Atraso' | 'Ausencia')
    }
    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name)
        }
    }

    const fetchAbsences = async () => {
        try {
            const response = await api.get('/colaborador/faltas/1')
            setAbsences(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchAbsences()
    }, [])

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
                        <input 
                            type="radio" 
                            name='falta' 
                            id='ausencia' 
                            className='mr-2' 
                            value="Ausencia"
                            checked={selectedType === 'Ausencia'} 
                            onChange={handleTypeChange} 
                        />
                        <label htmlFor="ausencia">Ausência</label>
                    </div>

                    <div className='flex items-center'>
                        <input 
                            type="radio" 
                            name='falta' 
                            id='atraso' 
                            className='mr-2' 
                            value="Atraso"
                            checked={selectedType === 'Atraso'} 
                            onChange={handleTypeChange} 
                        />
                        <label htmlFor="atraso">Atraso</label>
                    </div>
                </div>

                <div className='w-full flex justify-between mt-8'>
                    <div className='w-1/2'>
                        <label htmlFor="data">Data</label>
                        <select className='mt-2 mb-4 w-full' name='data'>
                            {absences.filter(absence => absence.tipo === selectedType).length > 0 ? (
                                absences
                                    .filter(absence => absence.tipo === selectedType)
                                    .map(absence => (
                                        <option key={absence.id} value={absence.id}>
                                            {formatDate(absence.criadoEm)}
                                        </option>
                                    ))
                            ) : (
                                <option disabled selected>
                                    Nenhuma {selectedType === 'Atraso' ? 'atraso' : 'ausência'} registrada
                                </option>
                            )}
                        </select>
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