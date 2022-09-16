import { formatSeconds } from './misc.js';
class Board {
    constructor() {
        const gameRoot = document.querySelector('.game');
        this.timerElement = gameRoot.querySelector('.timer');
        this.turnElement = gameRoot.querySelector('.turn');
        const root = document.querySelector('#tictactoe');
        this.board = Array.from(root.children);
    }
    get turn() {
        return this._turn;
    }
    set turn(value) {
        this._turn = value;
        const prefix = this.isPlayingCross == value
            ? 'Your turn: '
            : 'Opponent turn: ';
        const postfix = value
            ? '<span class="turn-cross">Cross</span>'
            : '<span class="turn-zero">Zero</span>';
        this.turnElement.innerHTML = prefix + postfix;
    }
    get timeLeft() {
        return this._timeLeft;
    }
    set timeLeft(value) {
        if (value < 0)
            return;
        this._timeLeft = value;
        this.timerElement.innerText = formatSeconds(value);
    }
    startGame(isPlayingCross) {
        for (const each of this.board) {
            each.classList.remove('cross', 'zero');
        }
        this.isPlayingCross = isPlayingCross;
        this.turn = true;
        this.timeLeft = 60;
    }
    setFigure(row, column) {
        const cell = this.board[row * 3 + column];
        if (cell.classList.contains('cross') || cell.classList.contains('zero')) {
            return;
        }
        cell.classList.add(this.turn ? 'cross' : 'zero');
        this.turn = !this.turn;
    }
    timerTick() {
        this.timeLeft--;
    }
}
export default new Board();
export function onBoardClick(handler) {
    const root = document.querySelector('#tictactoe');
    const board = Array.from(root.children);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const current = board[row * 3 + col];
            // checking if the cell is not empty
            // then cancelling handler invokation
            if (current.classList.contains('cross') || current.classList.contains('zero'))
                return;
            current.onclick = () => handler(row, col);
        }
    }
}
