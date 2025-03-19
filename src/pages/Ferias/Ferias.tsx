import React, { useState } from 'react';
import TemplateWithFilter from '../Employee/TemplateWithFilter';
import Modal from '../../components/Modal';
import { formatDate } from '../../utils/formatter';

function Ferias() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [diasVendidos, setDiasVendidos] = useState<number>(0);
    const [saldoDisponivel, setSaldoDisponivel] = useState<number>(30);
    const [erro, setErro] = useState<string>('');
    const [diasSolicitados, setDiasSolicitados] = useState<number>(0); // Novo estado para dias solicitados

    const closeModal = (): void => {
        setIsModalVisible(false);
    }

    const openModal = (): void => {
        setIsModalVisible(true);
    }

    const handleVenderDias = () => {
        if (diasVendidos <= 0 || diasVendidos > 10) {
            setErro('Você só pode vender até 10 dias de férias.');
            return;
        }

        if (diasVendidos > saldoDisponivel) {
            setErro('Saldo de férias insuficiente.');
            return;
        }

        if (diasSolicitados + diasVendidos > 10) { // Bloqueia se ultrapassar 10 dias
            setErro('Você já solicitou o limite de 10 dias este mês.');
            return;
        }

        setSaldoDisponivel(saldoDisponivel - diasVendidos);
        setDiasSolicitados(diasSolicitados + diasVendidos); // Atualiza os dias solicitados
        setDiasVendidos(0);
        setErro('');
        closeModal();
    }

    const incrementDias = () => {
        if (diasVendidos < 10 && diasSolicitados + diasVendidos < 10) { // Bloqueia incremento após 10 dias
            setDiasVendidos(diasVendidos + 1);
        }
    }

    const decrementDias = () => {
        if (diasVendidos > 0) {
            setDiasVendidos(diasVendidos - 1);
        }
    }

    return (
        <TemplateWithFilter
            filter={
                <div className='flex w-full flex-col text-center justify-center'>
                    <p className='font-light'>{formatDate(new Date())}</p>
                </div>
            }
        >
            <main className='w-full flex-col px-4 overflow-hidden'>
                {/* Título */}
                <h1 className="text-xl font-bold text-left md:text-center mb-4">Abonar Férias</h1>

                {/* Caixa com os botões de + e - */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 w-full md:w-64 h-5 flex items-center justify-between shadow-md mx-auto">
                    <button
                        onClick={decrementDias}
                        className="bg-main-blue-color text-black px-4 py-2 rounded-lg"
                    >
                        -
                    </button>
                    <span className="text-xl">{diasVendidos}</span>
                    <button
                        onClick={incrementDias}
                        className="bg-main-blue-color text-black px-4 py-2 rounded-lg"
                    >
                        +
                    </button>
                </div>

                {/* Saldo Disponível e Saldo Negativo */}
                <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-2">
                    {/* Saldo Disponível */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Saldo Disponível</h2>
                        <p className={`text-xl ${saldoDisponivel === 0 ? 'text-red-500' : 'text-[#007D26]'}`}>
                            {saldoDisponivel}d
                        </p>
                    </div>

                    {/* Saldo Negativo */}
                    {diasSolicitados > 0 && (
                        <div className="flex items-center gap-2">
                            <p className="text-red-500 text-xl">
                                -{diasSolicitados}d
                            </p>
                        </div>
                    )}
                </div>

                {/* Mensagem de Erro */}
                {erro && <p className="text-red-500 mt-2 text-center">{erro}</p>}

                {/* Botão de Solicitar */}
                <button
                    onClick={openModal}
                    className="bg-[#BCC6E9] text-black gap-10 h-9 px-6 py-2 rounded-lg mt-4 mx-auto block"
                    disabled={diasSolicitados >= 10} // Desabilita o botão após 10 dias
                >
                    Solicitar
                </button>
            </main>

            {/* Modal de Confirmação */}
            {isModalVisible &&
                <Modal title='Confirmar Venda de Dias de Férias' onClose={closeModal}>
                    <div className='mb-[60px]'>
                        <p>Deseja vender {diasVendidos} dias de férias?</p>
                    </div>

                    <div className='text-white'>
                        <button className='main-func-color px-8 py-2 rounded-lg mr-4 cursor-pointer' onClick={handleVenderDias}>
                            Confirmar
                        </button>

                        <button className='sec-func-color px-8 py-2 rounded-lg cursor-pointer' onClick={closeModal}>
                            Cancelar
                        </button>
                    </div>
                </Modal>
            }

            {/* Navbar */}
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