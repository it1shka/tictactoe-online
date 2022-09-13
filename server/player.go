package server

import (
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
)

type Player struct {
	sync.RWMutex
	conn     *websocket.Conn
	game     *Game
	opponent *Player
}

func NewPlayer(conn *websocket.Conn) *Player {
	return &Player{
		conn: conn,
	}
}

func (player *Player) ListenMessages() {
	defer player.CleanupOnExit()

	for {
		var message map[string]any
		if err := player.conn.ReadJSON(message); err != nil {
			if !websocket.IsCloseError(err) && !websocket.IsUnexpectedCloseError(err) {
				fmt.Println(err)
			}
			break
		}

		switch message["messageType"] {

		case MessageText:
			if content, ok := message["content"].(string); ok {
				player.MessageOpponent(content)
			}

		case MessageSetFigure:
			row, ok := message["row"].(int)
			if !ok {
				break
			}
			col, ok := message["column"].(int)
			if !ok {
				break
			}
			player.SetFigure(row, col)

		case MessageStartGame:
			player.FindNewGame()

		case MessageCancelSearching:
			player.CancelNewGame()

		case MessageFinishGame:
			player.FinishGame()

		}
	}
}

func (player *Player) CleanupOnExit() {
	player.FinishGame()
	matchmakingQueue.Delete(player)
	players.Delete(player)
	player.conn.Close()
}

func (player *Player) MessageOpponent(message string) {
	player.RLock()
	defer player.RUnlock()

	if player.opponent == nil {
		return
	}
	oppconn := player.opponent.conn
	WriteTextMessageTo(oppconn, message)
}

func (player *Player) SetFigure(row, col int) {
	player.RLock()
	defer player.RUnlock()

	if player.game == nil {
		return
	}
	player.game.SetFigure(player, row, col)
}

func (player *Player) FindNewGame() {
	matchmakingQueue.Append(player)
}

func (player *Player) CancelNewGame() {
	matchmakingQueue.Delete(player)
}

func (player *Player) FinishGame() {
	player.RLock()
	defer player.RUnlock()

	if player.game == nil {
		return
	}
	player.game.FinishGame(player)
}
