class Chat {
    constructor(opened) {
        this.opened = opened;
        this.toggleChat = () => {
            this.opened = !this.opened;
            this.root.classList.toggle('closed');
            this.toggleButton.innerText = this.opened
                ? 'Hide chat'
                : 'Show chat';
            if (this.opened)
                this.scrollToBottom();
        };
        this.root = document.querySelector('.chat-container');
        this.chat = this.root.querySelector('#chat');
        this.toggleButton = document.querySelector('#toggle-chat');
        this.toggleButton.onclick = this.toggleChat;
        if (opened) {
            this.toggleButton.innerText = 'Hide chat';
            this.root.classList.remove('closed');
        }
        else {
            this.toggleButton.innerText = 'Show chat';
            this.root.classList.add('closed');
        }
    }
    scrollToBottom() {
        const last = this.chat.lastElementChild;
        if (last) {
            last.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
    pushMessage(message) {
        const msg = document.createElement('li');
        msg.classList.add(message.mtype);
        const msgtext = (() => {
            switch (message.mtype) {
                case 'searching':
                    return 'Searching for game...';
                case 'gamestart':
                    return 'Game has been started!';
                case 'gameend':
                    return 'Game ended.';
                case 'message':
                    return message.message;
            }
        })();
        msg.innerText = msgtext;
        if (message.mtype === 'message' && message.self) {
            msg.classList.add('self');
        }
        this.chat.appendChild(msg);
        this.scrollToBottom();
    }
}
export default new Chat(false);
//# sourceMappingURL=Chat.js.map