package server

import "github.com/gorilla/websocket"

var users = NewDict[*websocket.Conn, *User]()

type User struct {
	conn     *websocket.Conn
	game     *Game
	opponent *websocket.Conn
}

func NewUser(conn *websocket.Conn) *User {
	return &User{
		conn: conn,
	}
}

func (user *User) MessageOpponent(message string) {

}

func (user *User) SetFigure(row, col int) {

}

func (user *User) FindNewGame() {

}

func (user *User) FinishGame() {

}
