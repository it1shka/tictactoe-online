import Board, { onBoardClick } from './Board.js'
import Chat, { onFormMessageSubmit } from './Chat.js'
import { delay, Second, showAlert } from './misc.js'

Chat.pushModalMessage('Click "Find game" to start a new game.')

onFormMessageSubmit(message => {
  Chat.pushMessage(message, true)
})

// async function main() {
//   await delay(3 * Second)
//   showAlert('Game has been started!')
//   Board.startGame()
//   for(let i = 0; i < 3; i++) {
//     await delay(Second)
//     Board.setFigure('cross', i, i)
//   }
//   await delay(3 * Second)
//   Board.finishGame()
// }

// main()

Board.startGame()

onBoardClick((row, col) => {
  Board.setFigure('cross', row, col)
})