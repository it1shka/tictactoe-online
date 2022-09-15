export const enum MessageType {
  // both incoming and outcoming
  TEXT = 'text',
  SET_FIGURE = 'figure',
  // outcoming messages
  START_GAME = 'start',
  CANCEL_SEARCHING = 'cancel',
  CLOSE_GAME = 'close',
  // incoming messages
  GAME_STARTED = 'started',
  WINNER = 'winner',
  LOOSER = 'looser',
  GAME_CLOSED = 'closed'
}

export type OutcomingMessage = 
  | MessageText
  | MessageSetFigure
  | MessageStartGame
  | MessageCancelSearching
  | MessageCloseGame

export type IncomingMessage =
  | MessageText
  | MessageSetFigure
  | MessageGameStarted
  | MessageYouAreWinner
  | MessageYouAreLooser
  | MessageGameClosed

interface MessageText {
  messageType: MessageType.TEXT
  content: string
}

interface MessageSetFigure {
  messageType: MessageType.SET_FIGURE
  row: number
  column: number
}

interface MessageStartGame {
  messageType: MessageType.START_GAME
}

interface MessageCancelSearching {
  messageType: MessageType.CANCEL_SEARCHING
}

interface MessageCloseGame {
  messageType: MessageType.CLOSE_GAME
}

interface MessageGameStarted {
  messageType: MessageType.GAME_STARTED
}

interface MessageYouAreWinner {
  messageType: MessageType.WINNER
}

interface MessageYouAreLooser {
  messageType: MessageType.LOOSER
}

interface MessageGameClosed {
  messageType: MessageType.GAME_CLOSED
}