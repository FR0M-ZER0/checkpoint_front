import React, { useState, useEffect } from 'react';
import TemplateWithTitle from './TemplateWithTitle'; // Ajuste o caminho
import Filter from '../../components/Filter';       // Ajuste o caminho
import SortBy from '../../components/SortBy';       // Ajuste o caminho
import AdminNotificationCard from '../../components/AdminNotificationCard'; // Importa o card ADAPTADO
import Modal from '../../components/Modal';         // Para o futuro modal de aprovação
import { formatDate } from '../../utils/formatter'; // Ajuste o caminho
import api from '../../services/api';               // Ajuste o caminho
import { toast } from 'react-toastify';
// Não precisa de Redux aqui por enquanto

// Interface para os dados que a API /api/solicitacoes-ferias retorna
// AJUSTE CONFORME A RESPOSTA REAL DA SUA API!
interface SolicitacaoFeriasData {
    id: string | number;             // Nome correto: id
    dataInicio: string;            // Nome correto: dataInicio
    dataFim: string;               // Nome correto: dataFim
    observacao?: string | null;    // Nome correto: observacao (pode ser null)
    status: string;                // Nome correto: status
    colaboradorId: number;         // Nome correto: colaboradorId
    // criado_em?: string;          // Comente ou remova se não vier da API
    colaborador?: {                // Estrutura aninhada está correta
        id: number;
        nome: string;              // Nome correto: nome
        // Outros campos do colaborador se precisar
    };
}

function NotificationsPage() {
    // Estado para as solicitações de férias
    const [vacationRequests, setVacationRequests] = useState<SolicitacaoFeriasData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Estado e funções para o FUTURO modal de aprovação/rejeição de férias
    const [isFeriasModalVisible, setIsFeriasModalVisible] = useState(false);
    const [selectedFeriasRequest, setSelectedFeriasRequest] = useState<SolicitacaoFeriasData | null>(null);

    const openFeriasModal = (solicitacao: SolicitacaoFeriasData) => {
        setSelectedFeriasRequest(solicitacao);
        setIsFeriasModalVisible(true);
        // alert(`Modal para solicitação ${solicitacao.sol_fer_id} será implementado.`);
    };
    const closeFeriasModal = () => {
        setSelectedFeriasRequest(null);
        setIsFeriasModalVisible(false);
    };
    const handleApproveFerias = async (id: string | number) => {
         // TODO: Chamar API PUT/POST para aprovar a solicitação com o ID
         console.log("Aprovar solicitação ID:", id);
         toast.success("Funcionalidade de aprovar ainda não implementada.");
         closeFeriasModal();
         // Após sucesso na API, remover da lista local ou re-buscar
         // setVacationRequests(prev => prev.filter(req => req.sol_fer_id !== id));
    };
     const handleRejectFerias = async (id: string | number) => {
         // TODO: Chamar API PUT/POST para rejeitar a solicitação com o ID
         console.log("Rejeitar solicitação ID:", id);
         toast.info("Funcionalidade de rejeitar ainda não implementada.");
         closeFeriasModal();
          // Após sucesso na API, remover da lista local ou re-buscar
         // setVacationRequests(prev => prev.filter(req => req.sol_fer_id !== id));
     };


    // Busca as solicitações de férias pendentes quando o componente monta
    useEffect(() => {
        const fetchPendingVacations = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // CHAMA A API - Verifique o endpoint e parâmetros corretos!
                const response = await api.get('/api/ferias/solicitacoes', {
                    params: { status: 'PENDENTE' } // Exemplo de filtro
                });

                // Ajuste 'response.data' conforme a estrutura real da sua resposta
                setVacationRequests(response.data || []);

            } catch (err: any) {
                console.error("Erro ao buscar solicitações de férias:", err);
                const errorMsg = err.response?.data?.erro || err.message || "Falha ao buscar dados.";
                setError(errorMsg);
                setVacationRequests([]); // Limpa em caso de erro
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingVacations();
    }, []); // Executa apenas uma vez ao montar

    return (
        // Usando TemplateWithTitle como no seu código original
        <TemplateWithTitle title='Solicitações Pendentes'>
            {/* Filtros e Ordenação (Mantidos - ajuste se necessário) */}
            <div>
                <div className='mt-6'><Filter/></div>
                <div className='mt-4'><SortBy/></div>
            </div>

             {/* Seção para Férias Pendentes */}
             <h2 className="text-lg font-semibold mt-8 mb-4 text-gray-700">Solicitações de Férias</h2>
            {isLoading && <p className='text-center text-gray-500'>Carregando...</p>}
            {error && <p className='text-center text-red-500'>Erro: {error}</p>}
            {!isLoading && vacationRequests.length === 0 && !error && (
                 <p className='text-center text-gray-500'>Nenhuma solicitação de férias pendente.</p>
             )}
             {/* Grid para os cards */}
             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
                {
                    vacationRequests.map(request => {
                        // ***** ACESSANDO COM OS NOMES CORRETOS *****
                        const nome = request.colaborador?.nome || `Colab. ID: ${request.colaboradorId}`; // Usa request.colaborador.nome e request.colaboradorId
                        // const dataCriacao = request.criado_em ? formatDate(new Date(request.criado_em)) : '--/--/----'; // criado_em parece faltar
                        const dataCriacao = '--/--/----'; // Placeholder enquanto criado_em não vem
                        const inicioFmt = request.dataInicio ? formatDate(new Date(request.dataInicio + 'T00:00:00')) : '??'; // Usa request.dataInicio
                        const fimFmt = request.dataFim ? formatDate(new Date(request.dataFim + 'T00:00:00')) : '??';       // Usa request.dataFim

                        return (
                            <AdminNotificationCard
                                key={request.id} // <<< Usa request.id
                                cardType='ferias'
                                name={nome}
                                date={dataCriacao} // Usando placeholder por enquanto
                                dayStart={inicioFmt}
                                dayEnd={fimFmt}
                                observation={request.observacao ?? undefined} // Usa request.observacao (passa undefined se for null)
                                openModal={() => openFeriasModal(request)} // Passa o objeto request inteiro
                            />
                        );
                    })
                }
            </div>

            {/* Modal para Aprovar/Rejeitar Férias */}
            {isFeriasModalVisible && selectedFeriasRequest && (
                <Modal title="Detalhes da Solicitação de Férias" onClose={closeFeriasModal}>
                    <div className='mb-6 text-left space-y-2'>
                        {/* ***** ACESSANDO COM OS NOMES CORRETOS ***** */}
                         <p><strong>Solicitante:</strong> {selectedFeriasRequest.colaborador?.nome || `Colab. ID: ${selectedFeriasRequest.colaboradorId}`}</p>
                         <p><strong>Período Solicitado:</strong> {selectedFeriasRequest.dataInicio ? formatDate(new Date(selectedFeriasRequest.dataInicio + 'T00:00:00')) : '??'} até {selectedFeriasRequest.dataFim ? formatDate(new Date(selectedFeriasRequest.dataFim + 'T00:00:00')) : '??'}</p>
                         {selectedFeriasRequest.observacao && <p><strong>Observação:</strong> {selectedFeriasRequest.observacao}</p>}
                         <p><strong>Status Atual:</strong> {selectedFeriasRequest.status}</p>
                     </div>
                     <div className='flex justify-center'>
                         <button
                             className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg mr-4 cursor-pointer disabled:opacity-70'
                             onClick={() => handleApproveFerias(selectedFeriasRequest.id)} // <<< Usa .id
                             disabled={isLoading}
                         > Aprovar </button>
                         <button
                             className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg cursor-pointer disabled:opacity-70'
                             onClick={() => handleRejectFerias(selectedFeriasRequest.id)} // <<< Usa .id
                             disabled={isLoading}
                         > Rejeitar </button>
                     </div>
                </Modal>
            )}

        </TemplateWithTitle>
    );
}

export default NotificationsPage;