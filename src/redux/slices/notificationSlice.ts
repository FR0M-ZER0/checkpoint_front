import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export interface Notification {
    id: number
    mensagem: string
    lida: boolean
    criadoEm: string
    tipo: string
}

interface NotificationState {
    count: number
    notifications: Notification[]
}

const initialState: NotificationState = {
    count: 0,
    notifications: []
}

export const fetchUnreadNotifications = createAsyncThunk(
    'notifications/fetchUnread',
    async (colaboradorId: number) => {
        const response = await api.get(`/colaborador/notificacoes/${colaboradorId}`)
        return response.data
    }
)

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        increment: (state) => {
            state.count += 1
        },
        reset: (state) => {
            state.count = 0
            state.notifications = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload
            state.count = action.payload.length
        })
    }
})

export const { increment, reset } = notificationSlice.actions
export default notificationSlice.reducer