import Network from './Network.js';
import { activateChat, gameStarted } from './logic.js';
import { find } from './misc.js';
import GameWindow from './GameWindow.js';
activateChat();
find('#start-game').onclick = () => {
    Network.send({
        messageType: "start" /* START_GAME */
    });
    GameWindow.layout = 'searching';
};
find('#cancel-game').onclick = () => {
    Network.send({
        messageType: "cancel" /* CANCEL_GAME */
    });
    GameWindow.layout = 'no-game';
};
Network.on("started" /* GAME_STARTED */, ({ isPlayingCrosses }) => {
    gameStarted(isPlayingCrosses);
});
