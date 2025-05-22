import React, { useState, useEffect } from 'react';
import TemplateWithFilter from '../Employee/TemplateWithFilter';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../../utils/formatter';
import api from '@/services/api';

function FolgaPage() {
    const COLABORADOR_ID = 2;
    const [dataFolga, setDataFolga] = useState<Date | null>(null);
    const [saldoHoras, setSaldoHoras] = useState<string>("00h 00min");
    const [horasSolicitadas, setHorasSolicitadas] = useState<number | null>(0);
    const [minutosSolicitados, setMinutosSolicitados] = useState<number | null>(0);
    const [erroSolicitacao, setErroSolicitacao] = useState<string>('');
    const [folgasAgendadas, setFolgasAgendadas] = useState<any[]>([]);
    const [observacao, setObservacao] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(false);

    const [userId, setUserId] = useState<string|null>('')
    const [saldoFolgas, setSaldoFolgas] = useState<string>('')

    const handleDateChange: CalendarProps['onChange'] = (value, event) => {
        setDataFolga(value instanceof Date ? value : null);
    };

    // Função para formatar a data no padrão dd/MM/yyyy
    const formatDateForAPI = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchSaldo = async () => {
        try {
            const response = await api.get(`/horas-extras/colaborador/${userId}`)
            setSaldoFolgas(response.data)
        } catch (error: unknown) {
            console.error(error)
        }

    }

    useEffect(() => {
        setUserId(localStorage.getItem("id"))
        fetchSaldo()
    }, [userId])

    useEffect(() => {
    const carregarDadosPersistentes = async () => {
        try {
            setCarregando(true);
            
            // Carrega saldo
            const saldoResponse = await fetch(`http://localhost:8080/api/folga/saldo?colaboradorId=${COLABORADOR_ID}`);
            if (saldoResponse.ok) {
                setSaldoHoras(await saldoResponse.text());
            }

            // Carrega folgas existentes
            const folgasResponse = await fetch(`http://localhost:8080/api/folga?colaboradorId=${COLABORADOR_ID}`);
            if (folgasResponse.ok) {
                const folgas = await folgasResponse.json();
                setFolgasAgendadas(folgas);
                
                // Opcional: Salva no localStorage como backup
                localStorage.setItem('folgasBackup', JSON.stringify(folgas));
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            
            // Fallback: Tenta carregar do localStorage se a API falhar
            const folgasBackup = localStorage.getItem('folgasBackup');
            if (folgasBackup) {
                setFolgasAgendadas(JSON.parse(folgasBackup));
            }
            
            setErroSolicitacao('Erro ao carregar dados. Algumas informações podem estar desatualizadas.');
        } finally {
            setCarregando(false);
        }
    };

    carregarDadosPersistentes();
}, [COLABORADOR_ID]); // Adicione COLABORADOR_ID como dependência

const handleSolicitarFolga = async () => {
    // Suas validações originais, usando setErroSolicitacao
    if (!dataFolga || horasSolicitadas === null || minutosSolicitados === null) {
        setErroSolicitacao('Preencha todos os campos.');
        return;
    }
    const horas = horasSolicitadas ?? 0;
    const minutos = minutosSolicitados ?? 0;
    if (horas < 0 || minutos < 0 || (horas === 0 && minutos === 0)) { 
        setErroSolicitacao('Horas/minutos inválidos.'); 
        return; 
    }

    // Sua lógica de conversão e validação de saldo original
    const saldoConvertido = saldoParaMinutos(saldoHoras); 
    if (!saldoConvertido) { 
        setErroSolicitacao('Não foi possível ler o saldo de horas atual para validação.');
        return; 
    }
    const { horas: horasAtuais, minutos: minutosAtuais } = saldoConvertido;

    if (isNaN(horasAtuais) || isNaN(minutosAtuais)) {
        setErroSolicitacao('Formato de saldo de horas inválido.');
        return;
    }

    const totalAtualEmMinutos = horasAtuais * 60 + minutosAtuais;
    const totalSolicitadoEmMinutos = horas * 60 + minutos;

    if (totalSolicitadoEmMinutos > totalAtualEmMinutos) {
        setErroSolicitacao('Saldo insuficiente para esta solicitação.');
        return;
    }

    try {
        setCarregando(true); // Seu estado 'carregando'
        setErroSolicitacao(''); // Seu estado 'erroSolicitacao'

        const saldoGastoFormatado = `${horas}h ${String(minutos).padStart(2, '0')}min`;
        
        // ***** ALTERAÇÃO PRINCIPAL AQUI *****
        // 1. Formata a data para "dd/MM/yyyy" (conforme @JsonFormat da sua entidade SolicitacaoFolga)
        //    usando SUA função original formatDateForAPI.
        const dataFormatada = formatDateForAPI(dataFolga); 
        if (!dataFormatada && dataFolga) { // Checa se formatDateForAPI retornou vazio para uma data válida
             throw new Error("Erro ao formatar a data da folga.");
        }
        
        // 2. Monta o payload com os NOMES EXATOS da entidade SolicitacaoFolga
        const corpoDaRequisicao = JSON.stringify({
            colaboradorId: COLABORADOR_ID,          // Sua constante COLABORADOR_ID
            solFolData: dataFormatada,              // Nome do campo e data formatada
            solFolSaldoGasto: saldoGastoFormatado,    // Nome do campo
            solFolObservacao: observacao,           // Nome do campo
            solFolStatus: "PENDENTE"                // Nome do campo
        });
        // ************************************

        console.log("Enviando payload para /api/folga:", corpoDaRequisicao);

        // Mantém seu fetch original
        const response = await fetch('http://localhost:8080/api/folga', { // Endpoint para criar SolicitacaoFolga
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: corpoDaRequisicao,
        });

        if (!response.ok) {
             let errorMsg = `Erro ${response.status}`;
             try { 
                 const errorData = await response.json(); 
                 errorMsg = errorData?.erro || `Erro ao processar a resposta: ${errorMsg}`; 
             } catch (e) {
                 const textError = await response.text();
                 errorMsg = textError || errorMsg;
             }
             throw new Error(errorMsg);
        }

        // Sua lógica de sucesso original
        const novaSolicitacao = await response.json(); 
        setFolgasAgendadas([...folgasAgendadas, novaSolicitacao]);

        // Sua atualização local de saldo original
        const novoSaldoEmMinutos = totalAtualEmMinutos - totalSolicitadoEmMinutos;
        setSaldoHoras(minutosParaSaldo(novoSaldoEmMinutos));

        // Sua limpeza de formulário original
        setDataFolga(null);
        setHorasSolicitadas(0);
        setMinutosSolicitados(0);
        setObservacao('');
        alert('Solicitação de folga enviada com sucesso!'); 

        // Se a função carregarDadosPersistentes estiver definida no escopo do componente
        // e você quiser rebuscar tudo do backend após o sucesso:
        // carregarDadosPersistentes(); // Você precisaria garantir que COLABORADOR_ID ou userId está correto aqui

    } catch (error) {
        console.error('Erro ao solicitar folga:', error);
        setErroSolicitacao( error instanceof Error ? error.message : 'Erro ao solicitar folga' ); // Usa seu setErroSolicitacao
    } finally {
        setCarregando(false); // Usa seu estado 'carregando'
    }
};

    // Função auxiliar para converter "XXh YYmin" em minutos
    const saldoParaMinutos = (saldo: string): { horas: number, minutos: number } => {
        const partes = saldo.split('h');
        const horas = parseInt(partes[0].trim(), 10) || 0;
        const minutosStr = partes[1] ? partes[1].replace('min', '').trim() : '0';
        const minutos = parseInt(minutosStr, 10) || 0;
        return { horas, minutos };
    };
    const minutosParaSaldo = (totalMinutos: number): string => {
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        return `${horas}h ${minutos.toString().padStart(2, '0')}min`;
    };

    const saldoNegativo = horasSolicitadas && minutosSolicitados 
    ? `- ${horasSolicitadas}h ${minutosSolicitados.toString().padStart(2, '0')}min` 
    : null;

    return (
        <TemplateWithFilter filter={undefined}>
            <main className='w-full flex-col px-4 overflow-hidden max-w-screen-md mx-auto pb-20'>
                <h1 className="text-xl font-bold text-left md:text-center mb-4">Solicitar Folga</h1>

                {carregando && <div className="text-center py-4">Carregando...</div>}

                <div className="flex flex-col items-center justify-center mb-4 gap-2">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">Saldo disponível</h2>
                        <p className={`text-xl ${saldoFolgas === "00h 00min" ? 'text-red-500' : 'text-[#007D26]'}`}>
                            {saldoFolgas}
                        </p>
                        {saldoNegativo && <p className="text-red-500 text-xl">{saldoNegativo}</p>}
                    </div>
                </div>

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
                        <input
                            type="number"
                            value={horasSolicitadas ?? 0}
                            onChange={(e) => setHorasSolicitadas(e.target.value ? Number(e.target.value) : 0)}
                            min={0}
                            max={23}
                            className="w-16 p-2 border rounded-lg input-col"
                        />
                        <span>h</span>
                        <input
                            type="number"
                            value={minutosSolicitados ?? 0}
                            onChange={(e) => setMinutosSolicitados(e.target.value ? Number(e.target.value) : 0)}
                            min={0}
                            max={59}
                            step={5}
                            className="w-16 p-2 border rounded-lg input-col"
                        />
                        <span>min</span>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observação:</label>
                    <textarea
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Motivo da folga (opcional)"
                    />
                </div>

                <div className="mb-8 flex justify-center">
                    <button
                        onClick={handleSolicitarFolga}
                        disabled={!dataFolga || horasSolicitadas === null || minutosSolicitados === null || (horasSolicitadas === 0 && minutosSolicitados === 0) || carregando}
                        className={`bg-[#BCC6E9] text-black h-9 px-6 py-2 rounded-lg ${
                            !dataFolga || horasSolicitadas === null || minutosSolicitados === null || (horasSolicitadas === 0 && minutosSolicitados === 0) || carregando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#A0A9CC]'
                        }`}
                    >
                        {carregando ? 'Processando...' : 'Solicitar Folga'}
                    </button>
                </div>

                {erroSolicitacao && (
                    <p className="text-red-500 mt-2 text-center">{erroSolicitacao}</p>
                )}

                {folgasAgendadas.length > 0 && (
                    <div className="mt-4 bg-white shadow-md rounded-lg p-4 w-full md:w-fit mx-auto">
                        <h3 className="text-lg font-semibold mb-2">Minhas Folgas:</h3>
                        <ul className="space-y-2">
                        {folgasAgendadas.map((folga, index) => (
                            <li key={index} className="mb-1 p-2 border border-gray-300 rounded-lg flex justify-between items-center gap-x-4">
                            <span className="min-w-[100px]">{formatDate(new Date(folga.solFolData))}</span>
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