import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './slices/notificationSlice'
import webSocketMiddleware from './middleware/webSocketMiddleware'

export const store = configureStore({
    reducer: {
        notifications: notificationReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(webSocketMiddleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch