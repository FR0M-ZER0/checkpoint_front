const formatDate = (val: Date | string): string => {
    return new Date(val).toLocaleDateString('pt-BR')
}

export {
    formatDate
}