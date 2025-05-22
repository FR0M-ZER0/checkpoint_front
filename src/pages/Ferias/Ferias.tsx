import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router'; // <<< CORRIGIDO IMPORT
import TemplateWithFilter from '../Employee/TemplateWithFilter';
import Modal from '../../components/Modal';
import { formatDate } from '../../utils/formatter';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, differenceInCalendarDays } from 'date-fns';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton'; // <<< ADICIONADO IMPORT DO SKELETON

// --- Interfaces (como no seu código) ---
interface SolicitacaoFeriasPayload {
    colaboradorId: number; // Espera número
    dataInicio: string;
    dataFim: string;
    observacao: string;
    status: string;
}

interface SolicitacaoAbonoPayload {
    colaboradorId: number; // Espera número
    diasVendidos: number;
    status: string;
}

interface SolicitacaoFeriasData {
    id: string | number;
    dataInicio: string; 
    dataFim: string;    
    observacao?: string | null;
    status: string;      
    criadoEm?: string;     
    comentarioGestor?: string | null;
}

interface SolicitacaoExibida {
    id: number | string;
    periodo: string;
    status: string;
    observacao?: string | null;
    comentarioGestor?: string | null;
}

interface VendaRealizada {
    id: number | string;
    diasVendidos?: number;
    dataSolicitacao?: string; 
    status?: string;
}

function Ferias() {
    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [observacao, setObservacao] = useState<string>('');
    const [isRequestModalVisible, setIsRequestModalVisible] = useState<boolean>(false);
    const [erroSolicitacao, setErroSolicitacao] = useState<string>('');

    const [diasVendidos, setDiasVendidos] = useState<number>(0);
    const [vendasRealizadas, setVendasRealizadas] = useState<VendaRealizada[]>([]); // Não parece ser usada para buscar da API
    const [erroVenda, setErroVenda] = useState<string>('');
    const [isVendaModalVisible, setIsVendaModalVisible] = useState<boolean>(false);

    const [minhasSolicitacoes, setMinhasSolicitacoes] = useState<SolicitacaoExibida[]>([]);
    const [isDecisaoModalVisible, setIsDecisaoModalVisible] = useState<boolean>(false);
    const [selectedDecisao, setSelectedDecisao] = useState<SolicitacaoExibida | null>(null);
    
    const [saldoDisponivel, setSaldoDisponivel] = useState<number | null>(null); // Inicia como null
    const [isLoadingSaldo, setIsLoadingSaldo] = useState<boolean>(true); // Inicia true
    const [isLoadingList, setIsLoadingList] = useState<boolean>(true); // Inicia true
    const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
    const [errorPage, setErrorPage] = useState<string | null>(null); // Para erros gerais de carregamento
    const [userId, setUserId] = useState<string | null>(null); // Inicia como null

    const navigate = useNavigate(); // Hook de navegação

    // --- Funções de Modal e Cálculo (mantidas do seu código) ---
    const closeVendaModal = (): void => setIsVendaModalVisible(false);
    const openVendaModal = (): void => { /* ... */ };
    const closeRequestModal = (): void => setIsRequestModalVisible(false);
    const openRequestModal = (): void => setIsRequestModalVisible(true);
    const openDecisaoModal = (solicitacao: SolicitacaoExibida) => { /* ... */ };
    const closeDecisaoModal = () => { /* ... */ };
    const calcularDiasFerias = (inicio: Date, fim: Date): number => { /* ... */ };

    // --- Funções de Fetch (Corrigidas) ---
    const fetchSaldo = useCallback(async () => {
        if (!userId) { // Não busca se não houver userId
            console.warn("Ferias.tsx - fetchSaldo: userId é nulo, não buscando saldo.");
            setSaldoDisponivel(null); // Garante que fica nulo
            setIsLoadingSaldo(false);
            return;
        }
        setIsLoadingSaldo(true);
        setErrorPage(null); 
        try {
            console.log(`Ferias.tsx - Chamando /api/ferias/saldo?colaboradorId=${userId}`);
            const response = await api.get(`/api/ferias/saldo?colaboradorId=${userId}`); // Endpoint corrigido
            if (typeof response.data === 'number') {
                setSaldoDisponivel(response.data);
            } else {
                console.warn("API /api/ferias/saldo não retornou um número:", response.data);
                setSaldoDisponivel(null); 
                setErrorPage("Formato de saldo inválido.");
            }
        } catch (error: any) {
            console.error("Erro ao buscar saldo (Ferias.tsx):", error);
            setErrorPage(error.response?.data?.erro || error.message || "Falha ao buscar saldo.");
            setSaldoDisponivel(null);
        } finally {
            setIsLoadingSaldo(false);
        }
    }, [userId]);

    const fetchMinhasSolicitacoes = useCallback(async () => {
        if (!userId) {
            console.warn("Ferias.tsx - fetchMinhasSolicitacoes: userId é nulo, não buscando solicitações.");
            setMinhasSolicitacoes([]);
            setIsLoadingList(false);
            return;
        }
        setIsLoadingList(true);
        setErrorPage(null); 
        try {
            console.log(`Ferias.tsx - Chamando /api/ferias/solicitacoes/colaborador/${userId}`);
            const response = await api.get(`/api/ferias/solicitacoes/colaborador/${userId}`);
            const dataFromApi: SolicitacaoFeriasData[] = response.data || [];
            const mappedSolicitacoes: SolicitacaoExibida[] = dataFromApi.map(req => ({
                id: req.id,
                periodo: `${req.dataInicio ? formatDate(new Date(req.dataInicio + 'T00:00:00')) : '??'} - ${req.dataFim ? formatDate(new Date(req.dataFim + 'T00:00:00')) : '??'}`,
                status: req.status,
                observacao: req.observacao,
                comentarioGestor: req.comentarioGestor
            }));
            setMinhasSolicitacoes(mappedSolicitacoes);
        } catch (err: any) {
            console.error("Erro ao buscar minhas solicitações (Ferias.tsx):", err);
            const errorMsg = err.response?.data?.erro || err.message || "Falha ao buscar histórico.";
            setErrorPage(errorMsg);
            setMinhasSolicitacoes([]);
        } finally {
            setIsLoadingList(false);
        }
    }, [userId]);

    // --- UseEffects (Corrigidos) ---
    useEffect(() => { // 1. Busca userId do localStorage na montagem
        const storedUserId = localStorage.getItem('id');
        if (storedUserId && storedUserId !== "null" && storedUserId.trim() !== "") {
            console.log("Ferias.tsx - UserID pego do localStorage:", storedUserId);
            setUserId(storedUserId);
        } else {
            console.error("Ferias.tsx - UserID NÃO encontrado ou inválido no localStorage! Redirecionando para login.");
            toast.error("Sessão inválida. Por favor, faça login novamente.");
            navigate('/login'); // Redireciona para o login
        }
    }, [navigate]); // Dependência 'navigate'

    useEffect(() => { // 2. Busca dados da página QUANDO userId estiver disponível e válido
        if (userId) { 
            console.log("Ferias.tsx - userId DEFINIDO no estado, chamando fetchSaldo e fetchMinhasSolicitacoes:", userId);
            fetchSaldo();
            fetchMinhasSolicitacoes();
        } else {
            console.log("Ferias.tsx - userId AINDA é nulo/inválido ou não carregado, aguardando...");
            // Se o primeiro useEffect já detectou que não há ID, ele já tratou o erro e loading.
        }
    }, [userId, fetchSaldo, fetchMinhasSolicitacoes]); // Roda quando userId ou as funções de fetch mudarem


    // --- Funções de Handler (Corrigidas para usar userId do estado) ---
    const handleSolicitarFerias = () => {
        setErroSolicitacao('');
        if (!dataInicio || !dataFim) { setErroSolicitacao('Selecione datas.'); return; }
        const dias = calcularDiasFerias(dataInicio, dataFim);
        if (dias <= 0) { setErroSolicitacao('Data fim inválida.'); return; }
        
        console.log('handleSolicitarFerias - Saldo Disponível CHECADO:', saldoDisponivel, 'Dias Solicitados:', dias);
        
        if (saldoDisponivel === null || dias > saldoDisponivel) { 
            setErroSolicitacao(`Saldo insuficiente. Disponível: ${saldoDisponivel ?? 'N/A'}d, Solicitados: ${dias}d`);
            return; 
        }
        openRequestModal();
    };

    const confirmarSolicitarFerias = async () => {
        if (!userId || !dataInicio || !dataFim) { // Adiciona checagem de userId
            setErroSolicitacao("Não foi possível enviar a solicitação: dados incompletos ou usuário não identificado.");
            return;
        }
        setIsLoadingAction(true); setErroSolicitacao('');
        try {
            const formattedDataInicio = format(dataInicio, 'yyyy-MM-dd');
            const formattedDataFim = format(dataFim, 'yyyy-MM-dd');
            
            // Payload usa parseInt para colaboradorId
            const payload: SolicitacaoFeriasPayload = { 
                colaboradorId: parseInt(userId, 10), // Converte userId string para number
                dataInicio: formattedDataInicio, 
                dataFim: formattedDataFim, 
                observacao: observacao, 
                status: 'Pendente' 
            };

            console.log("Enviando para /api/ferias/agendar, payload:", payload);
            await api.post('/api/ferias/agendar', payload); // <<< Endpoint CORRIGIDO

            setDataInicio(null); setDataFim(null); setObservacao('');
            closeRequestModal();
            toast.success('Solicitação de férias enviada!');
            fetchMinhasSolicitacoes(); 
            fetchSaldo(); 
        } catch (error: any) {
            console.error("Erro ao enviar solicitação de férias:", error);
            setErroSolicitacao(error.response?.data?.erro || error.message || 'Falha ao enviar solicitação.');
        } finally { setIsLoadingAction(false); }
    };

    const handleVenderDias = async () => {
        if (!userId) { // Adiciona checagem de userId
            setErroVenda("Não foi possível enviar a solicitação: usuário não identificado.");
            return;
        }
        if (diasVendidos <= 0) { setErroVenda('Selecione dias válidos para vender.'); return; }
        if (saldoDisponivel === null || diasVendidos > saldoDisponivel) { setErroVenda('Saldo insuficiente para vender esta quantidade.'); return; }
        
        setIsLoadingAction(true); setErroVenda('');
        try {
            const payload: SolicitacaoAbonoPayload = { 
                colaboradorId: parseInt(userId, 10), // Converte userId string para number
                diasVendidos: diasVendidos, 
                status: 'PENDENTE' 
            };
            console.log("Enviando para /api/ferias/vender, payload:", payload);
            await api.post('/api/ferias/vender', payload);

            setDiasVendidos(0);
            closeVendaModal();
            toast.success('Solicitação de venda de dias enviada!');
            fetchSaldo(); 
        } catch (error: any) {
             console.error("Erro ao vender férias:", error);
             setErroVenda(error.response?.data?.erro || error.message || 'Falha ao solicitar venda.');
        } finally { setIsLoadingAction(false); }
    };

    const incrementDias = () => setDiasVendidos(prev => Math.min((saldoDisponivel ?? 0), prev + 1)); // Limita ao saldo
    const decrementDias = () => setDiasVendidos(prev => Math.max(0, prev - 1));

    const diasSelecionados = dataInicio && dataFim ? calcularDiasFerias(dataInicio, dataFim) : 0;
    const saldoProjetadoFerias = saldoDisponivel !== null && diasSelecionados > 0 ? saldoDisponivel - diasSelecionados : saldoDisponivel;
    const saldoProjetadoVenda = saldoDisponivel !== null && diasVendidos > 0 ? saldoDisponivel - diasVendidos : saldoDisponivel;
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);

    return (
        <TemplateWithFilter filter={undefined}>
            <main className='w-full flex-col px-4 overflow-hidden max-w-screen-md mx-auto pb-20'>
                <h1 className="text-xl font-bold text-left md:text-center mb-4">Minhas Férias</h1>

                {errorPage && <p className="text-red-600 text-center mb-4 p-2 bg-red-100 border border-red-300 rounded-md">{errorPage}</p>}

                <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow text-center">
                    <h2 className="text-lg font-semibold text-gray-700">Saldo disponível</h2>
                     {isLoadingSaldo ? ( <p className="text-xl text-gray-500">...</p> )
                      : ( <p className={`text-3xl font-bold ${saldoDisponivel !== null && saldoDisponivel <= 0 ? 'text-red-600' : 'text-green-600'}`}>{saldoDisponivel ?? '-'}d</p> )}
                </div>

                 <div className="mb-6 p-4 border rounded-lg shadow bg-white">
                     <h2 className="text-lg font-semibold mb-3 text-center text-gray-800">Solicitar Novas Férias</h2>
                     <div className="mb-4 flex justify-center"><Calendar minDate={hoje} selectRange={true} value={dataInicio && dataFim ? [dataInicio, dataFim] : null} onChange={(d: any) => { if(Array.isArray(d)){setDataInicio(d[0]); setDataFim(d[1]);} setErroSolicitacao('');}} /></div>
                     {diasSelecionados > 0 && saldoDisponivel !== null && (<p className="text-sm text-center text-blue-600 mb-3">({diasSelecionados} dias selecionados. Saldo ficaria: {saldoProjetadoFerias}d se aprovado)</p>)}
                     <div className="mb-4"><label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-1">Observação (opcional):</label><textarea id="observacao" rows={3} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2" placeholder="Sua observação..." value={observacao} onChange={(e) => setObservacao(e.target.value)} /></div>
                     <div className="flex justify-center"><button onClick={handleSolicitarFerias} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 py-2 rounded-lg disabled:opacity-50" disabled={!dataInicio || !dataFim || isLoadingAction}>Abrir Confirmação</button></div>
                     {erroSolicitacao && !isRequestModalVisible && <p className="text-red-600 mt-3 text-center">{erroSolicitacao}</p>}
                 </div>

                 <div className="mb-6 p-4 border rounded-lg shadow bg-white">
                     <h2 className="text-lg font-semibold mb-3 text-center text-gray-800">Vender Dias</h2>
                     <div className="w-full sm:w-52 h-10 flex items-center justify-between shadow-md mx-auto mb-4 border border-gray-300 rounded-lg bg-gray-50 p-2">
                         <button onClick={decrementDias} className="bg-main-blue-color text-black font-bold px-4 py-1 rounded-md text-lg">-</button>
                         <span className="text-xl font-semibold mx-4">{diasVendidos}</span>
                         <button onClick={incrementDias} className="bg-main-blue-color text-black font-bold px-4 py-1 rounded-md text-lg">+</button>
                     </div>
                     {diasVendidos > 0 && saldoDisponivel !== null && (<p className="text-sm text-center text-orange-600 mb-3">(Saldo ficaria: {saldoProjetadoVenda}d se aprovado)</p>)}
                     <div className="flex justify-center"><button onClick={openVendaModal} className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 px-6 py-2 rounded-lg disabled:opacity-50" disabled={diasVendidos <= 0 || isLoadingAction}>Solicitar Venda</button></div>
                     {erroVenda && !isVendaModalVisible && <p className="text-red-600 mt-3 text-center">{erroVenda}</p>}
                 </div>

                 <div className="mb-6 p-4 border rounded-lg shadow bg-white">
                     <h3 className="text-lg font-semibold mb-2 text-gray-800">Minhas Solicitações de Férias</h3>
                     {isLoadingList && <p className='text-gray-500'>Carregando...</p>}
                     {errorPage && !isLoadingList && <p className='text-red-500'>Erro ao carregar histórico.</p>}
                     {!isLoadingList && minhasSolicitacoes.length === 0 && !errorPage && ( <p className='text-gray-500'>Nenhuma solicitação enviada.</p> )}
                     {minhasSolicitacoes.length > 0 && (
                         <ul className="list-none pl-0 space-y-2">
                             {minhasSolicitacoes.map((item) => {
                                 const isPendente = item.status === 'PENDENTE' || item.status === 'Pendente';
                                 const isClickable = !isPendente; 
                                 let statusBgColor = 'bg-gray-100 border-gray-300';
                                 let statusTextColor = 'text-gray-700';
                                 if (item.status === 'APROVADO') { statusBgColor = 'bg-green-100 border-green-300'; statusTextColor = 'text-green-800'; }
                                 else if (item.status === 'REJEITADO') { statusBgColor = 'bg-red-100 border-red-300'; statusTextColor = 'text-red-800'; }
                                 else if (isPendente) { statusBgColor = 'bg-yellow-100 border-yellow-300'; statusTextColor = 'text-yellow-800'; }

                                 return (
                                     <li
                                         key={item.id}
                                         className={`p-2 border rounded-md flex justify-between items-center ${statusBgColor} ${isClickable ? 'cursor-pointer hover:shadow-md hover:border-blue-400' : ''}`}
                                         onClick={isClickable ? () => openDecisaoModal(item) : undefined}
                                         title={isClickable ? "Clique para ver detalhes da decisão" : ""}
                                     >
                                         <span className='text-sm font-medium text-gray-900'>{item.periodo}</span>
                                         {item.status && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusTextColor}`}>{item.status}</span>}
                                     </li>
                                 );
                            })}
                         </ul>
                     )}
                 </div>

            </main>
             {isRequestModalVisible && dataInicio && dataFim && (
                 <Modal title='Confirmar Solicitação de Férias' onClose={closeRequestModal}>
                     <div className='mb-6 text-left space-y-2'>
                         <p><strong>Período:</strong> {formatDate(dataInicio)} - {formatDate(dataFim)}</p>
                         <p><strong>Dias Solicitados:</strong> {diasSelecionados} dia(s)</p>
                         {observacao && <p><strong>Observação:</strong> {observacao}</p>}
                         <p className='pt-3 font-semibold'>Confirmar envio da solicitação?</p>
                         {erroSolicitacao && <p className="text-red-600 mt-4 text-center font-semibold">{erroSolicitacao}</p>}
                     </div>
                     <div className='flex justify-center'>
                         <button className='main-func-color px-8 py-2 rounded-lg mr-4 cursor-pointer disabled:opacity-70 main-white-text' onClick={confirmarSolicitarFerias} disabled={isLoadingAction}>{isLoadingAction ? 'Enviando...' : 'Confirmar'}</button>
                         <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer disabled:opacity-70 main-white-text' onClick={closeRequestModal} disabled={isLoadingAction}>Cancelar</button>
                     </div>
                 </Modal>
             )}

             {isVendaModalVisible && (
                <Modal title='Confirmar Venda de Dias' onClose={closeVendaModal}>
                     <div className='mb-6 text-center'>
                         <p>Deseja realmente solicitar a venda de <strong className='text-xl'>{diasVendidos}</strong> dia(s) de férias?</p>
                         {erroVenda && <p className="text-red-600 mt-4 text-center font-semibold">{erroVenda}</p>}
                     </div>
                     <div className='flex justify-center'>
                         <button className='main-func-color px-8 py-2 rounded-lg mr-4 cursor-pointer disabled:opacity-70 main-white-text' onClick={handleVenderDias} disabled={isLoadingAction}>{isLoadingAction ? 'Enviando...' : 'Confirmar'}</button>
                         <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer disabled:opacity-70 main-white-text' onClick={closeVendaModal} disabled={isLoadingAction}>Cancelar</button>
                     </div>
                 </Modal>
            )}

             {isDecisaoModalVisible && selectedDecisao && (
                 <Modal title="Detalhes da Decisão da Solicitação" onClose={closeDecisaoModal}>
                     <div className='mb-6 text-left space-y-2'>
                         <p><strong>Período:</strong> {selectedDecisao.periodo}</p>
                         <p><strong>Status:</strong>
                            <span className={`ml-2 font-semibold ${selectedDecisao.status === 'APROVADO' ? 'text-green-700' : selectedDecisao.status === 'REJEITADO' ? 'text-red-700' : 'text-gray-700'}`}>
                                {selectedDecisao.status}
                            </span>
                         </p>
                         {selectedDecisao.observacao && <p className='text-sm text-gray-600'><strong>Sua Observação Enviada:</strong> {selectedDecisao.observacao}</p>}
                         <div className='mt-3 pt-3 border-t'>
                            <p className='text-sm font-medium text-gray-800 mb-1'>Comentário do Gestor:</p>
                            {selectedDecisao.comentarioGestor ? (
                                <p className='text-sm text-gray-700 whitespace-pre-wrap'>{selectedDecisao.comentarioGestor}</p>
                            ) : (
                                <p className='text-sm text-gray-500 italic'>Nenhum comentário adicionado.</p>
                            )}
                         </div>
                     </div>
                     <div className='flex justify-end'>
                         <button className='sec-func-color px-6 py-2 rounded-lg cursor-pointeruserId main-white-text' onClick={closeDecisaoModal}> Fechar </button>
                     </div>
                 </Modal>
             )}
        </TemplateWithFilter>
    );
}

export default Ferias;