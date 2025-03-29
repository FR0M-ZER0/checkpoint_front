import { Middleware } from '@reduxjs/toolkit'
import { increment } from '../slices/notificationSlice'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { incrementSolicitation } from '../slices/solicitationSlice'

const webSocketMiddleware: Middleware = (store) => {
    let client: Client | null = null

    return (next) => (action) => {
        if (action.type === 'websocket/connect') {
            if (!client) {
                const socket = new SockJS('http://localhost:8080/ws')
                client = new Client({
                    webSocketFactory: () => socket,
                    onConnect: () => {
                        console.log('Conectado ao WebSocket')

                        client!.subscribe('/topic/notificacoes', (message) => {
                            console.log('Nova notificação:', message.body)
                            store.dispatch(increment())
                        })

                        client!.subscribe('/topic/solicitacoes', (message) => {
                            console.log('Nova solicitação:', message.body)
                            store.dispatch(incrementSolicitation())
                        })
                    },
                    onStompError: (frame) => {
                        console.error('Erro no WebSocket:', frame)
                    },
                })

                client.activate()
            }
        } else if (action.type === 'websocket/disconnect') {
            if (client) {
                client.deactivate()
                client = null
                console.log('Desconectado do WebSocket')
            }
        }

        return next(action)
    }
}

export default webSocketMiddleware
