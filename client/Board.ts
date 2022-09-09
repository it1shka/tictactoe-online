import { formatSeconds } from "./misc.js"

class Board {
  private gameElement: HTMLElement
  private finishGameElement: HTMLElement
  private nogameElement: HTMLElement
  private timerElement: HTMLElement
  private turnElement: HTMLElement

  private board: HTMLDivElement[]
  private isPlayingCross!: boolean
  private _turn!: boolean
  private _timeLeft!: number

  private get turn() {
    return this._turn
  }

  private set turn(value: boolean) {
    this._turn = value
    const prefix = this.isPlayingCross == value 
      ? 'Your turn: '
      : 'Opponent turn: '
    const postfix = value 
      ? '<span class="turn-cross">Cross</span>'
      : '<span class="turn-zero">Zero</span>'
    this.turnElement.innerHTML = prefix + postfix
  }

  private get timeLeft() {
    return this._timeLeft
  }

  private set timeLeft(value: number) {
    if(value < 0) return
    this._timeLeft = value
    this.timerElement.innerText = formatSeconds(value)

  }

  constructor() {
    this.nogameElement = document.querySelector('.no-game')!
    this.gameElement = document.querySelector('.game')!
    this.finishGameElement = document.querySelector('#finish-game')!
    this.timerElement = this.gameElement.querySelector('.timer')!
    this.turnElement = this.gameElement.querySelector('.turn')!

    const root = document.querySelector<HTMLDivElement>('#tictactoe')!
    this.board = Array.from(root.children) as HTMLDivElement[]
  }

  startGame(isPlayingCross: boolean) {
    for(const each of this.board) {
      each.classList.remove('cross', 'zero')
    }
    this.isPlayingCross = isPlayingCross
    this.turn = true
    this.timeLeft = 60
    this.nogameElement.classList.add('closed')
    this.gameElement.classList.remove('closed')
    this.finishGameElement.classList.remove('closed')
  }

  setFigure(row: number, column: number) {
    const cell = this.board[row * 3 + column]
    if(cell.classList.contains('cross') || cell.classList.contains('zero')) {
      return
    }
    cell.classList.add(this.turn ? 'cross' : 'zero')
    this.turn = !this.turn
  }

  timerTick() {
    this.timeLeft--
  }

  finishGame() {
    this.gameElement.classList.add('closed')
    this.finishGameElement.classList.add('closed')
    this.nogameElement.classList.remove('closed')
  }
}

export default new Board()

export function onBoardClick(handler: (row: number, col: number) => void) {
  const root = document.querySelector('#tictactoe')!
  const board = Array.from(root.children) as HTMLDivElement[]
  for(let row = 0; row < 3; row++) {
    for(let col = 0; col < 3; col++) {
      const current = board[row * 3 + col]
      current.onclick = () => handler(row, col)
    }
  }
}