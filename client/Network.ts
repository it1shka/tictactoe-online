import GameWindow from './GameWindow.js'
import { IncomingMessage, IncomingMessageType, OutcomingMessage } from './messages.js'
import { delay, Second, showAlert, websocketCloseReason } from './misc.js'

type Handler<T extends IncomingMessage> = (message: T) => any

type HandlerOf<T extends IncomingMessageType> = 
  Handler<Extract<IncomingMessage, { messageType: T }>>

type Handlers = {
  [T in IncomingMessageType]?: HandlerOf<T>
}

type Events = {
  open: Event,
  message: MessageEvent<any>
  error: Event,
  close: CloseEvent
}

type EventHandler<T extends keyof Events> = 
  (event: Events[T]) => any

type EventHandlers = {
  [T in keyof Events]?: EventHandler<T>
}

class Network {
  private readonly reconnectSeconds = 10
  private readonly handlers: Handlers = {}
  private readonly eventHandlers: EventHandlers = {}
  private ws: WebSocket | null = null

  constructor(private readonly url: string) {
    this.connect()
  }

  // adding and removing handlers

  on<T extends IncomingMessageType>(messageType: T, handler: HandlerOf<T>) {
    this.handlers[messageType] = handler as Handler<any>
  }

  removeHandler(messageType: IncomingMessageType) {
    delete this.handlers[messageType]
  }

  onEvent<T extends keyof Events>(eventName: T, handler: EventHandler<T>) {
    this.eventHandlers[eventName] = handler as EventHandler<any>
  }

  removeEventHandler(eventName: keyof EventHandlers) {
    delete this.eventHandlers[eventName]
  }

  // rest of functionality

  send(message: OutcomingMessage) {
    this.ws?.send(JSON.stringify(message))
  }

  private connect() {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = this.onopen
    this.ws.onmessage = this.onmessage
    this.ws.onerror = this.onerror
    this.ws.onclose = this.onclose
  }

  private onopen = (ev: Event): any => {
    console.log(`Established connection to ${this.url}.`)
    showAlert('Established WebSocket connection!')
    this.eventHandlers.open?.apply(null, [ ev ]) 
  }

  private onmessage = (ev: MessageEvent<any>): any => {
    try {
      const message: IncomingMessage = JSON.parse(ev.data)
      const messageType = message['messageType']
      const handler = this.handlers[messageType]
      if(handler) handler(message as never)
    } catch(error) {
      console.log(`Unknown message: ${ev.data}`)
      showAlert('Error: WebSocket got unknown message')
    } finally {
      this.eventHandlers.message?.apply(null, [ ev ])
    }
  }

  private onerror = (ev: Event): any => {
    console.error('WebSocket error')
    showAlert('WebSocket error occured.')
    this.eventHandlers.error?.apply(null, [ ev ])
  }

  private onclose = async (ev: CloseEvent) => {
    this.ws?.close()
    this.ws = null
    const code = ev.code
    const reason = websocketCloseReason(code)
    console.error(`WebSocket closed due to reason: ${reason}.`)
    showAlert(`WebSocket closed. Reconnecting in ${this.reconnectSeconds} seconds...`)
    this.eventHandlers.close?.apply(null, [ ev ])
    await delay(this.reconnectSeconds * Second)
    this.connect()
  }

}

const url = `ws://${window.location.host}/ws`
export default new Network(url)