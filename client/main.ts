import Chat, { onFormMessageSubmit } from './Chat.js'

onFormMessageSubmit(message => {
  Chat.pushMessage({ 
    mtype: 'message', 
    self: true,
    message 
  })
})