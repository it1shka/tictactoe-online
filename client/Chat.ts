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
    if(this.opened) this.scrollToBottom()
  }

  private scrollToBottom() {
    const last = this.chat.lastElementChild
    if(last) {
      last.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  pushMessage(message: string, self?: boolean) {
    const messageElement = document.createElement('li')
    messageElement.classList.add('message')
    messageElement.innerText = message
    if(self) {
      messageElement.classList.add('self')
    }
    this.chat.appendChild(messageElement)
    this.scrollToBottom()
  }

  pushModalMessage(modal: string) {
    const modalElement = document.createElement('li')
    modalElement.classList.add('modal-message')
    modalElement.innerText = modal
    this.chat.appendChild(modalElement)
    this.scrollToBottom()
  }

  get isOpened() {
    return this.opened
  }
}

export default new Chat(false)

export function onFormMessageSubmit(onSubmit: (message: string) => void) {
  const form = document
    .querySelector('#send-message-form') as HTMLFormElement
  const input = form.querySelector('input')!
  form.onsubmit = event => {
    event.preventDefault()
    const value = input.value.trim()
    if(!value) return
    onSubmit(value)
    input.value = ''
  }
}