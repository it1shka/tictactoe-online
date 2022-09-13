package server

import "github.com/gorilla/websocket"

type MessageType string

const (
	// both incoming and outcoming
	MessageText = MessageType("text")
	// Incoming messages
	MessageSetFigure       = MessageType("figure")
	MessageStartGame       = MessageType("start")
	MessageCancelSearching = MessageType("cancel")
	MessageFinishGame      = MessageType("finish")
	// Outcoming messages
	MessageGameStarted = MessageType("started")
)

func WriteTextMessageTo(conn *websocket.Conn, message string) {
	conn.WriteJSON(map[string]any{
		"messageType": MessageText,
		"content":     message,
	})
}

func SendGameStartedMessageTo(conn *websocket.Conn, isPlayingCrosses bool) {
	conn.WriteJSON(map[string]any{
		"messageType":      MessageGameStarted,
		"isPlayingCrosses": isPlayingCrosses,
	})
}
