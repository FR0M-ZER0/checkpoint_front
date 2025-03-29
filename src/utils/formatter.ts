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

export { formatDate };