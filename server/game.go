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

type GameStatus uint

const (
	StatusActive GameStatus = iota
	StatusCrossesWin
	StatusZeroesWin
)

type Game struct {
	sync.Mutex
	crossesPlayer, zeroesPlayer *Player
	turn                        *Player
	status                      GameStatus
	board                       [3][3]Figure
}

func NewGame(player1, player2 *Player) *Game {
	a, b := utils.RandomArrange(player1, player2)
	return &Game{
		crossesPlayer: a,
		zeroesPlayer:  b,
		status:        StatusActive,
	}
}

func (game *Game) opponent(player *Player) *Player {
	if game.crossesPlayer == player {
		return game.zeroesPlayer
	}
	return game.crossesPlayer
}

func (game *Game) StartGame() {
	SendGameStartedMessageTo(game.crossesPlayer.conn, true)
	SendGameStartedMessageTo(game.zeroesPlayer.conn, false)
	game.turn = game.crossesPlayer
}

func (game *Game) SetFigure(author *Player, row, col int) {
	game.Lock()
	defer game.Unlock()

}

func (game *Game) FinishGame(author *Player) {
	game.Lock()
	defer game.Unlock()

}
