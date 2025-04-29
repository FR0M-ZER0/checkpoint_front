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

export interface AbonoFaltaSolicitation {
    id: string
    motivo: string
    justificativa: string
    status: string
    criadoEm: string
    arquivoCaminho?: string
    falta: {
        id: string
        criadoEm: string
        tipo: string
        colaborador: {
            nome: string
        }
    }
}

interface SolicitationState {
    count: number
    solicitations: Solicitation[]
    vacationSolicitations: VacationSolicitation[]
    folgaSolicitations: FolgaSolicitation[]
    abonoFaltaSolicitations: AbonoFaltaSolicitation[]
}

const initialState: SolicitationState = {
    count: 0,
    solicitations: [],
    vacationSolicitations: [],
    folgaSolicitations: [],
    abonoFaltaSolicitations: []
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

export const fetchAbonoFaltaSolicitations = createAsyncThunk(
    'solicitations/fetchAbonoFalta',
    async () => {
        const response = await api.get('/abonar-falta')
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
        },
        updateSolicitation: (state, action) => {
            const { id, changes } = action.payload
            const index = state.solicitations.findIndex(s => s.id === id)
            if (index !== -1) {
                state.solicitations[index] = {
                    ...state.solicitations[index],
                    ...changes
                }
            }
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
        .addCase(fetchAbonoFaltaSolicitations.fulfilled, (state, action) => {
            state.abonoFaltaSolicitations = action.payload
        })
    }
})

export const { incrementSolicitation, resetSolicitation, addSolicitation, removeSolicitation, updateSolicitation } = solicitationSlice.actions
export default solicitationSlice.reducer
