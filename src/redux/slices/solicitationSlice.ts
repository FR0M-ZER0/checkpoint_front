import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

export interface Solicitation {
    id: string
    marcacaoId: string
    periodo: string
    tipo: string
    status: string
    observacao: string
    horario: string
    criadoEm: string
}

interface SolicitationState {
    count: number
    solicitations: Solicitation[]
}

const initialState: SolicitationState = {
    count: 0,
    solicitations: []
}

export const fetchPendingSolicitations = createAsyncThunk(
    'solicitations/fetchPending',
    async () => {
        const response = await api.get('/ajuste-ponto/solicitacao/pendentes')
        return response.data
    }
)

export const solicitationSlice = createSlice({
    name: 'solicitations',
    initialState,
    reducers: {
        incrementSolicitation: (state) => {
            state.count += 1
        },
        resetSolicitation: (state) => {
            state.count = 0
            state.solicitations = []
        },
        addSolicitation: (state, action) => {
            state.solicitations.unshift(action.payload)
            state.count = state.solicitations.length
        },
        removeSolicitation: (state, action) => {
            state.solicitations = state.solicitations.filter(
                (solicitation) => solicitation.id !== action.payload
            )
            state.count = state.solicitations.length
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPendingSolicitations.fulfilled, (state, action) => {
            state.solicitations = action.payload
            state.count = action.payload.length
        })
    }
})

export const { incrementSolicitation, resetSolicitation, addSolicitation, removeSolicitation } = solicitationSlice.actions
export default solicitationSlice.reducer
