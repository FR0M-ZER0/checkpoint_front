import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

export interface Solicitation {
    id: string
    marcacaoId?: string
    periodo?: string
    tipo?: string
    status?: string
    observacao?: string
    horario?: string
    criadoEm: string
    data?: string
    colaboradorId?: number
    saldoGasto?: string
    solicitacaoTipo?: string
}

export interface VacationSolicitation {
    id: string
    dataInicio: string
    dataFim: string
    observacao: string
    status: string
    comentarioGestor: string
    colaboradorId: string
    criadoEm: string
}

export interface FolgaSolicitation {
    solFolId: string
    solFolData: string
    solFolObservacao: string
    solFolStatus: string
    colaboradorId: string
    criadoEm: string
    solFolSaldoGasto: string
}

interface SolicitationState {
    count: number
    solicitations: Solicitation[]
    vacationSolicitations: VacationSolicitation[]
    folgaSolicitations: FolgaSolicitation[]
}

const initialState: SolicitationState = {
    count: 0,
    solicitations: [],
    vacationSolicitations: [],
    folgaSolicitations: []
}

export const fetchSolicitations = createAsyncThunk(
    'solicitations/fetchAll',
    async () => {
        const response = await api.get('/ajuste-ponto/solicitacao')
        return response.data
    }
)

export const fetchVacationSolicitations = createAsyncThunk(
    'solicitations/fetchVacations',
    async () => {
        const response = await api.get('/solicitacao-ferias')
        return response.data
    }
)

export const fetchFolgaSolicitations = createAsyncThunk(
    'solicitations/fetchFolgas',
    async () => {
        const response = await api.get('/solicitacao-folga')
        return response.data
    }
)

export const fetchPendingSolicitationsBreak = createAsyncThunk(
    'solicitations/fetchPendingBreak',
    async () => {
        const response = await api.get('/solicitacao-folga/pendentes')
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
            state.vacationSolicitations = []
            state.folgaSolicitations = []
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
        .addCase(fetchSolicitations.fulfilled, (state, action) => {
            state.solicitations = action.payload
            state.count = action.payload.length
        })
        .addCase(fetchVacationSolicitations.fulfilled, (state, action) => {
            state.vacationSolicitations = action.payload
        })
        .addCase(fetchFolgaSolicitations.fulfilled, (state, action) => {
            state.folgaSolicitations = action.payload
        })
    }
})

export const { incrementSolicitation, resetSolicitation, addSolicitation, removeSolicitation } = solicitationSlice.actions
export default solicitationSlice.reducer
