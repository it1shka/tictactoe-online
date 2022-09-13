package server

import (
	"it1shka.com/tictactoe-online/server/utils"
)

type Figure uint

const (
	FigureNothing Figure = iota
	FigureCross
	FigureZero
)

type Turn uint

const (
	TurnCrosses Turn = iota
	TurnZeroes
)

type GameStatus uint

const (
	StatusActive GameStatus = iota
	StatusCrossesWin
	StatusZeroesWin
)

type Game struct {
	crossPlayer, zeroPlayer *Player
	turn                    Turn
	status                  GameStatus
	board                   [3][3]Figure
}

func NewGame(player1, player2 *Player) *Game {
	a, b := utils.RandomArrange(player1, player2)
	return &Game{
		crossPlayer: a,
		zeroPlayer:  b,
		turn:        TurnCrosses,
		status:      StatusActive,
	}
}

func (game *Game) StartGame() {
}

func (game *Game) SetFigure(author *Player, row, col int) {

}

func (game *Game) FinishGame(author *Player) {

}
