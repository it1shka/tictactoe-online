import Chat from './Chat.js';
for (let i = 0; i < 10; i++) {
    Chat.pushMessage({ mtype: 'searching' });
    Chat.pushMessage({ mtype: 'gamestart' });
    Chat.pushMessage({ mtype: 'message', self: true, message: 'Hello!' });
    Chat.pushMessage({ mtype: 'message', self: true, message: 'How are you?' });
    Chat.pushMessage({ mtype: 'message', message: 'Hi!' });
    Chat.pushMessage({ mtype: 'message', message: 'Im fine' });
    Chat.pushMessage({ mtype: 'gameend' });
}
const message = 'Hello, world!';
console.log(message);
//# sourceMappingURL=main.js.map