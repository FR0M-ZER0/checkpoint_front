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

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId: number) => {
        const response = await api.put(`/colaborador/notificacao/${notificationId}`)
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
        builder
        .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload
            state.count = action.payload.length
        })
        .addCase(markNotificationAsRead.fulfilled, (state, action) => {
            const updatedNotification = action.payload;
            state.notifications = state.notifications.map(n =>
                n.id === updatedNotification.id ? { ...n, lida: true } : n
            );
            state.count = state.notifications.filter(n => !n.lida).length;
        })
    }
})

export const { increment, reset } = notificationSlice.actions
export default notificationSlice.reducer