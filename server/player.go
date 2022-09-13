package server

import (
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
)

// Player is a mediator between *websocket.Conn
// and *Game. It listens for *websocket.Conn
// messages, and delegates them to *Game instance.
// Also Player performs cleanup with Player.cleanupOnClose()
// when connection is being closed
type Player struct {
	sync.RWMutex
	conn   *websocket.Conn
	game   *Game
	closed bool
}

func NewPlayer(conn *websocket.Conn) *Player {
	return &Player{
		conn: conn,
	}
}

// PUBLIC INTERFACE

func (player *Player) ListenMessages() {
	defer player.cleanupOnClose()

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
			} else {
				fmt.Printf("'content' field is not a string: %v\n", content)
			}

		case MessageSetFigure:
			row, ok := message["row"].(int)
			if !ok {
				fmt.Printf("'row' field is not an int: %v\n", row)
				break
			}
			col, ok := message["column"].(int)
			if !ok {
				fmt.Printf("'column' field is not an int: %v\n", col)
				break
			}
			player.SetFigure(row, col)

		case MessageStartGame:
			player.FindNewGame()

		case MessageCancelSearching:
			player.CancelNewGame()

		case MessageCloseGame:
			player.CloseGame()

		default:
			fmt.Printf("Unexpected 'messageType' field: %v\n", message["messageType"])

		}
	}
}

func (player *Player) SendToClient(message map[string]any) {
	player.RLock()
	defer player.RUnlock()

	if player.closed {
		return
	}
	player.conn.WriteJSON(message)
}

// PRIVATE FUNCTIONS

func (player *Player) cleanupOnClose() {
	player.CloseGame()
	matchmakingQueue.Delete(player)
	players.Delete(player)

	player.Lock()
	player.conn.Close()
	player.closed = true
	player.Unlock()
}

// HANDLERS FOR INCOMING USER MESSAGES

func (player *Player) MessageOpponent(message string) {
	player.RLock()
	defer player.RUnlock()

	if player.game == nil {
		return
	}
	player.game.TextMessage(player, message)
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

func (player *Player) CloseGame() {
	player.RLock()
	defer player.RUnlock()

	if player.game == nil {
		return
	}
	player.game.CloseGame(player)
	player.game = nil
}
