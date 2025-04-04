import { Middleware } from '@reduxjs/toolkit'
import { increment } from '../slices/notificationSlice'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { addSolicitation, incrementSolicitation } from '../slices/solicitationSlice'
import { addResponse, increment as incrementResponse } from '../slices/responseSlice'

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
                            const solicitation = JSON.parse(message.body)
                            console.log('Nova solicitação:', message.body)
                            store.dispatch(incrementSolicitation())
                            store.dispatch(addSolicitation(solicitation))
                        })

                        client!.subscribe('/topic/respostas', (message) => {
                            const response = JSON.parse(message.body)
                            console.log('Nova resposta:', message.body)
                            store.dispatch(incrementResponse())
                            store.dispatch(addResponse(response))
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
