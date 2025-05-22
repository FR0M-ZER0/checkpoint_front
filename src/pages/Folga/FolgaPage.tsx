import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router'; // Para redirecionar se não tiver ID
import TemplateWithFilter from '../Employee/TemplateWithFilter';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../../utils/formatter';
import api from '@/services/api'; // Garanta que este alias está configurado
import { format } from 'date-fns'; // Importe se precisar formatar AAAA-MM-DD para POST
import { toast } from 'react-toastify'; // Se for usar toast
import Skeleton from 'react-loading-skeleton';

// Interface para as folgas (baseado na sua entidade SolicitacaoFolga)
interface SolicitacaoFolgaData {
    solFolId?: number | string; // ID da solicitação
    colaboradorId: number;
    solFolData: string;         // Data da folga (DD/MM/YYYY ou AAAA-MM-DD dependendo da API)
    solFolSaldoGasto: string;   // Ex: "2h 30min"
    solFolObservacao?: string | null;
    solFolStatus: string;       // Ex: PENDENTE, APROVADO, REJEITADO
    criadoEm?: string;
    // Adicione outros campos que sua API GET /api/folga possa retornar
}

function FolgaPage() {
    const [dataFolga, setDataFolga] = useState<Date | null>(null);
    // saldoHorasDisponivel é o saldo que você quer usar para validar a solicitação.
    // Ele deve ser o saldo de banco de horas do COLABORADOR LOGADO.
    const [saldoHorasDisponivel, setSaldoHorasDisponivel] = useState<string>("0h 00min"); 
    const [horasSolicitadas, setHorasSolicitadas] = useState<number>(0);
    const [minutosSolicitados, setMinutosSolicitados] = useState<number>(0);
    const [erroSolicitacao, setErroSolicitacao] = useState<string>('');
    const [folgasAgendadas, setFolgasAgendadas] = useState<SolicitacaoFolgaData[]>([]);
    const [observacao, setObservacao] = useState<string>('');
    
    const [userId, setUserId] = useState<string | null>(null); // ID do usuário logado
    const navigate = useNavigate(); // Para redirecionar

    const [isLoadingSaldo, setIsLoadingSaldo] = useState<boolean>(true);
    const [isLoadingHistorico, setIsLoadingHistorico] = useState<boolean>(true);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
    const [errorPage, setErrorPage] = useState<string | null>(null);

    const handleDateChange: CalendarProps['onChange'] = (value: any) => {
        const date = Array.isArray(value) ? value[0] : value;
        setDataFolga(date instanceof Date ? date : null);
    };

    // Formata DD/MM/YYYY para o @JsonFormat no backend
    const formatDateForAPIDDMMYYYY = (date: Date | null): string => {
        if (!date) return ""; 
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; 
    };

    const fetchSaldoHoras = useCallback(async () => {
        if (!userId) {
            console.warn("FolgaPage - fetchSaldoHoras: userId nulo, não buscando saldo.");
            setSaldoHorasDisponivel("0h 00min"); // Define um padrão ou estado de erro
            setIsLoadingSaldo(false);
            return;
        }
        setIsLoadingSaldo(true);
        setErrorPage(null);
        try {
            // Este endpoint no FolgaController busca o saldo de horas do FolgaService
            console.log(`FolgaPage - Chamando /api/folga/saldo?colaboradorId=${userId}`);
            const response = await api.get(`/api/folga/saldo?colaboradorId=${userId}`);
            setSaldoHorasDisponivel(response.data || "0h 00min"); 
        } catch (error: any) {
            console.error("Erro ao buscar saldo de horas para folga:", error);
            setErrorPage(error.response?.data?.erro || "Falha ao buscar saldo de horas.");
            setSaldoHorasDisponivel("Erro");
        } finally {
            setIsLoadingSaldo(false);
        }
    }, [userId]);

    const fetchHistoricoFolgas = useCallback(async () => {
        if (!userId) {
            console.warn("FolgaPage - fetchHistoricoFolgas: userId nulo, não buscando histórico.");
            setFolgasAgendadas([]);
            setIsLoadingHistorico(false);
            return;
        }
        setIsLoadingHistorico(true);
        setErrorPage(null);
        try {
            console.log(`FolgaPage - Chamando GET /api/folga?colaboradorId=${userId} para histórico`);
            // Esta chamada precisa que o FolgaController tenha um @GetMapping para /api/folga
            // que retorne List<SolicitacaoFolga>
            const response = await api.get(`/api/folga?colaboradorId=${userId}`);
            setFolgasAgendadas(Array.isArray(response.data) ? response.data : []);
        } catch (error: any) {
            console.error('Erro ao carregar histórico de folgas:', error);
            setErrorPage(error.response?.data?.erro || 'Erro ao carregar histórico de folgas.');
            setFolgasAgendadas([]);
        } finally {
            setIsLoadingHistorico(false);
        }
    }, [userId]);

    // useEffect para buscar o userId do localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem('id');
        if (storedUserId && storedUserId !== "null" && storedUserId.trim() !== "") {
            console.log("FolgaPage - UserID pego do localStorage:", storedUserId);
            setUserId(storedUserId);
        } else {
            console.error("FolgaPage - UserID NÃO encontrado ou inválido! Redirecionando para login.");
            toast.error("Sessão inválida. Por favor, faça login novamente.");
            navigate('/login');
        }
    }, [navigate]);

    // useEffect para buscar dados quando userId muda
    useEffect(() => {
        if (userId) {
            console.log("FolgaPage - userId DEFINIDO no estado, chamando fetches:", userId);
            fetchSaldoHoras();
            fetchHistoricoFolgas();
        } else {
            console.log("FolgaPage - userId AINDA é nulo/inválido, aguardando...");
        }
    }, [userId, fetchSaldoHoras, fetchHistoricoFolgas]);


    const saldoParaMinutos = (saldo: string): { horas: number, minutos: number } | undefined => {
        if (typeof saldo !== 'string' || !saldo || !saldo.includes('h')) {
            console.warn("saldoParaMinutos: formato de saldo inválido:", saldo);
            return undefined;
        }
        try {
            const partes = saldo.split('h');
            const horasStr = partes[0]?.trim();
            const minutosStr = partes[1]?.replace('min', '').trim();
            const horas = parseInt(horasStr || '0', 10);
            const minutos = parseInt(minutosStr || '0', 10);
            if (isNaN(horas) || isNaN(minutos)) return undefined;
            return { horas, minutos };
        } catch (e) { console.error("Erro em saldoParaMinutos:", e); return undefined; }
   };

   const minutosParaSaldo = (totalMinutos: number): string => {
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        return `${horas}h ${String(minutos).padStart(2, '0')}min`;
   };

    const handleSolicitarFolga = async () => {
        if (!userId) {
            setErroSolicitacao("Usuário não identificado. Faça login novamente.");
            toast.error("Usuário não identificado.");
            return;
        }
        if (!dataFolga || ((horasSolicitadas ?? 0) <= 0 && (minutosSolicitados ?? 0) <= 0)) {
            setErroSolicitacao('Selecione a data e informe horas/minutos válidos.');
            return;
        }

        const saldoConvertido = saldoParaMinutos(saldoHorasDisponivel);
        if (!saldoConvertido) {
            setErroSolicitacao('Saldo de horas para folga indisponível ou em formato inválido.');
            return;
        }
        
        const { horas: horasAtuais, minutos: minutosAtuais } = saldoConvertido;
        const totalAtualEmMinutos = horasAtuais * 60 + minutosAtuais;
        const totalSolicitadoEmMinutos = (horasSolicitadas ?? 0) * 60 + (minutosSolicitados ?? 0);

        if (totalSolicitadoEmMinutos > totalAtualEmMinutos) {
            setErroSolicitacao('Saldo de horas insuficiente para esta solicitação.');
            return;
        }

        setIsLoadingSubmit(true);
        setErroSolicitacao('');
        try {
            const dataFormatadaPayload = formatDateForAPIDDMMYYYY(dataFolga); 
            if (!dataFormatadaPayload) { // Checagem caso dataFolga seja null e formatDateForAPI retorne ""
                 throw new Error("Erro ao formatar a data da folga.");
            }
            
            const saldoGastoFormatado = `${horasSolicitadas ?? 0}h ${String(minutosSolicitados ?? 0).padStart(2, '0')}min`;
            
            const payload = {
                colaboradorId: parseInt(userId, 10), // Envia como número
                solFolData: dataFormatadaPayload,
                solFolSaldoGasto: saldoGastoFormatado,
                solFolObservacao: observacao,
                solFolStatus: "PENDENTE"
            };
            console.log("Enviando payload para POST /api/folga (SolicitacaoFolga):", payload);

            // Este POST /api/folga precisa que o backend espere @RequestBody SolicitacaoFolga
            const response = await api.post('/api/folga', payload); 

            const novaSolicitacao = response.data;
            setFolgasAgendadas(prevFolgas => [...prevFolgas, novaSolicitacao]);
            
            const novoSaldoEmMinutosLocal = totalAtualEmMinutos - totalSolicitadoEmMinutos;
            setSaldoHorasDisponivel(minutosParaSaldo(novoSaldoEmMinutosLocal)); 
            
            setDataFolga(null);
            setHorasSolicitadas(0);
            setMinutosSolicitados(0);
            setObservacao('');
            toast.success('Solicitação de folga enviada com sucesso!');
            fetchHistoricoFolgas(); // Rebusca histórico para mostrar a nova solicitação
            fetchSaldoHoras();    // Rebusca saldo para garantir atualização

        } catch (error: any) {
            console.error('Erro ao solicitar folga:', error);
            const errorMsg = error.response?.data?.erro || error.message || 'Erro ao solicitar folga';
            setErroSolicitacao(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoadingSubmit(false);
        }
    };
    
    const saldoNegativo = (horasSolicitadas ?? 0) > 0 || (minutosSolicitados ?? 0) > 0 
    ? `- ${horasSolicitadas ?? 0}h ${String(minutosSolicitados ?? 0).padStart(2, '0')}min` 
    : null;

    if (errorPage && !userId) { // Se não conseguiu pegar userId, mostra erro e não renderiza o resto
        return (
            <TemplateWithFilter filter={undefined}>
                <main className='w-full flex-col px-4 overflow-hidden max-w-screen-md mx-auto pb-20'>
                    <h1 className="text-xl font-bold text-left md:text-center mb-4">Solicitar Folga</h1>
                    <p className="text-red-500 text-center mb-4 p-2 bg-red-100 border border-red-300 rounded-md">{errorPage}</p>
                </main>
            </TemplateWithFilter>
        );
    }

    return (
        <TemplateWithFilter filter={undefined}>
            <main className='w-full flex-col px-4 overflow-hidden max-w-screen-md mx-auto pb-20'>
                <h1 className="text-xl font-bold text-left md:text-center mb-4">Solicitar Folga</h1>

                {(isLoadingSaldo || isLoadingHistorico) && !errorPage && 
                    <div className="text-center py-4"><Skeleton count={1} height={60} className="mb-4"/><Skeleton count={5} /></div>
                }
                {errorPage && <p className="text-red-500 text-center mb-4 p-2 bg-red-100 border border-red-300 rounded-md">{errorPage}</p>}

                {!isLoadingSaldo && !errorPage && (
                    <div className="flex flex-col items-center justify-center mb-4 gap-2">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold">Saldo de Horas para Folga</h2>
                            <p className={`text-xl ${saldoHorasDisponivel === "0h 00min" || saldoHorasDisponivel === 'Erro' ? 'text-red-500' : 'text-[#007D26]'}`}>
                                {saldoHorasDisponivel}
                            </p>
                            {saldoNegativo && <p className="text-red-500 text-xl">{saldoNegativo}</p>}
                        </div>
                    </div>
                )}

                {!errorPage && (
                <>
                    <div className="mb-4 bg-white shadow-md rounded-lg p-4 w-full md:w-fit mx-auto">
                        <Calendar
                            onChange={handleDateChange}
                            value={dataFolga}
                            className="border rounded-lg p-2 w-full"
                            minDate={new Date()}
                            locale="pt-BR"
                            selectRange={false}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Horas a solicitar:</label>
                        <div className="flex items-center gap-2">
                            <input type="number" value={horasSolicitadas ?? 0} onChange={(e) => setHorasSolicitadas(Number(e.target.value))} min={0} max={23} className="w-16 p-2 border rounded-lg input-col"/>
                            <span>h</span>
                            <input type="number" value={minutosSolicitados ?? 0} onChange={(e) => setMinutosSolicitados(Number(e.target.value))} min={0} max={59} step={5} className="w-16 p-2 border rounded-lg input-col"/>
                            <span>min</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observação:</label>
                        <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Motivo da folga (opcional)"/>
                    </div>

                    <div className="mb-8 flex justify-center">
                        <button
                            onClick={handleSolicitarFolga}
                            disabled={!dataFolga || ((horasSolicitadas ?? 0) === 0 && (minutosSolicitados ?? 0) === 0) || isLoadingSubmit || !userId}
                            className={`bg-[#BCC6E9] text-black h-9 px-6 py-2 rounded-lg font-semibold ${!dataFolga || ((horasSolicitadas ?? 0) === 0 && (minutosSolicitados ?? 0) === 0) || isLoadingSubmit || !userId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#A0A9CC]'}`}
                        >
                            {isLoadingSubmit ? 'Processando...' : 'Solicitar Folga'}
                        </button>
                    </div>
                    {erroSolicitacao && <p className="text-red-500 mt-2 text-center">{erroSolicitacao}</p>}
                </>
                )}

                {!isLoadingHistorico && !errorPage && folgasAgendadas.length === 0 && (
                     <div className="mt-4 text-center text-gray-500">Nenhuma solicitação de folga encontrada.</div>
                )}
                {!isLoadingHistorico && !errorPage && folgasAgendadas.length > 0 && (
                    <div className="mt-4 bg-white shadow-md rounded-lg p-4 w-full md:w-fit mx-auto">
                        <h3 className="text-lg font-semibold mb-2">Minhas Solicitações de Folga:</h3>
                        <ul className="space-y-2">
                        {folgasAgendadas.map((folga, index) => ( // Ajuste para usar folga.solFolId se disponível
                            <li key={folga.solFolId || index} className="mb-1 p-2 border border-gray-300 rounded-lg flex justify-between items-center gap-x-4">
                                <span className="min-w-[100px]">{folga.solFolData ? formatDate(new Date(folga.solFolData.replace(/-/g, '/'))) : '??'}</span>
                                <span className="min-w-[80px]">{folga.solFolSaldoGasto}</span>
                                <span className="min-w-[100px]">{folga.solFolStatus}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
            </main>
        </TemplateWithFilter>
    );
}

export default FolgaPage;
