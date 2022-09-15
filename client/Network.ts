import { IncomingMessage, OutcomingMessage } from "./messages.js"
import { delay, Second, showAlert, websocketCloseReason } from "./misc.js"

type Handler = (message: IncomingMessage) => void
type Handlers = {[messageType: string]: Handler}

class Network {
  private reconnectSeconds = 10
  private readonly handlers: Handlers = {}
  private ws: WebSocket | null = null

  constructor(private readonly url: string) {}

  on(messageType: IncomingMessage['messageType'], handler: Handler) {
    this.handlers[messageType] = handler
    return this
  }

  removeHandler(messageType: IncomingMessage['messageType']) {
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
      const handler: Handler | undefined = this.handlers[messageType]
      if(handler) handler(message)
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
    await delay(this.reconnectSeconds * Second)
    this.connect()
  }

}

const url = `ws://${window.location.host}/ws`
const network = new Network(url)
network.connect()
export default network