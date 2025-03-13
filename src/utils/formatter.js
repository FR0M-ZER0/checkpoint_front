const formatDate = (val) => {
    return new Date(val).toLocaleDateString('pt-BR')
}

export {
    formatDate
}