class Board {
    constructor() {
        this.root = document.querySelector('#tictactoe');
        this.noGame = document.querySelector('#no-game');
        this.board = Array.from(this.root.children);
    }
    clear() {
        for (const each of this.board) {
            each.classList.remove('cross', 'zero');
        }
    }
    startGame() {
        this.noGame.classList.add('closed');
        this.root.classList.remove('closed');
        this.clear();
    }
    setFigure(figure, row, column) {
        const cell = this.board[row * 3 + column];
        cell.classList.add(figure);
    }
    finishGame() {
        this.root.classList.add('closed');
        this.noGame.classList.remove('closed');
    }
}
export default new Board();
export function onBoardClick(handler) {
    const root = document.querySelector('#tictactoe');
    const board = Array.from(root.children);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const current = board[row * 3 + col];
            current.onclick = () => handler(row, col);
        }
    }
}
