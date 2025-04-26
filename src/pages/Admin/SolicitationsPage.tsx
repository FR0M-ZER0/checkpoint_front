// src/pages/Admin/SolicitationsPage.tsx (ou NotificationsPage.tsx)

import React, { FormEvent, useState, useEffect, useCallback } from 'react';
import TemplateWithTitle from './TemplateWithTitle'; // Ajuste o caminho
import Filter from '../../components/Filter';       // Ajuste o caminho
import SortBy from '../../components/SortBy';       // Ajuste o caminho
import AdminNotificationCard from '../../components/AdminNotificationCard'; // O card genérico ADAPTADO
import Modal from '../../components/Modal';         // Seu componente Modal
import { formatDate } from '../../utils/formatter'; // Ajuste o caminho
import api from '../../services/api';               // Ajuste o caminho
import { toast } from 'react-toastify';
// Removidos imports/lógica do Redux para Ajuste de Ponto para focar em Férias.
// Se precisar deles, precisam ser reintegrados e os erros TS corrigidos.
// import { RootState } from '../../redux/store';
// import { useSelector, useDispatch } from 'react-redux';
// import { removeSolicitation } from '../../redux/slices/solicitationSlice';


// Interface para Férias da API (espera Page<SolicitacaoFeriasData>)
interface SolicitacaoFeriasData {
    id: string | number;
    dataInicio: string;
    dataFim: string;
    observacao?: string | null;
    status: string;
    colaboradorId: number;
    criadoEm?: string;
    comentarioGestor?: string | null;
    colaborador?: { nome: string; };
}

// --- Componente Principal ---
function SolicitationsPage() {
    // === Estados para FÉRIAS ===
    const [vacationRequests, setVacationRequests] = useState<SolicitacaoFeriasData[]>([]); // Guarda dados da PÁGINA ATUAL
    const [isLoadingVacations, setIsLoadingVacations] = useState<boolean>(false);
    const [errorVacations, setErrorVacations] = useState<string | null>(null);
    const [isFeriasModalVisible, setIsFeriasModalVisible] = useState(false);
    const [selectedFeriasRequest, setSelectedFeriasRequest] = useState<SolicitacaoFeriasData | null>(null);
    const [adminComment, setAdminComment] = useState<string>('');
    const [modalError, setModalError] = useState<string | null>(null);
    const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false); // Loading das ações do modal (Aprovar/Rejeitar)

    // *** Estados para PAGINAÇÃO ***
    const [currentPage, setCurrentPage] = useState<number>(0); // Página inicial (base 0 para APIs Spring Pageable)
    const [totalPages, setTotalPages] = useState<number>(0);   // Total de páginas vindo da API
    const [totalItems, setTotalItems] = useState<number>(0);   // Total de itens vindo da API
    const ITEMS_PER_PAGE = 12; // Ou o valor que você preferir/definir no backend (@PageableDefault(size=...))
    // ******************************

    // --- Funções Modal Férias ---
    const openFeriasModal = (solicitacao: SolicitacaoFeriasData) => {
        setSelectedFeriasRequest(solicitacao);
        setAdminComment(''); setModalError(null); setIsFeriasModalVisible(true);
    };
    const closeFeriasModal = () => {
        setSelectedFeriasRequest(null); setIsFeriasModalVisible(false);
    };

    // --- Lógica de Aprovar/Rejeitar Férias (com API) ---
    const handleApproveFerias = async (id: string | number) => {
        // ... (Implementação como na resposta #77 ou #81) ...
         if (!selectedFeriasRequest) return;
         setIsLoadingAction(true); setModalError(null);
         try {
             await api.put(`/api/ferias/solicitacoes/${id}/aprovar`, { comentarioGestor: adminComment });
             toast.success('Solicitação APROVADA!');
             // Após sucesso, remove localmente E busca a página atual de novo para consistência
             setVacationRequests(prev => prev.filter(req => req.id !== id)); 
             fetchPendingVacations(currentPage); // Rebusca página atual
             closeFeriasModal();
         } catch (err: any) { setModalError(err.response?.data?.erro || "Falha ao aprovar."); } 
         finally { setIsLoadingAction(false); }
    };
    const handleRejectFerias = async (id: string | number) => {
        // ... (Implementação como na resposta #77 ou #81) ...
         if (!selectedFeriasRequest) return;
         if (!adminComment || adminComment.trim() === '') { setModalError('Comentário obrigatório.'); return; }
         setIsLoadingAction(true); setModalError(null);
         try {
             await api.put(`/api/ferias/solicitacoes/${id}/rejeitar`, { comentarioGestor: adminComment });
             toast.info('Solicitação REJEITADA.');
             setVacationRequests(prev => prev.filter(req => req.id !== id));
             fetchPendingVacations(currentPage); // Rebusca página atual
             closeFeriasModal();
         } catch (err: any) { setModalError(err.response?.data?.erro || "Falha ao rejeitar."); }
          finally { setIsLoadingAction(false); }
    };

    // --- Função para buscar solicitações de férias PAGINADAS ---
    // Usando useCallback para memoizar a função
    const fetchPendingVacations = useCallback(async (page: number) => {
        setIsLoadingVacations(true);
        setErrorVacations(null);
        try {
            // Passa page e size como parâmetros para a API
            const response = await api.get('/api/ferias/solicitacoes', {
                params: {
                    status: 'PENDENTE', // Ou outro status se necessário
                    page: page,          // Envia a página solicitada
                    size: ITEMS_PER_PAGE
                 }
            });

            // Processa a resposta paginada do Spring Data JPA
             if (response.data && typeof response.data === 'object' && Array.isArray(response.data.content)) {
                 setVacationRequests(response.data.content);
                 setTotalPages(response.data.totalPages || 0);
                 setTotalItems(response.data.totalElements || 0);
                 // Opcional: ajustar currentPage se a API retornar um número de página diferente do solicitado
                 // setCurrentPage(response.data.number || 0); 
             } else {
                 // Fallback se a API retornar um array simples (sem paginação)
                 console.warn("API não retornou objeto Page esperado.");
                 setVacationRequests(Array.isArray(response.data) ? response.data : []);
                 setTotalPages(Array.isArray(response.data) && response.data.length > 0 ? 1 : 0);
                 setTotalItems(Array.isArray(response.data) ? response.data.length : 0);
                 setCurrentPage(0); // Reseta para página 0
             }

        } catch (err: any) {
            console.error("Erro ao buscar solicitações de férias:", err);
            const errorMsg = err.response?.data?.erro || err.message || "Falha ao buscar dados.";
            setErrorVacations(errorMsg);
            setVacationRequests([]); // Limpa em caso de erro
        } finally {
            setIsLoadingVacations(false);
        }
     // Depende de ITEMS_PER_PAGE se ele puder mudar
    }, [ITEMS_PER_PAGE]); 

    // useEffect que chama a busca quando a página mudar ou ao montar
    useEffect(() => {
        fetchPendingVacations(currentPage);
    }, [currentPage, fetchPendingVacations]); // Depende de currentPage e da função de busca

     // Função para mudar de página (chamada pelos botões de paginação)
     const handlePageChange = (newPage: number) => {
         if (newPage >= 0 && newPage < totalPages) {
             setCurrentPage(newPage);
         }
     };

    // --- JSX ---
    return (
        <TemplateWithTitle title='Solicitações Pendentes'>
            {/* Filtros e Ordenação */}
            <div>
                <div className='mt-6'><Filter/></div>
                <div className='mt-4'><SortBy/></div>
            </div>

            {/* TODO: Adicionar Seção para Ajustes de Ponto (do Redux) aqui, se necessário */}
            {/* <h2 className="text-lg font-semibold mt-8 mb-4 text-gray-700">Ajustes de Ponto</h2> */}
            {/* <div className='grid ...'> ... map solicitations ... </div> */}

            {/* Seção para Férias Pendentes */}
            <h2 className="text-lg font-semibold mt-8 mb-4 text-gray-700">Solicitações de Férias</h2>
            {isLoadingVacations && <p className='text-center text-gray-500'>Carregando...</p>}
            {errorVacations && <p className='text-center text-red-500'>Erro: {errorVacations}</p>}
            {!isLoadingVacations && vacationRequests.length === 0 && !errorVacations && (
                 <p className='text-center text-gray-500'>Nenhuma solicitação de férias pendente.</p>
             )}
             {/* Grid para os cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
                {
                    vacationRequests.map(request => {
                        const nome = request.colaborador?.nome || `Colab. ID: ${request.colaboradorId}`;
                        const dataCriacao = request.criadoEm ? formatDate(new Date(request.criadoEm)) : '--/--/----';
                        const inicioFmt = request.dataInicio ? formatDate(new Date(request.dataInicio + 'T00:00:00')) : '??';
                        const fimFmt = request.dataFim ? formatDate(new Date(request.dataFim + 'T00:00:00')) : '??';

                        return (
                            <AdminNotificationCard
                                key={'ferias-' + request.id}
                                cardType='ferias' // Para o estilo verde
                                name={nome}
                                date={dataCriacao}
                                dayStart={inicioFmt}
                                dayEnd={fimFmt}
                                observation={request.observacao ?? undefined}
                                openModal={() => openFeriasModal(request)} // Abre modal de FÉRIAS
                            />
                        );
                    })
                }
            </div>

            {/* ****** CONTROLES DE PAGINAÇÃO ****** */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-3">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)} // Botão Anterior
                        disabled={currentPage === 0 || isLoadingVacations}
                        className="px-4 py-2 border rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-600">
                        Página {currentPage + 1} de {totalPages}
                        {/* ({totalItems} itens) */}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)} // Botão Próxima
                        disabled={currentPage >= totalPages - 1 || isLoadingVacations}
                        className="px-4 py-2 border rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>
            )}
            {/* ************************************ */}

             {/* --- Modal Férias (Aprovar/Rejeitar) --- */}
             {isFeriasModalVisible && selectedFeriasRequest && (
                 <Modal title="Detalhes da Solicitação de Férias" onClose={closeFeriasModal}>
                     {/* Detalhes */}
                     <div className='mb-4 text-left space-y-1 border-b pb-3'>
                         <p><strong>Solicitante:</strong> {selectedFeriasRequest.colaborador?.nome || `Colab. ID: ${selectedFeriasRequest.colaboradorId}`}</p>
                         <p><strong>Período Solicitado:</strong> {selectedFeriasRequest.dataInicio ? formatDate(new Date(selectedFeriasRequest.dataInicio + 'T00:00:00')) : '??'} até {selectedFeriasRequest.dataFim ? formatDate(new Date(selectedFeriasRequest.dataFim + 'T00:00:00')) : '??'}</p>
                         {selectedFeriasRequest.observacao && <p><strong>Observação Colab.:</strong> {selectedFeriasRequest.observacao}</p>}
                         <p><strong>Status Atual:</strong> {selectedFeriasRequest.status}</p>
                     </div>
                     {/* Comentário Admin */}
                     <div className="mb-4 w-full">
                         <label htmlFor="adminComment" className="block text-sm font-medium text-gray-700 mb-1">Comentário/Justificativa (Obrigatório para rejeitar):</label>
                         <textarea id="adminComment" rows={3} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2" placeholder="Adicione um comentário..." value={adminComment} onChange={(e) => setAdminComment(e.target.value)} />
                     </div>
                     {/* Erro Modal */}
                     {modalError && <p className="text-red-600 mb-3 text-center font-semibold">{modalError}</p>}
                     {/* Botões Ação */}
                     <div className='flex flex-col sm:flex-row justify-center gap-3'>
                         <button className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg cursor-pointer disabled:opacity-70 w-full sm:w-auto' onClick={() => handleApproveFerias(selectedFeriasRequest.id)} disabled={isLoadingAction}> {isLoadingAction ? 'Processando...' : 'Aprovar'} </button>
                         <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg cursor-pointer disabled:opacity-70 w-full sm:w-auto' onClick={() => handleRejectFerias(selectedFeriasRequest.id)} disabled={isLoadingAction}> {isLoadingAction ? 'Processando...' : 'Rejeitar'} </button>
                         <button className='bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg cursor-pointer disabled:opacity-70 w-full sm:w-auto' onClick={closeFeriasModal} disabled={isLoadingAction} type="button"> Cancelar </button>
                     </div>
                 </Modal>
             )}

             {/* Modal de Ajuste de Ponto (Comentado - Adicionar se necessário) */}
             {/* {isAjusteModalVisible && ( <Modal title='Solicitação para ajuste...' onClose={closeModalAjustePonto}> ... </Modal> )} */}

        </TemplateWithTitle>
    );
}

export default SolicitationsPage;