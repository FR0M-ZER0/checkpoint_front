import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import TemplateWithFilter from '../Employee/TemplateWithFilter';
import Modal from '../../components/Modal';
import { formatDate } from '../../utils/formatter'; // Verifique se formata para AAAA-MM-DD
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, differenceInCalendarDays } from 'date-fns';

// Defina tipos para clareza (opcional mas recomendado)
interface SolicitacaoFeriasPayload {
    colaboradorId: number;
    dataInicio: string; // Formato AAAA-MM-DD
    dataFim: string;    // Formato AAAA-MM-DD
    observacao: string;
    status: string;
}

interface SolicitacaoAbonoPayload {
    colaboradorId: number;
    diasVendidos: number;
    // outros campos se necessários, como dataSolicitacao (backend pode definir)
    status: string;
}

// -- Componente Principal --
function Ferias() {
    // --- Estados existentes ---
    const [dataInicio, setDataInicio] = useState<Date | null>(null);
    const [dataFim, setDataFim] = useState<Date | null>(null);
    const [feriasAgendadas, setFeriasAgendadas] = useState<any[]>([]); // Mudar para array de objetos se o backend retornar a lista
    const [erroSolicitacao, setErroSolicitacao] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [diasVendidos, setDiasVendidos] = useState<number>(0);
    const [saldoDisponivel, setSaldoDisponivel] = useState<number | null>(null); // Iniciar como null para indicar carregamento
    const [erroVenda, setErroVenda] = useState<string>('');
    const [diasSolicitadosVenda, setDiasSolicitadosVenda] = useState<number>(0); // Considere se este estado é realmente necessário ou se pode ser derivado

    // --- Novo estado para observação ---
    const [observacao, setObservacao] = useState<string>('');

    // --- Constante para o ID do colaborador (MUDAR PARA ID 2) ---
    // IMPORTANTE: Em uma aplicação real, este ID viria do usuário logado (contexto, Redux, etc.)
    const COLABORADOR_ID = 2;

    // --- Funções do Modal (sem alterações) ---
    const closeModal = (): void => setIsModalVisible(false);
    const openModal = (): void => {
        // Resetar erro da venda ao abrir o modal
        setErroVenda('');
        setIsModalVisible(true);
    };

    // --- Função para calcular dias (sem alterações) ---
    const calcularDiasFerias = (inicio: Date, fim: Date): number => {
        // Retorna 0 se as datas forem inválidas ou se fim for antes de inicio
        if (!inicio || !fim || fim < inicio) {
            return 0;
        }
        // Calcula a diferença em dias de calendário (ex: 14/Mai - 10/Mai = 4)
        // e soma 1 para incluir o dia inicial.
        return differenceInCalendarDays(fim, inicio) + 1;
    };

    // --- Função para buscar saldo (agora reutilizável) ---
    // Usamos useCallback para evitar recriar a função a cada renderização,
    // útil se for passada como dependência para outros useEffects.
    const fetchSaldo = useCallback(async () => {
        // Resetar erro ao buscar saldo
        setErroSolicitacao('');
        setErroVenda('');
        try {
            // *** MUDANÇA: Usando COLABORADOR_ID ***
            const response = await fetch(`http://localhost:8080/api/ferias/saldo?colaboradorId=${COLABORADOR_ID}`);

            if (response.ok) {
                const saldo = await response.json();
                setSaldoDisponivel(saldo);
            } else {
                // Tenta ler a mensagem de erro do backend
                const errorData = await response.json().catch(() => null); // Evita erro se corpo não for JSON
                const errorMessage = errorData?.erro || `Erro ${response.status} ao buscar saldo.`;
                console.error('Erro ao buscar saldo de férias:', errorMessage);
                setErroSolicitacao(errorMessage); // Mostra erro em algum lugar
                setSaldoDisponivel(0); // Define um valor padrão em caso de erro
            }
        } catch (error) {
            console.error('Erro de rede ao buscar saldo:', error);
            setErroSolicitacao('Não foi possível conectar ao servidor para buscar saldo.');
            setSaldoDisponivel(0);
        }
    }, [COLABORADOR_ID]); // Depende do COLABORADOR_ID (se ele pudesse mudar)

    // --- useEffect para buscar saldo inicial ---
    useEffect(() => {
        fetchSaldo();
    }, [fetchSaldo]); // Executa quando fetchSaldo é criado/atualizado

    // --- Função para SOLICITAR FÉRIAS (com API) ---
    const handleSolicitarFerias = async () => {
        setErroSolicitacao(''); // Limpa erros anteriores

        // Validações básicas
        if (!dataInicio || !dataFim) {
            setErroSolicitacao('Selecione as datas de início e fim.');
            return;
        }
        if (dataInicio >= dataFim) {
            setErroSolicitacao('A data de início deve ser anterior à data de fim.');
            return;
        }
        // Remover validação de 3 períodos aqui, backend deve cuidar disso se necessário

        const diasSolicitados = calcularDiasFerias(dataInicio, dataFim);

        // Validação de saldo (ainda útil no frontend para feedback rápido)
        // Adicionado check para saldoDisponivel não ser null
        if (saldoDisponivel === null || diasSolicitados > saldoDisponivel) {
            setErroSolicitacao('Saldo de férias insuficiente para o período solicitado.');
            return;
        }

        // *** INÍCIO DA INTEGRAÇÃO COM API ***
        try {
            // Formatar datas para AAAA-MM-DD
            const formattedDataInicio = format(dataInicio, 'yyyy-MM-dd');
            const formattedDataFim = format(dataFim, 'yyyy-MM-dd');

            // Montar o payload
            const payload: SolicitacaoFeriasPayload = {
                colaboradorId: COLABORADOR_ID,
                dataInicio: formattedDataInicio,
                dataFim: formattedDataFim,
                observacao: observacao, // Incluir observação do estado
                status: 'PENDENTE'     // Definir status inicial
            };

            console.log('Enviando solicitação de férias:', payload); // Log para debug

            // Fazer a chamada POST
            const response = await fetch('http://localhost:8080/api/ferias/agendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // Tratar a resposta
            if (response.ok) {
                const solicitacaoSalva = await response.json();
                console.log('Solicitação de férias salva:', solicitacaoSalva);

                // Atualizar estado local APÓS sucesso
                // Idealmente, buscaria a lista atualizada do backend,
                // mas por simplicidade, adicionamos localmente.
                const periodo = `${formatDate(dataInicio)} - ${formatDate(dataFim)}`; // Usa sua função formatDate
                setFeriasAgendadas(prevAgendadas => [...prevAgendadas, { id: solicitacaoSalva.id, periodo: periodo, ...solicitacaoSalva }]); // Adiciona objeto completo se quiser
                
                // Limpar formulário
                setDataInicio(null);
                setDataFim(null);
                setObservacao(''); // Limpar observação
                setErroSolicitacao('');

                // ATUALIZAR SALDO buscando do backend novamente (MAIS SEGURO)
                fetchSaldo();
                
                alert('Solicitação de férias enviada com sucesso!');


            } else {
                // Erro do backend (ex: 400 Bad Request com JSON de erro)
                const errorData = await response.json().catch(() => ({ erro: `Erro ${response.status} ao solicitar férias.` }));
                console.error('Erro na solicitação de férias:', errorData.erro);
                setErroSolicitacao(errorData.erro || 'Ocorreu um erro ao processar sua solicitação.');
            }

        } catch (error) {
            // Erro de rede ou outro erro inesperado
            console.error('Erro de rede ao solicitar férias:', error);
            setErroSolicitacao('Erro ao conectar com o servidor para solicitar férias.');
        }
        // *** FIM DA INTEGRAÇÃO COM API ***
    };

    // --- Função para VENDER DIAS (com API) ---
    const handleVenderDias = async () => {
        setErroVenda(''); // Limpa erros anteriores

        // Validações básicas
        if (diasVendidos <= 0) { // Não precisa validar > 10 aqui, backend faz isso melhor
             setErroVenda('Selecione a quantidade de dias a vender.');
             return;
        }
        if (saldoDisponivel === null || diasVendidos > saldoDisponivel) {
            setErroVenda('Saldo de férias insuficiente para vender.');
            return;
        }

        // *** INÍCIO DA INTEGRAÇÃO COM API ***
        try {
            // Montar payload
            const payload: SolicitacaoAbonoPayload = {
                colaboradorId: COLABORADOR_ID,
                diasVendidos: diasVendidos,
                status: 'PENDENTE' // Ou como seu backend esperar
            };

            console.log('Enviando solicitação de venda:', payload); // Log para debug

            // Fazer a chamada POST
            const response = await fetch('http://localhost:8080/api/ferias/vender', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // Tratar resposta
            if (response.ok) {
                const abonoSalvo = await response.json();
                console.log('Solicitação de venda salva:', abonoSalvo);

                // Atualizar estado local APÓS sucesso
                setDiasSolicitadosVenda(prevVendidos => prevVendidos + diasVendidos); // Atualiza total vendido (se usar esse estado)
                setDiasVendidos(0);   // Reseta contador
                setErroVenda('');
                closeModal();         // Fecha o modal

                 // ATUALIZAR SALDO buscando do backend novamente
                fetchSaldo();

                alert('Solicitação de venda de férias enviada com sucesso!');

            } else {
                 // Erro do backend (ex: 400 Bad Request com JSON de erro - limite excedido, saldo insuficiente)
                 const errorData = await response.json().catch(() => ({ erro: `Erro ${response.status} ao vender férias.` }));
                 console.error('Erro na venda de férias:', errorData.erro);
                 setErroVenda(errorData.erro || 'Ocorreu um erro ao processar sua solicitação de venda.');
                 // Não fecha o modal para o usuário ver o erro
            }

        } catch (error) {
             // Erro de rede ou outro erro inesperado
             console.error('Erro de rede ao vender férias:', error);
             setErroVenda('Erro ao conectar com o servidor para vender férias.');
              // Não fecha o modal
        }
         // *** FIM DA INTEGRAÇÃO COM API ***
    };


    // --- Funções de incremento/decremento (ajustadas) ---
    const incrementDias = () => {
        // Validação simples no front, mas a real é no backend
        if (saldoDisponivel !== null && saldoDisponivel > diasVendidos) {
             // Remove validação de 10 dias aqui, deixa para o backend
            setDiasVendidos(diasVendidos + 1);
            setErroVenda(''); // Limpa erro ao incrementar com sucesso
        } else if (saldoDisponivel !== null && saldoDisponivel <= diasVendidos) {
             setErroVenda('Saldo insuficiente para vender mais dias.');
        }
    };

    const decrementDias = () => {
        if (diasVendidos > 0) {
            setDiasVendidos(diasVendidos - 1);
            setErroVenda(''); // Limpa erro ao decrementar
        }
    };

    // --- Cálculos para exibição (sem alterações críticas) ---
    const diasSelecionados = dataInicio && dataFim ? calcularDiasFerias(dataInicio, dataFim) : 0;
    const saldoNegativoVenda = diasVendidos > 0 ? diasVendidos : 0; // Usado no modal? Parece redundante
    const saldoAposSelecao = saldoDisponivel !== null ? saldoDisponivel - diasSelecionados - saldoNegativoVenda : 0; // Saldo projetado

    // --- Data mínima para o calendário ---
    const hoje = new Date();
    // Para garantir que apenas o dia seja considerado (ignora horas/minutos)
    hoje.setHours(0, 0, 0, 0); 

    return (
        <TemplateWithFilter filter={undefined}>
            <main className='w-full flex-col px-4 overflow-hidden max-w-screen-md mx-auto pb-20'>
                <h1 className="text-xl font-bold text-left md:text-center mb-4">Férias</h1>
                {/* Exibição do Saldo */}
                <div className="flex flex-col items-center justify-center mb-4 gap-2">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">Saldo disponível</h2>
                        {saldoDisponivel === null ? (
                            <p className="text-xl text-gray-500">Carregando...</p>
                        ) : (
                            <p className={`text-xl ${saldoDisponivel <= 0 ? 'text-red-500' : 'text-[#007D26]'}`}>{saldoDisponivel}d</p>
                        )}
                    </div>
                    {/* Exibição de dias a serem descontados (visual) */}
                    {(diasSelecionados > 0 || saldoNegativoVenda > 0) && saldoDisponivel !== null && (
                         <div className="text-center">
                           <p className="text-red-500 text-xl">-{diasSelecionados + saldoNegativoVenda}d</p>
                           <p className="text-sm text-gray-600">(Saldo ficaria: {saldoAposSelecao}d)</p>
                         </div>
                     )}
                </div>

                {/* Calendário */}
                <div className="mb-4 bg-white shadow-md rounded-lg p-4 w-full md:w-fit mx-auto">
                    <Calendar
                        onChange={(value) => {
                             // O valor pode ser Date, [Date, null], [null, Date] ou [Date, Date]
                             if (Array.isArray(value)) {
                                 setDataInicio(value[0]);
                                 setDataFim(value[1]);
                             } else {
                                 // Caso selecione uma única data (se selectRange falhar ou for desabilitado)
                                 setDataInicio(value);
                                 setDataFim(null); // Reseta data fim se só uma data for selecionada
                             }
                             setErroSolicitacao(''); // Limpa erro ao mudar data
                         }}
                        selectRange={true}
                        value={dataInicio && dataFim ? [dataInicio, dataFim] : dataInicio ? [dataInicio, null] : null} // Ajusta value para range
                        // *** MUDANÇA: Bloquear datas passadas ***
                        minDate={hoje}
                        className="border rounded-lg p-2 w-full"
                    />
                </div>

                {/* *** NOVO CAMPO DE OBSERVAÇÃO *** */}
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
                 {/* ******************************* */}


                <div className="mb-8 flex justify-center">
                    <button onClick={handleSolicitarFerias} className="bg-[#BCC6E9] text-black h-9 px-6 py-2 rounded-lg">Solicitar Férias</button>
                </div>

                {/* Exibição de Erro da Solicitação */}
                {erroSolicitacao && <p className="text-red-500 mt-2 text-center mb-4">{erroSolicitacao}</p>}

                {/* Lista de Férias Agendadas (ou Solicitações) */}
                 {feriasAgendadas.length > 0 && (
                     <div className="mt-4 bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
                         <h3 className="text-lg font-semibold mb-2">Solicitações Enviadas:</h3>
                         <ul>
                            {/* Ajustar aqui se 'feriasAgendadas' guardar objetos */}
                             {feriasAgendadas.map((item, index) => (
                                <li key={item.id || index} className="mb-1 p-2 border border-gray-300 rounded-lg">
                                    {item.periodo || item} {/* Exibe o período ou o objeto */}
                                    {/* Poderia adicionar status aqui se item for o objeto completo */}
                                    {item.status && <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded ${item.status === 'PENDENTE' ? 'bg-yellow-200 text-yellow-800' : item.status === 'APROVADO' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{item.status}</span>}
                                </li>
                             ))}
                         </ul>
                     </div>
                 )}


                {/* Seção de Abonar/Vender Férias */}
                <h1 className="text-xl font-bold text-left md:text-center mt-8 mb-4">Abonar Férias (Vender)</h1>

                <div className="w-full md:w-64 h-9 flex items-center justify-between shadow-md mx-auto mb-4 border border-gray-300 rounded-lg bg-white p-2">
                    {/* Use a classe de cor que você tinha/preferir */}
                    <button onClick={decrementDias} className="bg-main-blue-color text-black px-4 py-2 rounded-lg">-</button>
                    <span className="text-xl">{diasVendidos}</span>
                    {/* Restaurando o disabled e a classe de cor */}
                    <button
                        onClick={incrementDias}
                        className="bg-main-blue-color text-black px-4 py-2 rounded-lg"
                        // Você pode manter ou remover este disabled, a lógica no onClick já valida o saldo
                        // disabled={saldoDisponivel !== null && diasVendidos >= saldoDisponivel}
                        >
                        +
                    </button>
                </div>

                 {/* Exibição do Saldo ao Vender (repetido, pode simplificar) */}
                 {/* <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
                     ... (pode remover essa repetição de saldo) ...
                 </div> */}

                {erroVenda && <p className="text-red-500 mt-2 text-center">{erroVenda}</p>}

                <div className="flex justify-center mb-8">
                     {/* Desabilitar botão se não selecionou dias > 0 */}
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

            {/* Navegação (sem alterações funcionais) */}
            <nav className="fixed bottom-0 w-full bg-main-blue-color text-white p-4">
                {/* ... botões de navegação ... */}
            </nav>
        </TemplateWithFilter>
    );
}

export default Ferias;