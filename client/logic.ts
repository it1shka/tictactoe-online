import Chat, { onFormMessageSubmit } from './Chat.js'
import { MessageType } from './messages.js'
import Network from './Network.js'

export function bindChatToNetwork() {
  Network.on(MessageType.TEXT_MESSAGE, ({ content }) => {
    Chat.pushMessage(content, false)
  })

  onFormMessageSubmit(message => {
    Network.send({
      messageType: MessageType.TEXT_MESSAGE,
      content: message
    })
    
  })
}