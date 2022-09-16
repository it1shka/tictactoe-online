import Network from './Network.js'
import { activateChat, gameStarted } from './logic.js'
import { find } from './misc.js'
import GameWindow from './GameWindow.js'
import { MessageType } from './messages.js'

activateChat()

find<HTMLButtonElement>('#start-game').onclick = () => {
  Network.send({
    messageType: MessageType.START_GAME
  })
  GameWindow.layout = 'searching'
}

find<HTMLButtonElement>('#cancel-game').onclick = () => {
  Network.send({
    messageType: MessageType.CANCEL_GAME
  })
  GameWindow.layout = 'no-game'
}

Network.on(MessageType.GAME_STARTED, ({ isPlayingCrosses }) => {
  gameStarted(isPlayingCrosses)
})

const setStartScreen = () => 
  GameWindow.layout = 'no-game'

Network.onEvent('open', setStartScreen)
Network.onEvent('close', setStartScreen)