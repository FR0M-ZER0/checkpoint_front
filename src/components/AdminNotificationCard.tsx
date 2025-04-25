import React from 'react';

type CardVariant = 'ponto' | 'ferias' | 'folga' | 'abono' | 'default';

type AdminNotificationCardProp = {
    name: string;
    date: string;
    cardType: CardVariant;
    openModal: () => void;
    observation?: string;
    dayStart?: string;
    dayEnd?: string;
    period?: string;
}

const getCardStyles = (variant: CardVariant): string => {
    switch (variant) {
        case 'ferias':
            return 'bg-green-500 hover:bg-green-600 text-white';
        case 'folga':
            return 'bg-orange-500 hover:bg-orange-600 text-white';
        case 'ponto':
            return 'bg-blue-500 hover:bg-blue-600 text-white';
        default:
            return 'bg-gray-400 hover:bg-gray-500 text-white';
    }
};

function AdminNotificationCard({
    name,
    date,
    cardType,
    openModal,
    observation,
    dayStart,
    dayEnd,
    period
}: AdminNotificationCardProp) {
    const cardStyles = getCardStyles(cardType);
    const title = cardType.charAt(0).toUpperCase() + cardType.slice(1);

    return (
        <div
            className={`w-full rounded-xl p-3 flex justify-between shadow-md cursor-pointer ${cardStyles}`}
            onClick={openModal}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openModal()}
        >
            {/* Left Section: Icon + Name/Date */}
            <div className='flex flex-col mr-4 flex-shrink-0 w-16'>
                <div className='w-[54px] h-[54px] rounded-full bg-white flex items-center justify-center mb-2'>
                    <i className={`fa-solid ${
                        cardType === 'ferias' ? 'fa-plane-departure' :
                        cardType === 'folga' ? 'fa-calendar-minus' :
                        'fa-user-secret'
                    } text-4xl text-gray-400`}/>
                </div>
                <div className='text-xs text-center'>
                    <p className='font-semibold truncate' title={name}>{name}</p>
                    <p className='opacity-90'>{date}</p>
                </div>
            </div>

            {/* Right Section: Details */}
            <div className='flex-grow min-w-0'>
                <p className='font-semibold truncate' title={title}>{title}</p>

                {/* Date/Period Display */}
                {cardType === 'ferias' && dayStart && dayEnd && (
                    <p className='text-sm mt-1'>{dayStart} até {dayEnd}</p>
                )}
                {cardType === 'ponto' && period && (
                    <p className='text-sm mt-1'>Em {period}</p>
                )}

                {/* Observation */}
                {observation && (
                    <div className='mt-2'>
                        <p className='text-xs font-medium opacity-90'>Observação:</p>
                        <p className='text-sm line-clamp-2' title={observation}>{observation}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminNotificationCard;