package server

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"it1shka.com/tictactoe-online/server/utils"
)

// MATCHMAKING:

var matchmakingQueue = utils.NewQueue[*Player]()

func makeGame(a, b *Player) {
	game := NewGame(a, b)
	players := []*Player{a, b}
	for _, each := range players {
		each.Lock()
		each.game = game
		each.Unlock()
	}
	game.StartGame()
}

func StartMatchmaking() {
	utils.SetInfiniteLoop(time.Second*3, func() {
		matchmakingQueue.MakePairs(100, makeGame)
	})
}

// NEW PLAYER CONNECTION:

var players = utils.NewDict[*Player, bool]()

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func WebsocketEndpoint(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Fprint(w, "Unable to connect to websocket")
		return
	}

	player := NewPlayer(conn)
	players.Set(player, true)
	go player.ListenMessages()
}
