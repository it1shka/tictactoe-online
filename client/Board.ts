class Board {
  private root: HTMLDivElement
  private noGame: HTMLDivElement
  private board: HTMLDivElement[]

  constructor() {
    this.root = document.querySelector('#tictactoe')!
    this.noGame = document.querySelector('#no-game')!
    this.board = Array.from(this.root.children) as HTMLDivElement[]
  }

  private clear() {
    for(const each of this.board) {
      each.classList.remove('cross', 'zero')
    }
  }

  startGame() {
    this.noGame.classList.add('closed')
    this.root.classList.remove('closed')
    this.clear()
  }

  setFigure(figure: 'cross' | 'zero', row: number, column: number) {
    const cell = this.board[row * 3 + column]
    cell.classList.add(figure)
  }

  finishGame() {
    this.root.classList.add('closed')
    this.noGame.classList.remove('closed')
  }
}

export default new Board()