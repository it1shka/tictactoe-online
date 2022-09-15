import Chat, { onFormMessageSubmit } from './Chat.js';
import Network from './Network.js';
export function bindChatToNetwork() {
    Network.on("text" /* TEXT_MESSAGE */, ({ content }) => {
        Chat.pushMessage(content, false);
    });
    onFormMessageSubmit(message => {
        Network.send({
            messageType: "text" /* TEXT_MESSAGE */,
            content: message
        });
    });
}
