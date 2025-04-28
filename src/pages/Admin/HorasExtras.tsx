import React, { useState, useEffect } from 'react';
import Template from './Template';
import api from '../../services/api';
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

    const handleExport = async () => {
        try {
            const response = await api.get('/horas-extras/export', {
                responseType: 'blob', // MUITO IMPORTANTE para baixar arquivo
            });

            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'horas_extras.csv'); // Nome do arquivo
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Erro ao exportar horas extras:', error);
            setError('Erro ao exportar horas extras.');
        }
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
        <Template>
            {/* (restante do seu HTML, botão Exportar incluso) */}
        </Template>
    );
};

export default HorasExtrasPage;
