import Chat from './Chat.js'

export function find<T extends Element = Element>(query: string) {
  const element = document.querySelector(query)
  if(!element) {
    throw new Error(`Element "${query}" not found.`)
  }
  return element as T
}

export const Second = 1000

export function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time)
  })
}

export const showAlert = (() => {
  const messageQueue: Array<string | undefined> = []

  return async function(message?: string) {
    if(messageQueue.length > 0) {
      messageQueue.push(message)
      return
    }

    messageQueue.push(message)
    while(true) {
      await showAlertAsync(messageQueue[0])
      messageQueue.shift()
      if(messageQueue.length <= 0) break
    }
  }
})()

export async function showAlertAsync(message?: string) {
  const alertElement = document.createElement('aside')
  alertElement.classList.add('alert-window')
  alertElement.innerText = message ?? 'Warning!'
  document.body.appendChild(alertElement)
  await delay(10)
  alertElement.classList.toggle('opened')
  await delay(3 * Second)
  alertElement.classList.toggle('opened')
  await delay(2 * Second)
  alertElement.remove()
}

export function formatSeconds(seconds: number): string {
  const min = ~~(seconds / 60)
  const sec = seconds % 60
  return `${min}:${sec < 10 ? '0' : ''}${sec}`
}

export function websocketCloseReason(code: number): string {
  switch(code) {
    case 1000: return "normal connection closure"
    case 1001: return "either server or client went away"
    case 1002: return "protocol error"
    case 1003: return "received illegal data type"
    case 1004: return "reserved: specific closure reason might be defined in future"
    case 1005: return "no status code was actually present"
    case 1006: return "connection was closed abnormally"
    case 1007: return "received non-consistent message"
    case 1008: return "received message that violates socket policy"
    case 1009: return "received too big message"
    case 1010: return "expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake"
    case 1011: return "server terminating WebSocket connection because it encountered an unexpected condition"
    case 1015: return "failure to perform a TLS handshake"
    default: return "unknown reason"
  }
}

export function chatAndAlert(message: string) {
  showAlert(message)
  Chat.pushModalMessage(message)
}