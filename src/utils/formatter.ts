const formatDate = (val: Date): string => {
    return new Date(val).toLocaleDateString('pt-BR')
}

export {
    formatDate
}