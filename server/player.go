package server

import (
	"fmt"

	"github.com/gorilla/websocket"
)

type Player struct {
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

		case "text":
			if content, ok := message["content"].(string); ok {
				player.MessageOpponent(content)
			}

		case "figure":
			row, ok := message["row"].(int)
			if !ok {
				break
			}
			col, ok := message["column"].(int)
			if !ok {
				break
			}
			player.SetFigure(row, col)

		case "start":
			player.FindNewGame()

		case "cancel":
			player.CancelNewGame()

		case "finish":
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
	if player.opponent == nil {
		return
	}
	oppconn := player.opponent.conn
	oppconn.WriteJSON(map[string]any{
		"messageType": "text",
		"content":     message,
	})
}

func (player *Player) SetFigure(row, col int) {
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
	if player.game == nil {
		return
	}
	player.game.FinishGame(player)
}
