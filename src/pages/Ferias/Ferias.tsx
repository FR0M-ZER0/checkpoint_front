import React, { useState, useEffect, useCallback } from 'react';
import TemplateWithFilter from '../Employee/TemplateWithFilter';
import Modal from '../../components/Modal';
import { formatDate } from '../../utils/formatter';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, differenceInCalendarDays } from 'date-fns';
import SubmitButton from '../../components/SubmitButton';

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

function Ferias() {
    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [feriasAgendadas, setFeriasAgendadas] = useState<any[]>([]);
    const [erroSolicitacao, setErroSolicitacao] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [diasVendidos, setDiasVendidos] = useState<number>(0);
    const [saldoDisponivel, setSaldoDisponivel] = useState<number | null>(null);
    const [erroVenda, setErroVenda] = useState<string>('');
    const [diasSolicitadosVenda, setDiasSolicitadosVenda] = useState<number>(0);
    const [observacao, setObservacao] = useState<string>('');

    const COLABORADOR_ID = 2;

    const closeModal = (): void => setIsModalVisible(false);
    const openModal = (): void => {
        setErroVenda('');
        setIsModalVisible(true);
    };

    const calcularDiasFerias = (inicio: Date, fim: Date): number => {
        if (!inicio || !fim || fim < inicio) {
            return 0;
        }
        return differenceInCalendarDays(fim, inicio) + 1;
    };

    const fetchSaldo = useCallback(async () => {
        setErroSolicitacao('');
        setErroVenda('');
        try {
            const response = await fetch(`http://localhost:8080/api/ferias/saldo?colaboradorId=${COLABORADOR_ID}`);
            if (response.ok) {
                const saldo = await response.json();
                setSaldoDisponivel(saldo);
            } else {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.erro || `Erro ${response.status} ao buscar saldo.`;
                console.error('Erro ao buscar saldo de férias:', errorMessage);
                setErroSolicitacao(errorMessage);
                setSaldoDisponivel(0);
            }
        } catch (error) {
            console.error('Erro de rede ao buscar saldo:', error);
            setErroSolicitacao('Não foi possível conectar ao servidor para buscar saldo.');
            setSaldoDisponivel(0);
        }
    }, [COLABORADOR_ID]);

    useEffect(() => {
        fetchSaldo();
    }, [fetchSaldo]);

    const handleSolicitarFerias = async () => {
        setErroSolicitacao('');
        if (!dataInicio || !dataFim) {
            setErroSolicitacao('Selecione as datas de início e fim.');
            return;
        }
        if (dataInicio >= dataFim) {
            setErroSolicitacao('A data de início deve ser anterior à data de fim.');
            return;
        }

        const diasSolicitados = calcularDiasFerias(dataInicio, dataFim);

        if (saldoDisponivel === null || diasSolicitados > saldoDisponivel) {
            setErroSolicitacao('Saldo de férias insuficiente para o período solicitado.');
            return;
        }

        try {
            const formattedDataInicio = format(dataInicio, 'yyyy-MM-dd');
            const formattedDataFim = format(dataFim, 'yyyy-MM-dd');
            const payload: SolicitacaoFeriasPayload = {
                colaboradorId: COLABORADOR_ID,
                dataInicio: formattedDataInicio,
                dataFim: formattedDataFim,
                observacao: observacao,
                status: 'PENDENTE'
            };
            console.log('Enviando solicitação de férias:', payload);
            const response = await fetch('http://localhost:8080/api/ferias/agendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const solicitacaoSalva = await response.json();
                console.log('Solicitação de férias salva:', solicitacaoSalva);
                const periodo = `${formatDate(dataInicio)} - ${formatDate(dataFim)}`;
                setFeriasAgendadas(prevAgendadas => [...prevAgendadas, { id: solicitacaoSalva.id, periodo: periodo, ...solicitacaoSalva }]);
                setDataInicio(null);
                setDataFim(null);
                setObservacao('');
                setErroSolicitacao('');
                fetchSaldo();
                alert('Solicitação de férias enviada com sucesso!');
            } else {
                const errorData = await response.json().catch(() => ({ erro: `Erro ${response.status} ao solicitar férias.` }));
                console.error('Erro na solicitação de férias:', errorData.erro);
                setErroSolicitacao(errorData.erro || 'Ocorreu um erro ao processar sua solicitação.');
            }
        } catch (error) {
            console.error('Erro de rede ao solicitar férias:', error);
            setErroSolicitacao('Erro ao conectar com o servidor para solicitar férias.');
        }
    };

    const handleVenderDias = async () => {
        setErroVenda('');
        if (diasVendidos <= 0) {
            setErroVenda('Selecione a quantidade de dias a vender.');
            return;
        }
        if (saldoDisponivel === null || diasVendidos > saldoDisponivel) {
            setErroVenda('Saldo de férias insuficiente para vender.');
            return;
        }

        try {
            const payload: SolicitacaoAbonoPayload = {
                colaboradorId: COLABORADOR_ID,
                diasVendidos: diasVendidos,
                status: 'PENDENTE'
            };
            console.log('Enviando solicitação de venda:', payload);
            const response = await fetch('http://localhost:8080/api/ferias/vender', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const abonoSalvo = await response.json();
                console.log('Solicitação de venda salva:', abonoSalvo);
                setDiasSolicitadosVenda(prevVendidos => prevVendidos + diasVendidos);
                setDiasVendidos(0);
                setErroVenda('');
                closeModal();
                fetchSaldo();
                alert('Solicitação de venda de férias enviada com sucesso!');
            } else {
                const errorData = await response.json().catch(() => ({ erro: `Erro ${response.status} ao vender férias.` }));
                console.error('Erro na venda de férias:', errorData.erro);
                setErroVenda(errorData.erro || 'Ocorreu um erro ao processar sua solicitação de venda.');
            }
        } catch (error) {
            console.error('Erro de rede ao vender férias:', error);
            setErroVenda('Erro ao conectar com o servidor para vender férias.');
        }
    };

    const incrementDias = () => {
        if (saldoDisponivel !== null && saldoDisponivel > diasVendidos) {
            setDiasVendidos(diasVendidos + 1);
            setErroVenda('');
        } else if (saldoDisponivel !== null && saldoDisponivel <= diasVendidos) {
            setErroVenda('Saldo insuficiente para vender mais dias.');
        }
    };

    const decrementDias = () => {
        if (diasVendidos > 0) {
            setDiasVendidos(diasVendidos - 1);
            setErroVenda('');
        }
    };

    const diasSelecionados = dataInicio && dataFim ? calcularDiasFerias(dataInicio, dataFim) : 0;
    const saldoNegativoVenda = diasVendidos > 0 ? diasVendidos : 0;
    const saldoAposSelecao = saldoDisponivel !== null ? saldoDisponivel - diasSelecionados - saldoNegativoVenda : 0;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return (
        <TemplateWithFilter filter={undefined}>
            <main className='w-full flex-col px-4 overflow-hidden max-w-screen-md mx-auto pb-20'>
                <h1 className="text-xl font-bold text-left md:text-center mb-4">Férias</h1>
                <div className="flex flex-col items-center justify-center mb-4 gap-2">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">Saldo disponível</h2>
                        {saldoDisponivel === null ? (
                            <p className="text-xl text-gray-500">Carregando...</p>
                        ) : (
                            <p className={`text-xl ${saldoDisponivel <= 0 ? 'text-red-500' : 'text-[#007D26]'}`}>{saldoDisponivel}d</p>
                        )}
                    </div>
                    {(diasSelecionados > 0 || saldoNegativoVenda > 0) && saldoDisponivel !== null && (
                        <div className="text-center">
                            <p className="text-red-500 text-xl">-{diasSelecionados + saldoNegativoVenda}d</p>
                            <p className="text-sm text-gray-600">(Saldo ficaria: {saldoAposSelecao}d)</p>
                        </div>
                    )}
                </div>
                <div className="mb-4 bg-white shadow-md rounded-lg p-4 w-full md:w-fit mx-auto">
                    <Calendar
                        onChange={(value) => {
                            if (Array.isArray(value)) {
                                setDataInicio(value[0]);
                                setDataFim(value[1]);
                            } else {
                                setDataInicio(value);
                                setDataFim(null);
                            }
                            setErroSolicitacao('');
                        }}
                        selectRange={true}
                        value={dataInicio && dataFim ? [dataInicio, dataFim] : dataInicio ? [dataInicio, null] : null}
                        minDate={hoje}
                        className="border rounded-lg p-2 w-full"
                    />
                </div>
                <div className="mb-4 w-full max-w-md mx-auto">
                    <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-1">
                        Observação (opcional):
                    </label>
                    <textarea
                        id="observacao"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Adicione uma observação para sua solicitação..."
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                    />
                </div>
                <SubmitButton text='Solicitar'/>
                {erroSolicitacao && <p className="text-red-500 mt-2 text-center mb-4">{erroSolicitacao}</p>}
                {feriasAgendadas.length > 0 && (
                    <div className="mt-4 bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
                        <h3 className="text-lg font-semibold mb-2">Solicitações Enviadas:</h3>
                        <ul>
                            {feriasAgendadas.map((item, index) => (
                                <li key={item.id || index} className="mb-1 p-2 border border-gray-300 rounded-lg">
                                    {item.periodo || item}
                                    {item.status && <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded ${item.status === 'PENDENTE' ? 'bg-yellow-200 text-yellow-800' : item.status === 'APROVADO' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{item.status}</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <h1 className="text-xl font-bold text-left md:text-center mt-8 mb-4">Abonar Férias (Vender)</h1>
                <div className="w-full md:w-64 h-9 flex items-center justify-between shadow-md mx-auto mb-4 border border-gray-300 rounded-lg bg-white p-2">
                    <button onClick={decrementDias} className="bg-main-blue-color text-black px-4 py-2 rounded-lg">-</button>
                    <span className="text-xl">{diasVendidos}</span>
                    <button
                        onClick={incrementDias}
                        className="bg-main-blue-color text-black px-4 py-2 rounded-lg"
                    >
                        +
                    </button>
                </div>
                {erroVenda && <p className="text-red-500 mt-2 text-center">{erroVenda}</p>}
                <div className="flex justify-center mb-8">
                    <button onClick={openModal} className="bg-[#BCC6E9] text-black h-9 px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={diasVendidos <= 0}>Solicitar Venda</button>
                </div>
            </main>
            {isModalVisible && (
                <Modal title='Confirmar Venda de Dias de Férias' onClose={closeModal}>
                    <div className='mb-[60px]'>
                        <p>Deseja vender {diasVendidos} dias de férias?</p>
                    </div>
                    <div className='text-white'>
                        <button className='main-func-color px-8 py-2 rounded-lg mr-4 cursor-pointer' onClick={handleVenderDias}>Confirmar</button>
                        <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer' onClick={closeModal}>Cancelar</button>
                    </div>
                </Modal>
            )}
            <nav className="fixed bottom-0 w-full bg-main-blue-color text-white p-4">
            </nav>
        </TemplateWithFilter>
    );
}

export default Ferias;