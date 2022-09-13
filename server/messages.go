package server

type MessageType string

const (
	// both incoming and outcoming
	MessageText      = MessageType("text")
	MessageSetFigure = MessageType("figure")
	// Incoming messages
	MessageStartGame       = MessageType("start")
	MessageCancelSearching = MessageType("cancel")
	MessageCloseGame       = MessageType("close")
	// Outcoming messages
	MessageGameStarted  = MessageType("started")
	MessageYouAreWinner = MessageType("winner")
	MessageYouAreLooser = MessageType("looser")
	MessageGameClosed   = MessageType("closed")
)

func SendTextMessageTo(player *Player, message string) {
	player.SendToClient(map[string]any{
		"messageType": MessageText,
		"content":     message,
	})
}

func SendGameStartedMessageTo(player *Player, isPlayingCrosses bool) {
	player.SendToClient(map[string]any{
		"messageType":      MessageGameStarted,
		"isPlayingCrosses": isPlayingCrosses,
	})
}

func SendFigureSetMessageTo(player *Player, row, col int) {
	player.SendToClient(map[string]any{
		"messageType": MessageSetFigure,
		"row":         row,
		"column":      col,
	})
}

func SendWinnerMessageTo(player *Player) {
	player.SendToClient(map[string]any{
		"messageType": MessageYouAreWinner,
	})
}

func SendLooserMessageTo(player *Player) {
	player.SendToClient(map[string]any{
		"messageType": MessageYouAreLooser,
	})
}

func SendOpponentClosedGameTo(player *Player) {
	player.SendToClient(map[string]any{
		"messageType": MessageGameClosed,
	})
}
