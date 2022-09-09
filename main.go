package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"it1shka.com/tictactoe-online/server"
)

func main() {
	server.StartMatchmaking()
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", server.WebsocketEndpoint)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Preparing to listen on port %s...", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
