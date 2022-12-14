import Board, { onBoardClick } from './Board.js'
import Chat, { onFormMessageSubmit } from './Chat.js'
import GameWindow from './GameWindow.js'
import { MessageType } from './messages.js'
import { chatAndAlert, find, showAlert } from './misc.js'
import Network from './Network.js'

export function activateChat() {
  Chat.pushModalMessage('This is a chat with your opponents.')
  Chat.pushModalMessage('Type "Find Game" to find somebody to play with!')

  Network.on(MessageType.TEXT_MESSAGE, ({ content }) => {
    if(!Chat.isOpened) showAlert(`Chat: ${content}`)
    Chat.pushMessage(content, false)
  })

  onFormMessageSubmit(message => {
    Network.send({
      messageType: MessageType.TEXT_MESSAGE,
      content: message
    })
    Chat.pushMessage(message, true)
  })
}

export function gameStarted(myFigure: boolean) {
  // initializing game
  let turn = true, finished = false
  Board.startGame(myFigure)
  GameWindow.layout = 'game'

  chatAndAlert('Game started!')

  // handling player moves...
  onBoardClick((row, column) => {
    if(turn !== myFigure || finished) return
    Network.send({
      messageType: MessageType.SET_FIGURE,
      row, column
    })
    Board.setFigure(row, column)
    turn = !turn
  })

  Network.on(MessageType.SET_FIGURE, ({row, column}) => {
    if(turn === myFigure) return
    Board.setFigure(row, column)
    turn = !turn
  })

  // listening for other messages...
  // messages dedicated to server game state

  function finish(message: string) {
    chatAndAlert(message)
    finished = true
  }

  Network.on(MessageType.YOU_ARE_WINNER, () => 
    finish('You are winner π'))

  Network.on(MessageType.DRAW, () => {
    finish('Draw π€')
  })

  Network.on(MessageType.YOU_ARE_LOOSER, () => 
    finish('You are looser πΆπ»'))
  
  Network.on(MessageType.GAME_CLOSED, () => {
    finish('Opponent left the game.')
    cleanup()
  })

  // timer handlers
  Network.on(MessageType.TICK, () => {
    Board.timerTick()
  })

  Network.on(MessageType.TIMEOUT, () => {
    chatAndAlert('You ran out of time π')
  })
  
  // taking care of exiting game and 
  // cleaning everything up
  
  find<HTMLButtonElement>('#finish-game').onclick = () => {
    Network.send({
      messageType: MessageType.CLOSE_GAME
    })
    Chat.pushModalMessage('You left the game.')
    cleanup()
  }

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
    GameWindow.layout = 'no-game'
  }
}
