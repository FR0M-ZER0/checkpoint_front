const calculateWorkTime = (inicio: number, fim: number): string => {
    const inicioDate = new Date(inicio)
    const fimDate = new Date(fim)
    const diferencaEmMs = fimDate.getTime() - inicioDate.getTime()
    const diferencaEmHoras = diferencaEmMs / (1000 * 60 * 60)
    const horas = Math.floor(diferencaEmHoras)
    const minutos = Math.round((diferencaEmHoras - horas) * 60)
    return `${horas}h:${minutos}min`;
}

export {
    calculateWorkTime
}