import axios from 'axios'

/**
 * Função para fazer requisições http
 */
const api = axios.create({
    baseURL: 'http://localhost:8080'
})

api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data"
    } else {
        config.headers["Content-Type"] = "application/json"
    }
    return config
})

export default api