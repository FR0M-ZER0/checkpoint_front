// src/components/AdminNotificationCard.tsx
import React from 'react';
// import { formatDate } from '../utils/formatter'; // Removido se não usar aqui dentro

// Tipos possíveis para variantes de card
type CardVariant = 'ponto' | 'ferias' | 'folga' | 'abono' | 'default';

type AdminNotificationCardProp = {
    name: string;
    date: string; // Data de criação/solicitação
    cardType: CardVariant; // Obrigatório para definir o estilo/tipo
    openModal: () => void; // Função para abrir o modal apropriado
    // Props opcionais específicas
    observation?: string;
    dayStart?: string; // Data formatada
    dayEnd?: string;   // Data formatada
    period?: string;   // Para ajuste de ponto
    // Adicione outras props se o componente precisar...
}

// Função para obter estilos (pode ser um objeto também)
const getCardStyles = (variant: CardVariant): string => {
    switch (variant) {
        case 'ferias':
            return 'bg-green-500 hover:bg-green-600 text-white'; // VERDE para Férias
        case 'ponto':
            return 'notification-admin-color'; // Sua classe original para Ponto (ajuste se necessário)
        case 'folga':
            return 'bg-orange-500 hover:bg-orange-600 text-white'; // Exemplo para Folga
        // Adicione outros casos...
        default:
            return 'bg-gray-400 hover:bg-gray-500 text-white';
    }
};

function AdminNotificationCard({
    name, date, cardType, openModal, observation, dayStart, dayEnd, period
}: AdminNotificationCardProp) {

    const cardStyles = getCardStyles(cardType);
    // Define um título baseado no tipo, se necessário
    const title = cardType.charAt(0).toUpperCase() + cardType.slice(1); // Ex: "Ferias", "Ponto"

    return (
        // Aplica estilo dinâmico
        <div
            className={`w-full rounded-xl p-3 flex justify-between shadow-md cursor-pointer ${cardStyles}`}
            onClick={openModal}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openModal()}
        >
            {/* Ícone/Nome/Data (Seção Esquerda) */}
            <div className='flex flex-col mr-4 flex-shrink-0 w-16'>
                 <div className='w-[54px] h-[54px] rounded-full bg-white flex items-center justify-center mb-2'>
                    {/* Ícone pode mudar com base no cardType */}
                    <i className={`fa-solid ${cardType === 'ferias' ? 'fa-plane-departure' : 'fa-user-secret'} text-4xl text-gray-400`}></i>
                 </div>
                 <div className='text-xs text-center'>
                     <p className='font-semibold truncate' title={name}>{name}</p>
                     <p className='opacity-90'>{date}</p>
                 </div>
             </div>

             {/* Informações (Seção Direita) */}
            <div className='flex-grow min-w-0'>
                <p className='font-semibold truncate' title={title}>{title}</p>

                {/* Período (para Férias ou Ponto) */}
                {(cardType === 'ferias' && dayStart && dayEnd) && <p className='text-sm mt-1'>{dayStart} até {dayEnd}</p>}
                {(cardType === 'ponto' && period) && <p className='text-sm mt-1'>Em {period}</p>}
                {/* Adicionar lógica para outros tipos se necessário */}

                 {/* Observação */}
                {observation &&
                    <div className='mt-2'>
                        <p className='text-xs font-medium opacity-90'>Observação:</p>
                        <p className='text-sm line-clamp-2' title={observation}>{observation}</p>
                    </div>
                }
            </div>
        </div>
    );
}

export default AdminNotificationCard;