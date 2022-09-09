package server

import (
	"github.com/gorilla/websocket"
)

func handleNewConnection(conn *websocket.Conn) {
	user := NewUser(conn)

	defer func() {
		user.FinishGame()
		users.Delete(conn)
		conn.Close()
	}()

	processUserLoop(user)
}

func processUserLoop(user *User) {
	for {

		var data JSON
		if err := user.conn.ReadJSON(&data); err != nil {
			break
		}

		if messageType, ok := data["message_type"].(string); ok {
			switch messageType {

			case "text_message":
				if content, ok := data["content"].(string); ok {
					user.MessageOpponent(content)
				}

			case "set_figure":
				row, ok := data["row"].(int)
				if !ok {
					break
				}
				col, ok := data["col"].(int)
				if !ok {
					break
				}
				user.SetFigure(row, col)

			case "new_game":
				user.FindNewGame()

			case "finish_game":
				user.FinishGame()

			}
		}

	}
}
