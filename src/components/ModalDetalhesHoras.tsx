import React from 'react';
import { FiX, FiCalendar, FiClock } from 'react-icons/fi';

interface ModalDetalhesHorasProps {
    colaborador: {
        id: number;
        nome: string;
    };
    horasDetalhadas: Array<{
        id: number;
        data: string;
        horas: string;
        status: string;
    }>;
    loading: boolean;
    error: string | null;
    onClose: () => void;
}

const ModalDetalhesHoras: React.FC<ModalDetalhesHorasProps> = ({ 
    colaborador, 
    horasDetalhadas,
    loading,
    error,
    onClose 
}) => {
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Detalhes de Horas Extras - {colaborador.nome}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={20} />
                    </button>
                </div>
                
                <div className="p-6 flex-grow overflow-auto">
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {horasDetalhadas.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {horasDetalhadas.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <FiCalendar className="mr-2 text-gray-500" />
                                                        {formatDateTime(item.data)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <FiClock className="mr-2 text-gray-500" />
                                                        {item.horas}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        item.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                                                        item.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Nenhuma hora extra aprovada encontrada
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="border-t px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDetalhesHoras;