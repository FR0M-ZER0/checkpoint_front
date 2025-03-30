import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export interface Response {
    id: number
    mensagem: string
    lida: boolean
    criadoEm: string
    tipo: string
}

interface ResponseState {
    count: number
    responses: Response[]
}

const initialState: ResponseState = {
    count: 0,
    responses: []
}

export const fetchUnreadResponses = createAsyncThunk(
    'responses/fetchUnread',
    async (colaboradorId: number) => {
        const response = await api.get(`/colaborador/respostas/${colaboradorId}`)
        return response.data
    }
)

export const markResponseAsRead = createAsyncThunk(
    'responses/markAsRead',
    async (responseId: number) => {
        const response = await api.put(`/colaborador/notificacao/${responseId}`)
        return response.data
    }
)

const responseSlice = createSlice({
    name: 'responses',
    initialState,
    reducers: {
        increment: (state) => {
            state.count += 1
        },
        reset: (state) => {
            state.count = 0
            state.responses = []
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUnreadResponses.fulfilled, (state, action) => {
            state.responses = action.payload
            state.count = action.payload.length
        })
        .addCase(markResponseAsRead.fulfilled, (state, action) => {
            const updatedResponse = action.payload;
            state.responses = state.responses.map(r =>
                r.id === updatedResponse.id ? { ...r, lida: true } : r
            );
            state.count = state.responses.filter(r => !r.lida).length;
        })
    }
})

export const { increment, reset } = responseSlice.actions
export default responseSlice.reducer
