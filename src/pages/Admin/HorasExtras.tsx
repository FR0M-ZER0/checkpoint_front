import React, { useState, useEffect } from 'react';
import Template from './Template';
import  api  from '../../services/api';
import { HorasExtrasAcumuladasDTO } from '../../types/HorasExtrasTypes';
import { FiFilter, FiRefreshCw, FiDownload } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import HorasExtrasTable from '../../components/HorasExtrasTable';
import HorasExtrasChart from '../../components/HorasExtrasChart';

const HorasExtrasPage = () => {
    const [horasExtras, setHorasExtras] = useState<HorasExtrasAcumuladasDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterByPeriod, setFilterByPeriod] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

    const fetchHorasExtras = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let response;
            if (filterByPeriod && startDate && endDate) {
                const formattedStart = format(startDate, 'yyyy-MM-dd');
                const formattedEnd = format(endDate, 'yyyy-MM-dd');
                response = await api.get(`/horas-extras/acumuladas/periodo?inicio=${formattedStart}&fim=${formattedEnd}`);
            } else {
                response = await api.get('/horas-extras/acumuladas');
            }
            
            setHorasExtras(response.data);
        } catch (err) {
            setError('Erro ao carregar horas extras. Tente novamente mais tarde.');
            console.error('Error fetching horas extras:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHorasExtras();
    }, [filterByPeriod]);

    const handleExport = () => {
        // Implementar lógica de exportação para CSV ou Excel
        console.log('Exporting data...');
    };

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        
        if (start && end) {
            fetchHorasExtras();
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Horas Extras Acumuladas</h1>
                    <p className="text-gray-600">
                        Visualização das horas extras acumuladas por colaborador
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilterByPeriod(!filterByPeriod)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${filterByPeriod ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                    >
                        <FiFilter size={16} />
                        {filterByPeriod ? 'Filtrando por período' : 'Filtrar por período'}
                    </button>
                    
                    <button
                        onClick={fetchHorasExtras}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Atualizar
                    </button>
                    
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <FiDownload size={16} />
                        Exportar
                    </button>
                </div>
            </div>
            
            {filterByPeriod && (
                <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Período:</label>
                        <DatePicker
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDateChange}
                            locale={ptBR}
                            dateFormat="dd/MM/yyyy"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            isClearable
                            withPortal
                        />
                        <span className="text-sm text-gray-500">
                            {startDate && endDate ? (
                                `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`
                            ) : 'Selecione um período'}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="mb-4 flex justify-end">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                    >
                        Tabela
                    </button>
                    <button
                        onClick={() => setViewMode('chart')}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                    >
                        Gráfico
                    </button>
                </div>
            </div>
            
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : viewMode === 'table' ? (
                <HorasExtrasTable data={horasExtras} />
            ) : (
                <HorasExtrasChart data={horasExtras} />
            )}
        </div>
    );
};

export default HorasExtrasPage;