import Chat from './Chat.js'

Chat.pushMessage({ mtype: 'searching' })
Chat.pushMessage({ mtype: 'gamestart' })
Chat.pushMessage({ mtype: 'message', self: true, message: 'Hello!' })
Chat.pushMessage({ mtype: 'message', self: true, message: 'How are you?' })
Chat.pushMessage({ mtype: 'message', message: 'Hi!' })
Chat.pushMessage({ mtype: 'message', message: 'Im fine' })
Chat.pushMessage({ mtype: 'gameend' })

const message: string = 'Hello, world!'
console.log(message)