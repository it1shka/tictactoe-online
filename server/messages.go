package server

import "github.com/gorilla/websocket"

type MessageType string

const (
	MessageText            = MessageType("text")
	MessageSetFigure       = MessageType("figure")
	MessageStartGame       = MessageType("start")
	MessageCancelSearching = MessageType("cancel")
	MessageFinishGame      = MessageType("finish")
)

func WriteTextMessageTo(conn *websocket.Conn, message string) {
	conn.WriteJSON(map[string]any{
		"messageType": MessageText,
		"content":     message,
	})
}
