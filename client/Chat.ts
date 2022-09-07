export type ChatMessage = 
  | { mtype: 'message', message: string, self?: boolean }
  | { mtype: 'searching' }
  | { mtype: 'gamestart' }
  | { mtype: 'gameend'   }

class Chat {
  private root: HTMLElement
  private chat: HTMLUListElement
  private toggleButton: HTMLButtonElement

  constructor(private opened: boolean) {
    this.root = document.querySelector('.chat-container')!
    this.chat = this.root.querySelector('#chat')!
    this.toggleButton = document.querySelector('#toggle-chat')!
    this.toggleButton.onclick = this.toggleChat
    if(opened) {
      this.toggleButton.innerText = 'Hide chat'
      this.root.classList.remove('closed')
    } else {
      this.toggleButton.innerText = 'Show chat'
      this.root.classList.add('closed')
    }
  }

  private toggleChat = () => {
    this.opened = !this.opened
    this.root.classList.toggle('closed')
    this.toggleButton.innerText = this.opened
      ? 'Hide chat'
      : 'Show chat'
  }

  pushMessage(message: ChatMessage) {
    const msg = document.createElement('li')
    msg.classList.add(message.mtype)
    const msgtext = (() => {
      switch(message.mtype) {
        case 'searching':
          return 'Searching for game...'
        case 'gamestart':
          return 'Game has been started!'
        case 'gameend':
          return 'Game ended.'
        case 'message':
          return message.message
      }
    })()
    msg.innerText = msgtext
    if(message.mtype === 'message' && message.self) {
      msg.classList.add('self')
    }
    this.chat.appendChild(msg)
  }
}

export default new Chat(false)