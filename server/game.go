package server

import (
	"sync"

	"it1shka.com/tictactoe-online/server/utils"
)

type Figure uint

const (
	FigureNothing Figure = iota
	FigureCross
	FigureZero
)

type Game struct {
	sync.Mutex
	crossesPlayer, zeroesPlayer *Player
	turn                        *Player
	board                       [3][3]Figure
	finished                    bool
}

func NewGame(player1, player2 *Player) *Game {
	a, b := utils.RandomArrange(player1, player2)
	return &Game{
		crossesPlayer: a,
		zeroesPlayer:  b,
	}
}

// PRIVATE FUNCTIONS

func (game *Game) opponent(player *Player) *Player {
	if game.crossesPlayer == player {
		return game.zeroesPlayer
	}
	return game.crossesPlayer
}

func (game *Game) figureOf(player *Player) Figure {
	if game.crossesPlayer == player {
		return FigureCross
	}
	return FigureCross
}

func (game *Game) checkBoard() {

}

// PUBLIC INTERFACE

func (game *Game) StartGame() {
	SendGameStartedMessageTo(game.crossesPlayer, true)
	SendGameStartedMessageTo(game.zeroesPlayer, false)
	game.turn = game.crossesPlayer
}

func (game *Game) SetFigure(author *Player, row, col int) {
	game.Lock()
	defer game.Unlock()

	if game.finished {
		return
	}

	if author != game.turn {
		return
	}

	if row < 0 || row > 2 || col < 0 || col > 2 {
		return
	}

	if game.board[row][col] != FigureNothing {
		return
	}

	game.board[row][col] = game.figureOf(author)
	SendFigureSetMessageTo(game.opponent(author), row, col)
	game.checkBoard()
	game.turn = game.opponent(author)

}

func (game *Game) FinishGame(author *Player) {
	game.Lock()
	defer game.Unlock()

	if !game.finished {
		game.finished = true
		SendWinnerMessageTo(game.opponent(author))
		SendLooserMessageTo(author)
	}

	SendOpponentFinishedGameTo(game.opponent(author))
	game.crossesPlayer, game.zeroesPlayer, game.turn = nil, nil, nil
}
