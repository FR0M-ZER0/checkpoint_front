const formatDate = (val: Date | string): string => {
    return new Date(val).toLocaleDateString('pt-BR')
}

const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}h: ${minutes}min`
}

const formatTimeAndMinute = (dateString: Date) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
}

const formatStringToTime = (dateString: string): string => {
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}h:${minutes}min`
}


export {
    formatDate,
    formatTime,
    formatTimeAndMinute,
    formatStringToTime
}