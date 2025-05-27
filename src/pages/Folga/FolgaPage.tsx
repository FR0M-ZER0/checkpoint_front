import React, { useState, useEffect } from 'react';
import TemplateWithFilter from '../Employee/TemplateWithFilter';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../../utils/formatter';
import api from '@/services/api';
import Modal from '../../components/Modal'; // Assuming you have a shared Modal

const formatDateForAPI = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const converterParaDecimal = (horas: number, minutos: number): string => {
    const totalHoras = horas + minutos / 60;
    return `${totalHoras.toFixed(2)}h`;
};

function FolgaPage() {
    const [dataFolga, setDataFolga] = useState<Date | null>(null);
    const [horasSolicitadas, setHorasSolicitadas] = useState<number>(0);
    const [minutosSolicitados, setMinutosSolicitados] = useState<number>(0);
    const [observacao, setObservacao] = useState<string>('');
    const [erroSolicitacao, setErroSolicitacao] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>('');
    const [saldoFolgas, setSaldoFolgas] = useState<string>('0h 00min');
    const [folgasAgendadas, setFolgasAgendadas] = useState<any[]>([]);
    const [isRequestModalVisible, setIsRequestModalVisible] = useState<boolean>(false);

    const fetchSaldo = async () => {
        try {
            const response = await api.get(`/horas-extras/colaborador/${userId}`);
            setSaldoFolgas(response.data || '0h 00min');
        } catch (error) {
            console.error('Erro ao buscar saldo:', error);
        }
    };

    const carregarDadosPersistentes = async () => {
        try {
            setCarregando(true);
            const response = await fetch(`http://localhost:8080/api/folga?colaboradorId=${userId}`);
            if (response.ok) {
                const folgas = await response.json();
                setFolgasAgendadas(folgas);
            }
        } catch (error) {
            console.error('Erro ao carregar folgas:', error);
            setErroSolicitacao('Falha ao carregar histórico de folgas.');
        } finally {
            setCarregando(false);
        }
    };

    const handleSolicitarFolga = () => {
        if (!dataFolga || horasSolicitadas < 0 || minutosSolicitados < 0 || (horasSolicitadas === 0 && minutosSolicitados === 0)) {
            setErroSolicitacao('Preencha todos os campos corretamente.');
            return;
        }

        const totalSolicitadoMin = horasSolicitadas * 60 + minutosSolicitados;
        const { horas: hSaldo, minutos: mSaldo } = saldoParaMinutos(saldoFolgas);
        const saldoTotalMin = hSaldo * 60 + mSaldo;

        if (totalSolicitadoMin > saldoTotalMin) {
            setErroSolicitacao('Saldo insuficiente para esta solicitação.');
            return;
        }

        setIsRequestModalVisible(true);
    };

    const confirmarSolicitarFolga = async () => {
        try {
            setCarregando(true);
            const corpoDaRequisicao = JSON.stringify({
                colaboradorId: userId,
                solFolData: formatDateForAPI(dataFolga),
                solFolSaldoGasto: converterParaDecimal(horasSolicitadas, minutosSolicitados),
                solFolObservacao: observacao,
                solFolStatus: "Pendente"
            });

            const response = await fetch('http://localhost:8080/solicitacao-folga', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: corpoDaRequisicao,
            });

            if (!response.ok) throw new Error('Erro ao enviar solicitação.');

            const novaFolga = await response.json();
            setFolgasAgendadas([...folgasAgendadas, novaFolga]);
            setDataFolga(null);
            setHorasSolicitadas(0);
            setMinutosSolicitados(0);
            setObservacao('');
            fetchSaldo();
            setIsRequestModalVisible(false);
        } catch (error) {
            console.error('Erro:', error);
            setErroSolicitacao('Falha na comunicação com o servidor.');
        } finally {
            setCarregando(false);
        }
    };

    const saldoParaMinutos = (saldo: string): { horas: number, minutos: number } => {
        const partes = saldo.split('h');
        const horas = parseInt(partes[0].trim(), 10) || 0;
        const minutosStr = partes[1]?.replace('min', '').trim() || '0';
        const minutos = parseInt(minutosStr, 10) || 0;
        return { horas, minutos };
    };

    const renderCardHeader = (title: string) => (
        <h2 className="text-lg font-semibold mb-3 text-center text-gray-800">{title}</h2>
    );

    useEffect(() => {
        setUserId(localStorage.getItem("id"))
        fetchSaldo()
    }, [userId])


    useEffect(() => {
        carregarDadosPersistentes();
    }, []);

    return (
        <TemplateWithFilter filter={undefined}>
            <main className='w-full flex-col px-4 overflow-hidden max-w-screen-md mx-auto pb-20'>
                <h1 className="text-xl font-bold text-left md:text-center mb-4">Minhas Folgas</h1>

                {/* Saldo Disponível */}
                <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow text-center">
                    {renderCardHeader('Saldo disponível')}
                    <p className={`text-3xl font-bold ${saldoFolgas === '0h 00min' ? 'text-red-600' : 'text-green-600'}`}>
                        {saldoFolgas}
                    </p>
                </div>

                {/* Solicitar Folga */}
                <div className="mb-6 p-4 border rounded-lg shadow bg-white">
                    {renderCardHeader('Solicitar Nova Folga')}
                    <div className="mb-4 flex justify-center">
                        <Calendar
                            minDate={new Date()}
                            value={dataFolga}
                            onChange={(value: any) => setDataFolga(value)}
                            selectRange={false}
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="horas" className="block text-sm font-medium text-gray-700 mb-1">Horas:</label>
                            <input
                                type="number"
                                id="horas"
                                value={horasSolicitadas}
                                onChange={(e) => setHorasSolicitadas(Math.max(0, Number(e.target.value)))}
                                min="0"
                                className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="minutos" className="block text-sm font-medium text-gray-700 mb-1">Minutos:</label>
                            <input
                                type="number"
                                id="minutos"
                                value={minutosSolicitados}
                                onChange={(e) => setMinutosSolicitados(Math.max(0, Math.min(59, Number(e.target.value))))}
                                min="0"
                                max="59"
                                step="5"
                                className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-1">Observação (opcional):</label>
                        <textarea
                            id="observacao"
                            rows={3}
                            className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                            placeholder="Motivo da folga..."
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handleSolicitarFolga}
                            disabled={carregando || (horasSolicitadas === 0 && minutosSolicitados === 0)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 py-2 rounded-lg disabled:opacity-50"
                        >
                            Abrir Confirmação
                        </button>
                    </div>
                    {erroSolicitacao && <p className="text-red-600 mt-3 text-center">{erroSolicitacao}</p>}
                </div>

                {/* Minhas Folgas */}
                <div className="mb-6 p-4 border rounded-lg shadow bg-white">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Minhas Folgas</h3>
                    {carregando && <p className="text-gray-500">Carregando...</p>}
                    {!carregando && folgasAgendadas.length === 0 && <p className="text-gray-500">Nenhuma folga solicitada.</p>}
                    {folgasAgendadas.length > 0 && (
                        <ul className="list-none pl-0 space-y-2">
                            {folgasAgendadas.map((item, index) => (
                                <li key={index} className="p-2 border rounded-md bg-gray-50">
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatDate(new Date(item.solFolData))}
                                    </span>
                                    <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                        {item.solFolStatus}
                                    </span>
                                    <p className="text-sm text-gray-600 mt-1">{item.solFolSaldoGasto}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>

            {/* Modal de Confirmação */}
            {isRequestModalVisible && (
                <Modal title="Confirmar Solicitação de Folga" onClose={() => setIsRequestModalVisible(false)}>
                    <div className="mb-6 text-left space-y-2">
                        <p><strong>Data:</strong> {dataFolga ? formatDate(dataFolga) : '-'}</p>
                        <p><strong>Duração:</strong> {horasSolicitadas}h {String(minutosSolicitados).padStart(2, '0')}min</p>
                        {observacao && <p><strong>Observação:</strong> {observacao}</p>}
                        <p className="pt-3 font-semibold">Enviar solicitação?</p>
                        {erroSolicitacao && <p className="text-red-600 mt-4 text-center font-semibold">{erroSolicitacao}</p>}
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 rounded-lg mr-4 disabled:opacity-50"
                            onClick={confirmarSolicitarFolga}
                            disabled={carregando}
                        >
                            {carregando ? 'Enviando...' : 'Confirmar'}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-8 py-2 rounded-lg"
                            onClick={() => setIsRequestModalVisible(false)}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>
                    </div>
                </Modal>
            )}
        </TemplateWithFilter>
    );
}

export default FolgaPage;