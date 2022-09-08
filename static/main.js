import Board from './Board.js';
import Chat, { onFormMessageSubmit } from './Chat.js';
import { delay, showAlert } from './misc.js';
Chat.pushModalMessage('Click "Find game" to start a new game.');
onFormMessageSubmit(message => {
    Chat.pushMessage(message, true);
});
async function main() {
    await delay(3000);
    showAlert('Game has been started!');
    Board.startGame();
    for (let i = 0; i < 3; i++) {
        Board.setFigure('cross', i, i);
    }
    await delay(3000);
    Board.finishGame();
}
main();
