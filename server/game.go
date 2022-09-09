package server

import (
	"sync"

	"github.com/gorilla/websocket"
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
	mx                      sync.Mutex
	crossPlayer, zeroPlayer *websocket.Conn
	turn                    Turn
	status                  GameStatus
	board                   [3][3]Figure
}

func NewGame(player1, player2 *websocket.Conn) *Game {
	flip := RandBool()
	var a, b *websocket.Conn

	if flip {
		a, b = player1, player2
	} else {
		a, b = player2, player1
	}

	return &Game{
		crossPlayer: a,
		zeroPlayer:  b,
		turn:        TurnCrosses,
		status:      StatusActive,
	}
}

func (game *Game) SetFigure(conn *websocket.Conn, row, col int) {

}
