import Board, { onBoardClick } from './Board.js';
import Chat, { onFormMessageSubmit } from './Chat.js';
import GameWindow from './GameWindow.js';
import { chatAndAlert, find, showAlert } from './misc.js';
import Network from './Network.js';
export function activateChat() {
    Chat.pushModalMessage('This is a chat with your opponents.');
    Chat.pushModalMessage('Type "Find Game" to find somebody to play with!');
    Network.on("text" /* TEXT_MESSAGE */, ({ content }) => {
        if (!Chat.isOpened)
            showAlert(`Chat: ${content}`);
        Chat.pushMessage(content, false);
    });
    onFormMessageSubmit(message => {
        Network.send({
            messageType: "text" /* TEXT_MESSAGE */,
            content: message
        });
        Chat.pushMessage(message, true);
    });
}
export function gameStarted(myFigure) {
    // initializing game
    let turn = true, finished = false;
    Board.startGame(myFigure);
    GameWindow.layout = 'game';
    chatAndAlert('Game started!');
    // handling player moves...
    onBoardClick((row, column) => {
        if (turn !== myFigure || finished)
            return;
        Network.send({
            messageType: "figure" /* SET_FIGURE */,
            row, column
        });
        Board.setFigure(row, column);
        turn = !turn;
    });
    Network.on("figure" /* SET_FIGURE */, ({ row, column }) => {
        if (turn === myFigure)
            return;
        Board.setFigure(row, column);
        turn = !turn;
    });
    // listening for other messages...
    // messages dedicated to server game state
    function finish(message) {
        chatAndAlert(message);
        finished = true;
    }
    Network.on("winner" /* YOU_ARE_WINNER */, () => finish('You are winner 👑'));
    Network.on("draw" /* DRAW */, () => {
        finish('Draw 🤝');
    });
    Network.on("looser" /* YOU_ARE_LOOSER */, () => finish('You are looser 👶🏻'));
    Network.on("closed" /* GAME_CLOSED */, () => {
        finish('Opponent left the game.');
        cleanup();
    });
    // taking care of exiting game and 
    // cleaning everything up
    find('#finish-game').onclick = () => {
        Network.send({
            messageType: "close" /* CLOSE_GAME */
        });
        Chat.pushModalMessage('You left the game.');
        cleanup();
    };
    function cleanup() {
        // const handlersToCleanup = [
        //   MessageType.SET_FIGURE,
        //   MessageType.YOU_ARE_WINNER,
        //   MessageType.YOU_ARE_LOOSER,
        //   MessageType.GAME_CLOSED
        // ] as const
        // for(const each of handlersToCleanup) {
        //   Network.removeHandler(each)
        // }
        GameWindow.layout = 'no-game';
    }
}
