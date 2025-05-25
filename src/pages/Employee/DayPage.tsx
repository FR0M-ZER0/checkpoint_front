import React, { useState, useEffect, FormEvent, ReactNode, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router'; // Adicionado useNavigate e Link (se usado)
import TemplateWithFilter from './TemplateWithFilter'; // Assumindo que este é o correto
import DateFilter from '../../components/DateFilter';
import HoursState from '../../components/HoursState';
import PointButton from '../../components/PointButton';
import SquareButton from '../../components/SquareButton';
import Modal from '../../components/Modal';
import api from '../../services/api'; // Ajuste o caminho se @/services/api for o correto
import { formatStringToTime, formatDate } from '../../utils/formatter';
// import { calculateWorkTime } from '../../utils/comparisons'; // Se você tiver essa função
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useMediaQuery } from '../../utils/hooks';

// Interface para o que esperamos da API /dias-trabalho/{userId}/{selectedDate}
interface DiaDetalhe {
    statusDia?: string; // Ex: "NORMAL", "FERIAS", "FOLGA", "FALTA", "DESCANSO_ESCALA", "DESCONHECIDO"
    mensagem?: string;  // Para DESCANSO_ESCALA ou outras mensagens informativas
    detalhes?: {      // Para FALTAS, FERIAS, FOLGAS (solicitações)
        id?: number | string;
        // Campos de Falta
        tipoFalta?: string;
        motivo?: string; // do abono
        justificativa?: string; // do abono
        statusAbono?: string;
        justificado?: boolean; // da própria falta
        // Campos de Férias (SolicitacaoFerias)
        dataInicio?: string;
        dataFim?: string;
        observacao?: string;
        comentarioGestor?: string;
        statusSolicitacao?: string; // Status da solicitação de férias/folga
        // Campos de Folga (SolicitacaoFolga)
        data?: string; // data da folga
        saldoGasto?: string;
    };
    marcacoes?: Array<{id: string | number; tipo: string; hora: string; dataHora?: string /* Se o backend mandar completo */}>;
    totalHorasDia?: string;
}

function DayPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dayInfo, setDayInfo] = useState<DiaDetalhe | null>(null);
    
    // Mantendo estes para a lógica de exibição de marcações, mas podem ser derivados de dayInfo.marcacoes
    const [markingStart, setMarkingStart] = useState<string>('');
    const [markingPause, setMarkingPause] = useState<string>('');
    const [markingResume, setMarkingResume] = useState<string>('');
    const [markingEnd, setMarkingEnd] = useState<string>('');

    const [markingStartId, setMarkingStartId] = useState<string>('');
    const [markingPauseId, setMarkingPauseId] = useState<string>('');
    const [markingResumeId, setMarkingResumeId] = useState<string>('');
    const [markingEndId, setMarkingEndId] = useState<string>('');

    // doneTime também pode ser derivado ou calculado a partir das marcações
    const [doneTimeStart, setDonetimeStart] = useState<string>('');
    const [doneTimePause, setDonetimePause] = useState<string>('');
    const [doneTimeResume, setDonetimeResume] = useState<string>('');

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>('');
    const [markingIdToEdit, setMarkingIdToEdit] = useState<string>(''); // Renomeado para clareza
    const [periodoModal, setPeriodoModal] = useState<string>('');       // Renomeado
    const [horarioModal, setHorarioModal] = useState<string>('');       // Renomeado
    const [observacaoModal, setObservacaoModal] = useState<string>(''); // Renomeado

    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();
    const [fetchError, setFetchError] = useState<string | null>(null);


    const isDesktop = useMediaQuery('(min-width: 768px)');
    
    const getCurrentDateString = (): string => { // Renomeado para clareza
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const { date: dateParam } = useParams<{ date: string }>();
    const [currentDate, setCurrentDate] = useState<string>(dateParam || getCurrentDateString());

    const openModal = (type: string, id: string, marcacaoPeriodo: string): void => {
        setIsModalVisible(true);
        setModalType(type);
        setMarkingIdToEdit(id); // Usa estado renomeado
        setPeriodoModal(marcacaoPeriodo); // Usa estado renomeado
    };

    const closeModal = (): void => {
        setIsModalVisible(false);
        setObservacaoModal(''); // Usa estado renomeado
        setHorarioModal('');   // Usa estado renomeado
    };

    // Função para calcular tempo entre duas marcações (exemplo, ajuste conforme sua utils)
    const calculateTimeBetween = (startISO: string | null | undefined, endISO: string | null | undefined): string => {
        if (!startISO || !endISO) return '';
        try {
            // A função calculateWorkTime que você tem parece mais complexa,
            // esta é uma simplificação se você só precisa da diferença.
            // Adapte para usar sua utils/comparisons.calculateWorkTime se ela fizer o que precisa.
            const diff = new Date(endISO).getTime() - new Date(startISO).getTime();
            if (diff < 0) return 'Inválido';
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}min`;
        } catch (e) {
            return '';
        }
    };

    const fetchDateDetails = useCallback(async (selectedDate: string) => {
        if (!userId) {
            console.warn("DayPage - fetchDateDetails: userId nulo, não buscando detalhes.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setFetchError(null);
        setDayInfo(null); // Limpa info anterior
        // Resetar marcações
        setMarkingStart(''); setMarkingStartId('');
        setMarkingPause(''); setMarkingPauseId('');
        setMarkingResume(''); setMarkingResumeId('');
        setMarkingEnd(''); setMarkingEndId('');
        setDonetimeStart(''); setDonetimePause(''); setDonetimeResume('');

        try {
            console.log(`DayPage - Chamando /dias-trabalho/${userId}/${selectedDate}`);
            const response = await api.get(`/dias-trabalho/${userId}/${selectedDate}`);
            const data: DiaDetalhe = response.data;
            console.log("DayPage - Dados recebidos:", data);
            setDayInfo(data);

            if (data.statusDia === 'NORMAL' && data.marcacoes && data.marcacoes.length > 0) {
                let sTime: string | undefined, pTime: string | undefined, rTime: string | undefined, eTime: string | undefined;
                data.marcacoes.forEach((marcacao) => {
                    const formattedTime = marcacao.hora; // Assumindo que o backend já envia HH:mm
                    switch (marcacao.tipo) {
                        case 'ENTRADA': setMarkingStart(formattedTime); setMarkingStartId(marcacao.id.toString()); sTime = marcacao.dataHora; break;
                        case 'PAUSA':   setMarkingPause(formattedTime);  setMarkingPauseId(marcacao.id.toString()); pTime = marcacao.dataHora; break;
                        case 'RETOMADA':setMarkingResume(formattedTime);setMarkingResumeId(marcacao.id.toString());rTime = marcacao.dataHora; break;
                        case 'SAIDA':   setMarkingEnd(formattedTime);    setMarkingEndId(marcacao.id.toString());  eTime = marcacao.dataHora; break;
                    }
                });
                setDonetimeStart(calculateTimeBetween(sTime, pTime));
                setDonetimePause(calculateTimeBetween(pTime, rTime));
                setDonetimeResume(calculateTimeBetween(rTime, eTime));
            }
        } catch (err: any) {
            console.error("Erro ao buscar detalhes do dia (DayPage):", err);
            const errorMsg = err.response?.data?.erro || err.message || "Falha ao carregar dados do dia.";
            setFetchError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [userId]); // Adicionado userId como dependência

    const handleDateChange = (newDate: string) => {
        setCurrentDate(newDate);
        navigate(`/dia/${newDate}`);
    };

    const handleModalSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (!userId) {
            toast.error("Usuário não identificado.");
            return;
        }
        const formData = {
            marcacaoId: markingIdToEdit, // Usa estado renomeado
            periodo: periodoModal,       // Usa estado renomeado
            tipo: modalType === 'edit' ? 'edicao' : 'exclusao',
            status: 'PENDENTE', // Status inicial da solicitação de ajuste
            observacao: observacaoModal, // Usa estado renomeado
            horario: modalType === 'edit' ? horarioModal : undefined // Só envia horário na edição
        };
        try {
            console.log("Enviando solicitação de ajuste:", formData);
            await api.post('/ajuste-ponto/solicitacao', formData);
            toast.success('Solicitação de ajuste enviada com sucesso!');
            closeModal();
            fetchDateDetails(currentDate); // Rebusca dados do dia para refletir possíveis mudanças ou status
        } catch (err: any) {
            console.error("Erro ao enviar solicitação de ajuste:", err);
            toast.error(err.response?.data?.erro || 'Erro ao enviar solicitação de ajuste.');
        }
    };

    // O fetchTotalWorkTime original pode ser incorporado no DTO do backend ou chamado aqui
    // Se o backend em /dias-trabalho/{userId}/{data} já retorna totalHorasDia, esta função pode não ser necessária
    // const fetchTotalWorkTime = async (): Promise<void> => { ... }

    useEffect(() => {
        const storedUserId = localStorage.getItem('id');
        if (storedUserId && storedUserId !== "null" && storedUserId.trim() !== "") {
            setUserId(storedUserId);
        } else {
            console.error("DayPage - UserID NÃO encontrado no localStorage!");
            toast.error("Sessão inválida. Por favor, faça login.");
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (userId && currentDate) {
            fetchDateDetails(currentDate);
            // Se fetchTotalWorkTime for separado e necessário:
            // fetchTotalWorkTime(); 
        }
    }, [currentDate, userId, fetchDateDetails]); // fetchDateDetails já está com useCallback

    // ----- Lógica de Exibição -----
    let contentToRender: ReactNode = null;

    if (isLoading) {
        contentToRender = ( /* ... Seu Skeleton JSX para a página inteira ... */ 
            <div className="p-4">
                <Skeleton height={30} width="60%" className="mb-4" />
                <Skeleton height={20} count={3} className="mb-2" />
                <Skeleton height={100} className="mt-4" />
            </div>
        );
    } else if (fetchError) {
        contentToRender = <p className="text-red-500 text-center p-4">{fetchError}</p>;
    } else if (!dayInfo || !dayInfo.statusDia) {
        contentToRender = <p className="text-center mt-10 text-gray-500">Nenhuma informação disponível para este dia.</p>;
    } else {
        let message = '';
        let circleColor = 'bg-gray-500';
        let icon: ReactNode = <i className="fa-solid fa-question opacity-50"></i>;

        switch (dayInfo.statusDia.toUpperCase()) { // Compara com UPPERCASE
            case 'FERIAS':
                message = dayInfo.detalhes?.observacao || 'Você estava de férias neste dia.';
                if (dayInfo.detalhes?.comentarioGestor) message += ` (Gestor: ${dayInfo.detalhes.comentarioGestor})`;
                circleColor = 'dark-green-color'; 
                icon = <i className="fa-solid fa-plane opacity-50"></i>;
                break;
            case 'FOLGA':
                message = dayInfo.detalhes?.observacao || 'Você estava de folga neste dia.';
                if(dayInfo.detalhes?.saldoGasto) message += ` (Usou: ${dayInfo.detalhes.saldoGasto})`;
                circleColor = 'main-orange-color'; 
                icon = <i className="fa-solid fa-bed opacity-50"></i>;
                break;
            case 'FALTA':
                message = `Você se ${dayInfo.detalhes?.tipoFalta === 'ATRASO' ? 'atrasou' : 'ausentou'} neste dia.`;
                if (dayInfo.detalhes?.motivo) message += ` Motivo (abono): ${dayInfo.detalhes.motivo}.`;
                if (dayInfo.detalhes?.statusAbono) message += ` Status Abono: ${dayInfo.detalhes.statusAbono}.`;
                circleColor = 'main-red-color'; 
                icon = <i className="fa-solid fa-briefcase-medical opacity-50"></i>;
                break;
            case 'DESCANSO_ESCALA':
                message = dayInfo.mensagem || 'Dia de descanso pela sua escala!';
                circleColor = 'bg-purple-500'; // Cor que você definiu no EspelhoPontoPage
                icon = <i className="fa-solid fa-mug-saucer opacity-50"></i>;
                break;
            case 'NORMAL':
                // Renderiza a seção de marcações
                break; 
            default:
                message = 'Não há atividades registradas para este dia ou o status é desconhecido.';
                break;
        }

        if (dayInfo.statusDia !== 'NORMAL') {
            contentToRender = (
                <div className="flex flex-col md:justify-start justify-center items-center min-h-[calc(100vh-200px)] pt-10 md:pt-0">
                    <div className={`h-[100px] w-[100px] rounded-full flex justify-center items-center ${circleColor} text-4xl text-white`}>
                        {icon}
                    </div>
                    <p className="mt-4 text-lg text-center px-4">{message}</p>
                    {/* Adicionar mais detalhes se necessário, ex: justificativa da falta */}
                </div>
            );
        } else { 
            contentToRender = (
                <main className='w-full mt-8'>
                    {/* Seus PointButtons para ENTRADA, PAUSA, RETOMADA, SAIDA */}
                    {/* Exemplo para ENTRADA */}
                    <div className='w-full flex justify-between items-center mb-[100px]'>
                        <div className='flex items-center'>
                            <div className='w-[80px] h-[80px] relative'>
                                <PointButton color='main-green-color' icon={<i className="fa-solid fa-door-open text-3xl"></i>}/>
                                <div className='absolute w-[4px] h-[110px] top-[80px] right-1/2 z-[-1] gray-line-color'></div>
                                <div className='text-[12px] light-gray-text absolute top-[100px] w-[400px] left-[50px]'>
                                    <p className='font-medium'>Realizado por</p>
                                    <p className='font-light'>{doneTimeStart}</p>
                                </div>
                            </div>
                            <div className='ml-2'>
                                <p className='text-lg'>Início</p>
                                <p className='font-light text-sm'>{markingStart || '--:--'}</p>
                            </div>
                        </div>
                        {markingStart && <div className='flex'> 
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('edit', markingStartId, 'inicio')}><SquareButton text='Edição' icon={<i className="fa-solid fa-pen text-white"></i>} color='btn-blue-color'/></div>
                            <div className='h-[64px] w-[64px]' onClick={() => openModal('delete', markingStartId, 'inicio')}><SquareButton text='Exclusão' icon={<i className="fa-solid fa-trash text-white"></i>} color='btn-red-color'/></div>
                        </div>}
                    </div>
                    {/* Repetir para PAUSA, RETOMADA, SAIDA */}
                </main>
            );
        }
    }

    return (
        <TemplateWithFilter 
            showFilter={!isDesktop} 
            filter={<DateFilter currentDate={currentDate} onDateChange={handleDateChange} />}
        >
            <div className='mt-4 hidden md:block'>
                <DateFilter currentDate={currentDate} onDateChange={handleDateChange}/>
            </div>

            {dayInfo?.statusDia === 'NORMAL' && dayInfo.totalHorasDia && (
                <div className='mt-4 w-full'>
                    <HoursState totalTime={dayInfo.totalHorasDia} />
                </div>
            )}
            
            {contentToRender}

            {isModalVisible && (
                 <Modal title={`Solicitar ${modalType === 'edit' ? 'ajuste' : 'exclusão'} de ${periodoModal}`} onClose={closeModal}>
                     <form onSubmit={handleModalSubmit}>
                         {modalType === 'edit' && (
                             <div className='mb-4'>
                                 <label htmlFor="markingTime">Novo Horário:</label>
                                 <input type="time" name="markingTime" className='w-full mt-1 p-2 border rounded' value={horarioModal} onChange={e => setHorarioModal(e.target.value)} required/>
                             </div>
                         )}
                         <div className='mb-[60px]'>
                             <label htmlFor="observation">Observação (obrigatória para ajuste/exclusão):</label>
                             <textarea name="observation" rows={5} className='mt-1 block w-full p-2 border rounded shadow-sm' value={observacaoModal} onChange={e => setObservacaoModal(e.target.value)} required></textarea>
                         </div>
                         <div className='text-white flex justify-end gap-3'>
                             <button type="button" className='bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg cursor-pointer' onClick={closeModal}>
                                 Cancelar
                             </button>
                             <button type="submit" className='bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg cursor-pointer'>
                                 Confirmar
                             </button>
                         </div>
                     </form>
                 </Modal>
            )}
        </TemplateWithFilter>
    );
}

export default DayPage;