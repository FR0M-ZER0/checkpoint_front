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
    const [adminComment, setAdminComment] = useState<string>(''); 
    const [modalError, setModalError] = useState<string | null>(null); 

    const openFeriasModal = (solicitacao: SolicitacaoFeriasData) => {
        setSelectedFeriasRequest(solicitacao);
        setAdminComment(''); // Limpa comentário anterior
        setModalError(null);  // Limpa erro anterior do modal
        setIsFeriasModalVisible(true);
    };
    const closeFeriasModal = () => {
        setSelectedFeriasRequest(null);
        setIsFeriasModalVisible(false);
    };
    const handleApproveFerias = async (id: string | number) => {
        if (!selectedFeriasRequest) return; // Segurança

        setIsLoading(true);
        setModalError(null);
        try {
           // CHAMA A API PARA APROVAR - AJUSTE O ENDPOINT E MÉTODO (PUT/PATCH)
           // Exemplo: Enviando status e comentário no corpo
           const response = await api.put(`/api/ferias/solicitacoes/${id}/aprovar`, { 
               // O backend pode precisar do status ou só o ato da chamada já aprova
               // status: 'APROVADO', 
               comentarioGestor: adminComment // Envia o comentário
           }); 
           // OU: await api.patch(`/api/ferias/solicitacoes/${id}`, { status: 'APROVADO', comentarioGestor: adminComment });

            // Verifique se a resposta da API foi OK (geralmente 200 ou 204)
            // O corpo da resposta pode ou não ser útil aqui
           // const updatedSolicitation = response.data; 

           toast.success('Solicitação de férias APROVADA com sucesso!');
           setVacationRequests(prev => prev.filter(req => req.id !== id)); // Remove da lista
           closeFeriasModal(); // Fecha o modal

        } catch (err: any) {
           console.error("Erro ao aprovar solicitação:", err);
           const errorMsg = err.response?.data?.erro || err.message || "Falha ao aprovar.";
           setModalError(errorMsg); // Mostra erro NO MODAL
        } finally {
            setIsLoading(false);
        }
    };

    const handleRejectFerias = async (id: string | number) => {
        if (!selectedFeriasRequest) return;

        // Validação simples para comentário na rejeição (opcional, pode ser regra de negócio)
        if (!adminComment || adminComment.trim() === '') {
            setModalError('É necessário adicionar um comentário para rejeitar a solicitação.');
            return;
        }

        setIsLoading(true);
        setModalError(null);
        try {
            // CHAMA A API PARA REJEITAR - AJUSTE O ENDPOINT E MÉTODO (PUT/PATCH)
            const response = await api.put(`/api/ferias/solicitacoes/${id}/rejeitar`, {
                // status: 'REJEITADO', // O backend pode inferir pelo endpoint
                comentarioGestor: adminComment
            });
            // OU: await api.patch(`/api/ferias/solicitacoes/${id}`, { status: 'REJEITADO', comentarioGestor: adminComment });

            toast.info('Solicitação de férias REJEITADA.');
            setVacationRequests(prev => prev.filter(req => req.id !== id)); // Remove da lista
            closeFeriasModal();

        } catch (err: any) {
            console.error("Erro ao rejeitar solicitação:", err);
            const errorMsg = err.response?.data?.erro || err.message || "Falha ao rejeitar.";
            setModalError(errorMsg); // Mostra erro NO MODAL
        } finally {
            setIsLoading(false);
        }
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
                
                {vacationRequests.map(request => {
                    const nome = request.colaborador?.nome || `Colab. ID: ${request.colaboradorId}`;
                    const dataCriacao = '--/--/----'; 
                    const inicioFmt = request.dataInicio ? formatDate(new Date(request.dataInicio + 'T00:00:00')) : '??';
                    const fimFmt = request.dataFim ? formatDate(new Date(request.dataFim + 'T00:00:00')) : '??';
                    
                    return (
                        <AdminNotificationCard
                            key={request.id}
                            cardType='ferias'
                            name={nome}
                            date={dataCriacao}
                            dayStart={inicioFmt}
                            dayEnd={fimFmt}
                            observation={request.observacao ?? undefined}
                            openModal={() => openFeriasModal(request)}
                        />
                    );
                })}
            </div>

            {/* Modal para Aprovar/Rejeitar Férias */}
            {isFeriasModalVisible && selectedFeriasRequest && (
                // Passando a função correta para fechar
                <Modal title="Detalhes da Solicitação de Férias" onClose={closeFeriasModal}>
                    {/* Detalhes da Solicitação */}
                    <div className='mb-4 text-left space-y-1 border-b pb-3'> {/* Separador visual */}
                         <p><strong>Solicitante:</strong> {selectedFeriasRequest.colaborador?.nome || `Colab. ID: ${selectedFeriasRequest.colaboradorId}`}</p>
                         <p><strong>Período Solicitado:</strong> {selectedFeriasRequest.dataInicio ? formatDate(new Date(selectedFeriasRequest.dataInicio + 'T00:00:00')) : '??'} até {selectedFeriasRequest.dataFim ? formatDate(new Date(selectedFeriasRequest.dataFim + 'T00:00:00')) : '??'}</p>
                         {selectedFeriasRequest.observacao && <p><strong>Observação Colab.:</strong> {selectedFeriasRequest.observacao}</p>}
                         <p><strong>Status Atual:</strong> {selectedFeriasRequest.status}</p>
                    </div>

                    {/* *** Campo de Comentário do Admin *** */}
                    <div className="mb-4 w-full">
                         <label htmlFor="adminComment" className="block text-sm font-medium text-gray-700 mb-1">
                             Comentário/Justificativa (Obrigatório para rejeitar):
                         </label>
                         <textarea
                             id="adminComment"
                             rows={3}
                             className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                             placeholder="Adicione um comentário..."
                             value={adminComment}
                             onChange={(e) => setAdminComment(e.target.value)}
                         />
                     </div>
                     {/* ************************************ */}

                     {/* Exibe erro da API dentro do modal */}
                     {modalError && <p className="text-red-600 mb-3 text-center font-semibold">{modalError}</p>}

                     {/* Botões de Ação */}
                     <div className='flex flex-col sm:flex-row justify-center gap-3'> {/* Layout ajustado */}
                         <button
                             className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg cursor-pointer disabled:opacity-70 w-full sm:w-auto' // Estilo Approvado
                             onClick={() => handleApproveFerias(selectedFeriasRequest.id)}
                             disabled={isLoading}
                         >
                            {isLoading ? 'Processando...' : 'Aprovar'}
                         </button>
                         <button
                             className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg cursor-pointer disabled:opacity-70 w-full sm:w-auto' // Estilo Rejeitado
                             onClick={() => handleRejectFerias(selectedFeriasRequest.id)}
                             disabled={isLoading}
                         >
                            {isLoading ? 'Processando...' : 'Rejeitar'}
                         </button>
                         <button
                             className='bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg cursor-pointer disabled:opacity-70 w-full sm:w-auto' // Estilo Cancelar
                             onClick={closeFeriasModal}
                             disabled={isLoading}
                             type="button" // Evita submit se estiver dentro de um form
                         >
                             Cancelar
                         </button>
                     </div>
                </Modal>
            )}

        </TemplateWithTitle>
    );
}

export default NotificationsPage;