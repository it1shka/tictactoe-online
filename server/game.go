package server

import (
	"sync"
	"time"

	"it1shka.com/tictactoe-online/server/utils"
)

type Figure uint

const (
	FigureNothing Figure = iota
	FigureCross
	FigureZero
)

// GAME

const GAME_TIMEOUT = 60

type Game struct {
	sync.Mutex
	crossesPlayer, zeroesPlayer *Player
	crossesTime, zeroesTime     int
	turn                        *Player
	board                       [3][3]Figure
	// finished when somebody wins,
	// closed when somebody exits
	finished, closed bool
}

func NewGame(player1, player2 *Player) *Game {
	a, b := utils.RandomArrange(player1, player2)
	return &Game{
		crossesPlayer: a,
		zeroesPlayer:  b,
		crossesTime:   GAME_TIMEOUT,
		zeroesTime:    GAME_TIMEOUT,
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
	return FigureZero
}

func (game *Game) decreaseTime() {
	if game.turn == game.crossesPlayer {
		game.crossesTime--
		SendTickMessageTo(game.crossesPlayer)
		return
	}
	game.zeroesTime--
	SendTickMessageTo(game.zeroesPlayer)
}

func (game *Game) timeoutPlayer() *Player {
	if game.crossesTime <= 0 {
		return game.crossesPlayer
	}
	return game.zeroesPlayer
}

func (game *Game) setGameTimer() {
	utils.SetInterval(time.Second, func(quit chan struct{}) {
		game.Lock()
		defer game.Unlock()

		if game.closed || game.finished {
			close(quit)
			return
		}

		game.decreaseTime()
		if game.crossesTime > 0 && game.zeroesTime > 0 {
			return
		}

		lost := game.timeoutPlayer()
		won := game.opponent(lost)
		SendTimeoutMessageTo(lost)
		SendLooserMessageTo(lost)
		SendWinnerMessageTo(won)
		game.finished = true

	})
}

// PUBLIC INTERFACE

// called right after NewGame() constructor
func (game *Game) StartGame() {
	SendGameStartedMessageTo(game.crossesPlayer, true)
	SendGameStartedMessageTo(game.zeroesPlayer, false)
	game.turn = game.crossesPlayer
	game.setGameTimer()
}

func (game *Game) SetFigure(author *Player, row, col int) {
	game.Lock()
	defer game.Unlock()

	if game.closed || game.finished {
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

func (game *Game) TextMessage(author *Player, message string) {
	game.Lock()
	defer game.Unlock()

	if game.closed {
		return
	}

	opp := game.opponent(author)
	SendTextMessageTo(opp, message)
}

func (game *Game) CloseGame(author *Player) {
	game.Lock()
	defer game.Unlock()

	if game.closed {
		return
	}

	SendOpponentClosedGameTo(game.opponent(author))
	if !game.finished {
		game.finished = true
		SendWinnerMessageTo(game.opponent(author))
		SendLooserMessageTo(author)
	}
	// fixing the bug
	author.game, game.opponent(author).game = nil, nil
	game.crossesPlayer, game.zeroesPlayer, game.turn = nil, nil, nil
	game.closed = true
}
