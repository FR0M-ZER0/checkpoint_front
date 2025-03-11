import axios from 'axios'

/**
 * Função para fazer requisições http
 */
const api = axios.create({
    baseURL: 'http://localhost:8080'
})

export default api