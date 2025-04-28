import React, { useState, useEffect } from 'react';
import Template from './Template';
import api from '../../services/api';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AjusteMarcacao {
    id: number;
    data: string;
    colaborador: string;
    matricula: string;
    marcacaoOriginal: string;
    marcacaoAjustada: string;
    justificativa: string;
    gestor: string;
    dataAjuste: string;
}

const AjustesMarcacaoPage = () => {
    const [ajustes, setAjustes] = useState<AjusteMarcacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterByPeriod, setFilterByPeriod] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const fetchAjustes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let response;
            if (filterByPeriod && startDate && endDate) {
                const formattedStart = format(startDate, 'yyyy-MM-dd');
                const formattedEnd = format(endDate, 'yyyy-MM-dd');
                response = await api.get(`/ajustes-marcacao?inicio=${formattedStart}&fim=${formattedEnd}`);
            } else {
                response = await api.get('/ajustes-marcacao');
            }
            
            setAjustes(response.data);
        } catch (err) {
            setError('Erro ao carregar ajustes de marcação. Tente novamente mais tarde.');
            console.error('Error fetching ajustes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAjustes();
    }, [filterByPeriod]);

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        
        if (start && end) {
            fetchAjustes();
        }
    };

    return (
        <Template>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Registro de Ajustes nas Marcações</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={fetchAjustes}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                <FiRefreshCw className="mr-2" />
                                Atualizar
                            </button>
                            
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filterByPeriod}
                                    onChange={() => setFilterByPeriod(!filterByPeriod)}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span>Filtrar por período</span>
                            </label>
                        </div>
                        
                        {filterByPeriod && (
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                                <DatePicker
                                    selectsRange
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={handleDateChange}
                                    locale={ptBR}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-input rounded border-gray-300"
                                    placeholderText="Selecione um período"
                                    isClearable
                                />
                                <button
                                    onClick={() => fetchAjustes()}
                                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                >
                                    <FiFilter className="mr-2" />
                                    Aplicar Filtro
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 border-b text-left">Data</th>
                                        <th className="py-3 px-4 border-b text-left">Colaborador</th>
                                        <th className="py-3 px-4 border-b text-left">Matrícula</th>
                                        <th className="py-3 px-4 border-b text-left">Marcação Original</th>
                                        <th className="py-3 px-4 border-b text-left">Marcação Ajustada</th>
                                        <th className="py-3 px-4 border-b text-left">Justificativa</th>
                                        <th className="py-3 px-4 border-b text-left">Gestor</th>
                                        <th className="py-3 px-4 border-b text-left">Data do Ajuste</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ajustes.length > 0 ? (
                                        ajustes.map((ajuste) => (
                                            <tr key={ajuste.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 border-b">{format(new Date(ajuste.data), 'dd/MM/yyyy', { locale: ptBR })}</td>
                                                <td className="py-3 px-4 border-b">{ajuste.colaborador}</td>
                                                <td className="py-3 px-4 border-b">{ajuste.matricula}</td>
                                                <td className="py-3 px-4 border-b">{ajuste.marcacaoOriginal}</td>
                                                <td className="py-3 px-4 border-b">{ajuste.marcacaoAjustada}</td>
                                                <td className="py-3 px-4 border-b">{ajuste.justificativa}</td>
                                                <td className="py-3 px-4 border-b">{ajuste.gestor}</td>
                                                <td className="py-3 px-4 border-b">{format(new Date(ajuste.dataAjuste), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="py-4 text-center text-gray-500">
                                                Nenhum ajuste de marcação encontrado
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Template>
    );
};

export default AjustesMarcacaoPage;