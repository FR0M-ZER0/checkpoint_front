import React, { useState } from 'react';
import { HorasExtrasAcumuladasDTO } from '../types/HorasExtrasTypes';
import { FiChevronRight } from 'react-icons/fi';
import ModalDetalhesHoras from './ModalDetalhesHoras';
import  api  from '../services/api';

interface HorasExtrasTableProps {
    data: HorasExtrasAcumuladasDTO[];
}

interface HoraExtraDetalhe {
    id: number;
    data: string;
    horas: string;
    status: string;
}

const HorasExtrasTable: React.FC<HorasExtrasTableProps> = ({ data }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState<{
        id: number;
        nome: string;
    } | null>(null);
    const [loadingDetalhes, setLoadingDetalhes] = useState(false);
    const [horasDetalhadas, setHorasDetalhadas] = useState<HoraExtraDetalhe[]>([]);
    const [error, setError] = useState<string | null>(null);

    const formatHours = (hours: number) => {
        const totalHours = Math.floor(hours);
        const minutes = Math.round((hours - totalHours) * 60);
        return `${totalHours}h${minutes > 0 ? `${minutes}m` : ''}`;
    };

    const handleVerDetalhes = async (colaboradorId: number, colaboradorNome: string) => {
        setColaboradorSelecionado({ id: colaboradorId, nome: colaboradorNome });
        setLoadingDetalhes(true);
        setError(null);
        
        try {
            const response = await api.get(`/horas-extras/colaborador/${colaboradorId}/aprovadas`);
            setHorasDetalhadas(response.data.map((item: any) => ({
                id: item.id,
                data: item.criadoEm, 
                horas: item.saldo,    
                status: item.status, 
            })));
            setModalOpen(true);
        } catch (err) {
            setError('Erro ao carregar detalhes das horas extras');
            console.error(err);
        } finally {
            setLoadingDetalhes(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Colaborador
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total de Horas
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Detalhes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium">
                                                        {item.colaboradorNome.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.colaboradorNome}</div>
                                                    <div className="text-sm text-gray-500">ID: {item.colaboradorId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {formatHours(item.totalHoras)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button 
                                                onClick={() => handleVerDetalhes(item.colaboradorId, item.colaboradorNome)}
                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                disabled={loadingDetalhes}
                                            >
                                                <span>Ver detalhes</span>
                                                <FiChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Nenhum dado encontrado
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && colaboradorSelecionado && (
                <ModalDetalhesHoras 
                    colaborador={colaboradorSelecionado}
                    horasDetalhadas={horasDetalhadas}
                    loading={loadingDetalhes}
                    error={error}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
};

export default HorasExtrasTable;