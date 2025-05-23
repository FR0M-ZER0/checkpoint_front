import React, { useState, useEffect, useCallback } from 'react';
import TemplateWithFilter from '../Employee/TemplateWithFilter'; // Ajuste o caminho
import Modal from '../../components/Modal';                   // Ajuste o caminho
import { formatDate } from '../../utils/formatter';           // Ajuste o caminho
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, differenceInCalendarDays, getDay } from 'date-fns';
import api from '../../services/api';                         // Ajuste o caminho
import { toast } from 'react-toastify';                       // Se usar toast

interface SolicitacaoFeriasPayload {
    colaboradorId: number;
    dataInicio: string;
    dataFim: string;
    observacao: string;
    status: string;
}

interface SolicitacaoAbonoPayload {
    colaboradorId: number;
    diasVendidos: number;
    status: string;
}

interface SolicitacaoFeriasData {
    id: string | number;
    dataInicio: string;         // Formato AAAA-MM-DD vindo da API
    dataFim: string;            // Formato AAAA-MM-DD vindo da API
    observacao?: string | null; // Observação do colaborador
    status: string;             // PENDENTE, APROVADO, REJEITADO
    criadoEm?: string;          // Opcional - Data/Hora da criação da solicitação
    comentarioGestor?: string | null; // Comentário do gestor (IMPORTANTE VIR DA API)
}

interface SolicitacaoExibida {
    id: number | string;
    periodo: string; // String formatada "DD/MM/AAAA - DD/MM/AAAA"
    status: string;
    observacao?: string | null;
    comentarioGestor?: string | null;
}

interface VendaRealizada {
    id: number | string;
    diasVendidos?: number;
    dataSolicitacao?: string; // Data formatada
    status?: string;
}

function Ferias() {
    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [observacao, setObservacao] = useState<string>('');
    const [isRequestModalVisible, setIsRequestModalVisible] = useState<boolean>(false); // Modal de submissão
    const [erroSolicitacao, setErroSolicitacao] = useState<string>(''); // Erro no formulário/submissão

    const [diasVendidos, setDiasVendidos] = useState<number>(0);
    const [vendasRealizadas, setVendasRealizadas] = useState<VendaRealizada[]>([]);
    const [erroVenda, setErroVenda] = useState<string>(''); // Erro na seção de venda
    const [isVendaModalVisible, setIsVendaModalVisible] = useState<boolean>(false);

    const [minhasSolicitacoes, setMinhasSolicitacoes] = useState<SolicitacaoExibida[]>([]);
    const [isDecisaoModalVisible, setIsDecisaoModalVisible] = useState<boolean>(false);
    const [selectedDecisao, setSelectedDecisao] = useState<SolicitacaoExibida | null>(null);
    const [saldoDisponivel, setSaldoDisponivel] = useState<number | null>(null);
    const [isLoadingSaldo, setIsLoadingSaldo] = useState<boolean>(false);
    const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
    const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
    const [errorPage, setErrorPage] = useState<string | null>(null);
    const [userId, setUserId] = useState<string|null>('')

    const closeVendaModal = (): void => setIsVendaModalVisible(false);
    const openVendaModal = (): void => {
        setErroVenda('');
        if (diasVendidos > 0) { setIsVendaModalVisible(true); }
        else { setErroVenda('Selecione dias para vender.'); }
    };
    const closeRequestModal = (): void => setIsRequestModalVisible(false);
    const openRequestModal = (): void => setIsRequestModalVisible(true);

    const openDecisaoModal = (solicitacao: SolicitacaoExibida) => {
        setSelectedDecisao(solicitacao);
        setIsDecisaoModalVisible(true);
    };
    const closeDecisaoModal = () => {
        setSelectedDecisao(null);
        setIsDecisaoModalVisible(false);
    };

    const calcularDiasFerias = (inicio: Date, fim: Date): number => {
        if (!inicio || !fim || fim < inicio) return 0;

        const totalDays = differenceInCalendarDays(fim, inicio) + 1;
        const startDay = getDay(inicio);
        const fullWeeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;

        let weekendCount = fullWeeks * 2;

        for (let i = 0; i < remainingDays; i++) {
            const dayOfWeek = (startDay + i) % 7;
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendCount++;
            }
        }

        return totalDays - weekendCount;
    };

    const fetchSaldo = useCallback(async () => {
        setIsLoadingSaldo(true);
        setErrorPage(null); // Limpa erro geral
        try {
            const response = await api.get(`/api/ferias/saldo-calculado?colaboradorId=${userId}`);
            setSaldoDisponivel(response.data?.saldo ?? 0); // Usa response.data e fallback 0
        } catch (error: any) {
            console.error("Erro ao buscar saldo:", error);
            // setErrorPage(error.response?.data?.erro || "Falha ao buscar saldo.");
            setSaldoDisponivel(0);
        } finally {
            setIsLoadingSaldo(false);
        }
    }, [userId]);

    const fetchMinhasSolicitacoes = useCallback(async () => {
        setIsLoadingList(true);
        setErrorPage(null); // Limpa erro geral
        try {
            const response = await api.get(`/api/ferias/solicitacoes/colaborador/${userId}`);
            const dataFromApi: SolicitacaoFeriasData[] = response.data || [];

            const mappedSolicitacoes: SolicitacaoExibida[] = dataFromApi.map(req => ({
                 id: req.id,
                 periodo: `${req.dataInicio ? formatDate(new Date(req.dataInicio + 'T00:00:00')) : '??'} - ${req.dataFim ? formatDate(new Date(req.dataFim + 'T00:00:00')) : '??'}`,
                 status: req.status,
                 observacao: req.observacao,
                 comentarioGestor: req.comentarioGestor // Mapeia o comentário
            }));
            setMinhasSolicitacoes(mappedSolicitacoes);

        } catch (err: any) {
            console.error("Erro ao buscar minhas solicitações:", err);
            const errorMsg = err.response?.data?.erro || err.message || "Falha ao buscar histórico.";
            // setErrorPage(errorMsg);
            setMinhasSolicitacoes([]);
        } finally {
            setIsLoadingList(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchSaldo();
        fetchMinhasSolicitacoes();
    }, [fetchSaldo, fetchMinhasSolicitacoes, userId]);

    useEffect(() => {
        setUserId(localStorage.getItem('id'))
    }, [userId])

    const handleSolicitarFerias = () => {
        setErroSolicitacao('');
        if (!dataInicio || !dataFim) { setErroSolicitacao('Selecione datas.'); return; }
        if (calcularDiasFerias(dataInicio, dataFim) <= 0) { setErroSolicitacao('Data fim inválida.'); return; }
        const diaFim = dataFim.getDay();
        if (diaFim === 0 || diaFim === 6) {setErroSolicitacao('Data fim inválida.'); return; }
        const dias = calcularDiasFerias(dataInicio, dataFim);
        if (saldoDisponivel === null || dias > saldoDisponivel) { setErroSolicitacao('Saldo insuficiente.'); return; }
        openRequestModal(); // Abre modal de confirmação
    };

    const confirmarSolicitarFerias = async () => {
        if (!dataInicio || !dataFim) return;
        setIsLoadingAction(true); setErroSolicitacao('');
        try {
            const formattedDataInicio = format(dataInicio, 'yyyy-MM-dd');
            const formattedDataFim = format(dataFim, 'yyyy-MM-dd');
            const payload: SolicitacaoFeriasPayload = { colaboradorId: userId, dataInicio: formattedDataInicio, dataFim: formattedDataFim, observacao: observacao, status: 'Pendente' };

            await api.post('/solicitacao-ferias', payload);

            setDataInicio(null); setDataFim(null); setObservacao('');
            closeRequestModal(); // Fecha modal de submissão
            toast.success('Solicitação de férias enviada!');
            fetchMinhasSolicitacoes(); // ATUALIZA A LISTA
            fetchSaldo(); // ATUALIZA O SALDO

        } catch (error: any) {
            console.error("Erro ao enviar solicitação:", error)
            setErroSolicitacao(error.response?.data?.erro || 'Falha na comunicação ao enviar.');
        } finally { setIsLoadingAction(false); }
    };

    const handleVenderDias = async () => {
        if (diasVendidos <= 0) { setErroVenda('Selecione dias.'); return; }
        if (saldoDisponivel === null || diasVendidos > saldoDisponivel) { setErroVenda('Saldo insuficiente.'); return; }
        setIsLoadingAction(true); setErroVenda('');
        try {
            const payload: SolicitacaoAbonoPayload = { colaboradorId: userId, diasVendidos: diasVendidos, status: 'PENDENTE' };
            await api.post('/api/ferias/vender', payload); // Usa POST

            setDiasVendidos(0);
            closeVendaModal();
            toast.success('Solicitação de venda enviada!');
            fetchSaldo(); // ATUALIZA O SALDO

        } catch (error: any) {
             console.error("Erro ao vender férias:", error);
             setErroVenda(error.response?.data?.erro || 'Falha na comunicação ao vender.');
        } finally { setIsLoadingAction(false); }
    };

    const incrementDias = () => { /* ... */ };
    const decrementDias = () => { /* ... */ };

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

export default Ferias; // Exporta como Ferias