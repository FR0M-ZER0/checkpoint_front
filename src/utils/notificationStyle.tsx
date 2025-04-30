export function getNotificationStyles(tipo: string): { background: string; text: string } {
    switch (tipo) {
        case 'ferias':
            return { background: 'dark-green-color', text: 'main-white-text' }
        case 'folga':
            return { background: 'main-orange-color', text: 'main-white-text' }
        case 'falta':
            return { background: 'main-red-color', text: 'main-white-text' }
        case 'ponto':
            return { background: 'light-blue-color', text: 'main-white-text' }
        case 'horasExtras':
            return { background: 'dark-blue-color', text: 'main-white-text' }
        case 'abono':
            return { background: 'bg-purple-600', text: 'main-white-text' }
        default:
            return { background: 'gray-300', text: 'main-black-text' }
    }
}
