import GameWindow from "./GameWindow.js"
import { IncomingMessage, MessageGameClosed, MessageGameStarted, MessageSetFigure, MessageText, MessageYouAreLooser, MessageYouAreWinner, OutcomingMessage } from "./messages.js"
import { delay, Second, showAlert, websocketCloseReason } from "./misc.js"

type Handlers = {
  text: MessageText
  figure: MessageSetFigure
  started: MessageGameStarted
  winner: MessageYouAreWinner
  looser: MessageYouAreLooser
  closed: MessageGameClosed
}

type Handler<T extends keyof Handlers> = (message: Handlers[T]) => any

class Network {
  private reconnectSeconds = 10
  private handlers: {[T in keyof Handlers]?: Handler<T>} = {}
  private ws: WebSocket | null = null

  constructor(private readonly url: string) {}

  on<T extends keyof Handlers>(messageType: T, handler: Handler<T>) {
    this.handlers[messageType] = handler as any
    return this
  }

  removeHandler(messageType: keyof Handlers) {
    delete this.handlers[messageType]
  }

  connect() {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = this.onopen
    this.ws.onmessage = this.onmessage
    this.ws.onerror = this.onerror
    this.ws.onclose = this.onclose
  }

  send(message: OutcomingMessage) {
    this.ws?.send(JSON.stringify(message))
  }

  private onopen = (_: Event): any => {
    console.log(`Established connection to ${this.url}.`)
    showAlert('Established WebSocket connection!')
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
    }
  }

  private onerror = (_: Event): any => {
    console.error('WebSocket error')
    showAlert('WebSocket error occured.')
  }

  private onclose = async (ev: CloseEvent) => {
    this.ws?.close()
    this.ws = null
    const code = ev.code
    const reason = websocketCloseReason(code)
    console.error(`WebSocket closed due to reason: ${reason}.`)
    showAlert(`WebSocket closed. Reconnecting in ${this.reconnectSeconds} seconds...`)
    // some additional logic to close currently running game
    this.handlers = {}
    GameWindow.layout = 'no-game'
    //
    await delay(this.reconnectSeconds * Second)
    this.connect()
  }

}

const url = `ws://${window.location.host}/ws`
const network = new Network(url)
network.connect()
export default network