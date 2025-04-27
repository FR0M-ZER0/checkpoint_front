import React, { useState, useEffect } from 'react';
import TemplateWithFilter from '../Employee/TemplateWithFilter';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../../utils/formatter';

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
        if (!dataFolga || horasSolicitadas === null || minutosSolicitados === null) {
            setErroSolicitacao('Preencha todos os campos.');
            return;
        }
    
        // Converte saldo atual para minutos
        const { horas: horasAtuais, minutos: minutosAtuais } = saldoParaMinutos(saldoHoras);
        const totalAtualEmMinutos = horasAtuais * 60 + minutosAtuais;
    
        // Calcula o saldo solicitado em minutos
        const totalSolicitadoEmMinutos = horasSolicitadas * 60 + minutosSolicitados;
    
        // Verifica se tem saldo suficiente
        if (totalSolicitadoEmMinutos > totalAtualEmMinutos) {
            setErroSolicitacao('Saldo insuficiente para esta solicitação.');
            return;
        }
    
        try {
            setCarregando(true);
            setErroSolicitacao('');
    
            const saldoGasto = `${horasSolicitadas}h ${minutosSolicitados.toString().padStart(2, '0')}min`;
    
            const corpoDaRequisicao = JSON.stringify({
                colaboradorId: COLABORADOR_ID,
                solFolData: formatDateForAPI(dataFolga),
                solFolSaldoGasto: saldoGasto,
                solFolObservacao: observacao,
                solFolStatus: "PENDENTE"
            });
    
            const response = await fetch('http://localhost:8080/api/folga', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: corpoDaRequisicao,
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status}`);
            }
    
            // Atualiza o saldo localmente (opcional - pode confiar apenas na resposta do servidor)
            const novoSaldoEmMinutos = totalAtualEmMinutos - totalSolicitadoEmMinutos;
            setSaldoHoras(minutosParaSaldo(novoSaldoEmMinutos));
    
            // Atualiza a lista de folgas
            const novaFolga = await response.json();
            setFolgasAgendadas([...folgasAgendadas, novaFolga]);
    
            // Limpa os campos
            setDataFolga(null);
            setHorasSolicitadas(0);
            setMinutosSolicitados(0);
            setObservacao('');
    
        } catch (error) {
            console.error('Erro:', error);
            setErroSolicitacao(
                error instanceof Error ? error.message : 'Erro ao solicitar folga'
            );
        } finally {
            setCarregando(false);
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
                        <p className={`text-xl ${saldoHoras === "00h 00min" ? 'text-red-500' : 'text-[#007D26]'}`}>
                            {saldoHoras}
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