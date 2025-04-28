import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './slices/notificationSlice'
import webSocketMiddleware from './middleware/webSocketMiddleware'
import solicitationReducer from './slices/solicitationSlice'
import responseReducer from './slices/responseSlice'

export const store = configureStore({
    reducer: {
        notifications: notificationReducer,
        solicitations: solicitationReducer,
        responses: responseReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(webSocketMiddleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch