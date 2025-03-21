import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface NotificationState {
    count: number
}

const initialState: NotificationState = {
    count: 0,
}

export const fetchUnreadNotifications = createAsyncThunk(
    'notifications/fetchUnread',
    async (colaboradorId: number) => {
        const response = await fetch(`http://localhost:8080/colaborador/notificacoes/${colaboradorId}`)
        const data = await response.json()
        return data.length
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
            state.count = action.payload
        })
    }
})

export const { increment, reset } = notificationSlice.actions
export default notificationSlice.reducer