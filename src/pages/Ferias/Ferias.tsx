import React, { useState, useEffect } from 'react';
import TemplateWithFilter from '../Employee/TemplateWithFilter';
import Modal from '../../components/Modal';
import { formatDate } from '../../utils/formatter';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Ferias() {
    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [feriasAgendadas, setFeriasAgendadas] = useState<string[]>([]);
    const [erroSolicitacao, setErroSolicitacao] = useState<string>('');

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [diasVendidos, setDiasVendidos] = useState<number>(0);
    const [saldoDisponivel, setSaldoDisponivel] = useState<number>(0);
    const [erroVenda, setErroVenda] = useState<string>('');
    const [diasSolicitadosVenda, setDiasSolicitadosVenda] = useState<number>(0);

    const closeModal = (): void => {
        setIsModalVisible(false);
    };

    const openModal = (): void => {
        setIsModalVisible(true);
    };

    const calcularDiasFerias = (inicio: Date, fim: Date): number => {
        if (!inicio || !fim) {
            return 0; // Trata o caso onde inicio ou fim são nulos
        }
        const diffTime = Math.abs(fim.getTime() - inicio.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1;
    };

    useEffect(() => {
        const fetchSaldo = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/ferias/saldo?colaboradorId=1');
                if (response.ok) {
                    const saldo = await response.json();
                    setSaldoDisponivel(saldo);
                } else {
                    console.error('Erro ao buscar saldo de férias:', response.status);

                }
            } catch (error) {
                console.error('Erro ao conectar com o servidor:', error);

            }
        };

        fetchSaldo();
    }, []);

    const handleSolicitarFerias = async () => {
        if (!dataInicio || !dataFim) {
            setErroSolicitacao('Selecione as datas de início e fim.');
            return;
        }
        if (dataInicio >= dataFim) {
            setErroSolicitacao('A data de início deve ser anterior à data de fim.');
            return;
        }
        if (feriasAgendadas.length >= 3) {
            setErroSolicitacao('Você já atingiu o limite de 3 períodos de férias no ano.');
            return;
        }

        const diasSolicitados = calcularDiasFerias(dataInicio, dataFim);

        if (diasSolicitados > saldoDisponivel) {
            setErroSolicitacao('Saldo de férias insuficiente para o período solicitado.');
            return;
        }

        try {
            const periodo = `${formatDate(dataInicio)} - ${formatDate(dataFim)}`;
            setFeriasAgendadas([...feriasAgendadas, periodo]);
            setSaldoDisponivel(saldoDisponivel - diasSolicitados);
            setDataInicio(null);
            setDataFim(null);
            setErroSolicitacao('');
            console.log('Solicitação de férias:', {
                dataInicio: dataInicio?.toISOString().split('T')[0], // Usando optional chaining
                dataFim: dataFim?.toISOString().split('T')[0],       // Usando optional chaining
                diasSolicitados,
            });
        } catch (error) {
            setErroSolicitacao('Erro ao conectar com o servidor.');
            console.error('Erro ao solicitar férias:', error);
        }
    };

    const handleVenderDias = () => {
        if (diasVendidos <= 0 || diasVendidos > 10) {
            setErroVenda('Você só pode vender até 10 dias de férias.');
            return;
        }

        if (diasVendidos > saldoDisponivel) {
            setErroVenda('Saldo de férias insuficiente.');
            return;
        }

        setSaldoDisponivel(saldoDisponivel - diasVendidos);
        setDiasSolicitadosVenda(diasSolicitadosVenda + diasVendidos);
        setDiasVendidos(0);
        setErroVenda('');
        closeModal();
        console.log('Solicitação de venda de férias:', diasVendidos);
    };

    const incrementDias = () => {
        if (diasVendidos < 10 && saldoDisponivel > diasVendidos && diasSolicitadosVenda + diasVendidos < 10) {
            setDiasVendidos(diasVendidos + 1);
        } else {
            setErroVenda('Você já atingiu o limite de 10 dias de férias vendidos.');
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

    return (
        <TemplateWithFilter filter={undefined}
        >
            <main className='w-full flex-col px-4 overflow-hidden max-w-screen-md mx-auto pb-20'>
                <h1 className="text-xl font-bold text-left md:text-center mb-4">Férias</h1>
                <div className="flex flex-col items-center justify-center mb-4 gap-2">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">Saldo disponível</h2>
                        <p className={`text-xl ${saldoDisponivel === 0 ? 'text-red-500' : 'text-[#007D26]'}`}>{saldoDisponivel}d</p>
                    </div>
                    {(dataInicio && dataFim) || diasVendidos > 0 ? (
                        <div className="text-center">
                            <p className="text-red-500 text-xl">-{dataInicio && dataFim ? diasSelecionados : saldoNegativoVenda}d</p>
                        </div>
                    ) : null}
                </div>

                <div className="mb-4 bg-white shadow-md rounded-lg p-4 w-full md:w-fit mx-auto">
                    <Calendar
                        onChange={(dates: Date | Date[]) => {
                            if (Array.isArray(dates)) {
                                setDataInicio(dates[0]);
                                setDataFim(dates[1]);
                            }
                        }}
                        selectRange={true}
                        value={dataInicio && dataFim ? [dataInicio, dataFim] : null}
                        className="border rounded-lg p-2 w-full"
                    />
                </div>

                <div className="mb-8 flex justify-center">
                    <button onClick={handleSolicitarFerias} className="bg-[#BCC6E9] text-black h-9 px-6 py-2 rounded-lg">Solicitar Férias</button>
                </div>

                {erroSolicitacao && <p className="text-red-500 mt-2 text-center">{erroSolicitacao}</p>}

                {feriasAgendadas.length > 0 && (
                    <div className="mt-4 bg-white shadow-md rounded-lg p-4 w-full md:w-fit mx-auto">
                        <h3 className="text-lg font-semibold mb-2">Férias Agendadas:</h3>
                        <ul>
                            {feriasAgendadas.map((periodo, index) => (
                                <li key={index} className="mb-1 p-2 border border-gray-300 rounded-lg">{periodo}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <h1 className="text-xl font-bold text-left md:text-center mt-8 mb-4">Abonar Férias</h1>

                <div className="w-full md:w-64 h-9 flex items-center justify-between shadow-md mx-auto mb-4 border border-gray-300 rounded-lg bg-white p-2">
                    <button onClick={decrementDias} className="bg-main-blue-color text-black px-4 py-2 rounded-lg">-</button>
                    <span className="text-xl">{diasVendidos}</span>
                    <button onClick={incrementDias} className="bg-main-blue-color text-black px-4 py-2 rounded-lg" disabled={diasSolicitadosVenda + diasVendidos >= 10}>+</button>
                </div>

                <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Saldo Disponível</h2>
                        <p className={`text-xl ${saldoDisponivel === 0 ? 'text-red-500' : 'text-[#007D26]'}`}>{saldoDisponivel}d</p>
                    </div>
                    {diasVendidos > 0 && (
                        <div className="flex items-center gap-2">
                            <p className="text-red-500 text-xl">-{diasVendidos}d</p>
                        </div>
                    )}
                </div>

                {erroVenda && <p className="text-red-500 mt-2 text-center">{erroVenda}</p>}

                <div className="flex justify-center mb-8">
                    <button onClick={openModal} className="bg-[#BCC6E9] text-black h-9 px-6 py-2 rounded-lg" disabled={diasSolicitadosVenda >= 10}>Solicitar Venda</button>
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
                <div className="flex justify-around">
                    <button className="flex flex-col items-center">
                        <i className="fa-solid fa-home"></i>
                        <span>Início</span>
                    </button>
                    <button className="flex flex-col items-center">
                        <i className="fa-solid fa-calendar"></i>
                        <span>Férias</span>
                    </button>
                    <button className="flex flex-col items-center">
                        <i className="fa-solid fa-user"></i>
                        <span>Perfil</span>
                    </button>
                </div>
            </nav>
        </TemplateWithFilter>
    );
}

export default Ferias;