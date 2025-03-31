const formatDate = (val: Date | string): string => {
    // Se já for uma string no formato dd/MM/yyyy, retorna direto
    if (typeof val === 'string' && val.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return val;
    }
    
    // Se for Date ou string ISO, converte
    const date = new Date(val);
    if (isNaN(date.getTime())) {
        return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR');
};

const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}h:${minutes}min`; // Removi o espaço após "h:" para consistência
};

const formatTimeAndMinute = (dateString: Date | string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const formatStringToTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}h:${minutes}min`;
};

export {
    formatDate,
    formatTime,
    formatTimeAndMinute,
    formatStringToTime
};