export const enum MessageType {
  // both incoming and outcoming
  TEXT_MESSAGE = 'text',
  SET_FIGURE = 'figure',

  // outcoming
  START_GAME = 'start',
  CANCEL_GAME = 'cancel',
  CLOSE_GAME = 'close',
  
  // incoming
  GAME_STARTED = 'started',
  YOU_ARE_WINNER = 'winner',
  DRAW = 'draw',
  YOU_ARE_LOOSER = 'looser',
  GAME_CLOSED = 'closed',

  // dedicated to time
  TICK = 'tick',
  TIMEOUT = 'timeout'
}

export type OutcomingMessage = 
  | MessageText
  | MessageSetFigure
  | MessageStartGame
  | MessageCancelSearching
  | MessageCloseGame

export type OutcomingMessageType = 
  | OutcomingMessage['messageType']

export type IncomingMessage =
  | MessageText
  | MessageSetFigure
  | MessageGameStarted
  | MessageYouAreWinner
  | MessageDraw
  | MessageYouAreLooser
  | MessageGameClosed
  | MessageTick
  | MessageTimeout

export type IncomingMessageType = 
  | IncomingMessage['messageType']

interface MessageText {
  messageType: MessageType.TEXT_MESSAGE
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
  messageType: MessageType.CANCEL_GAME
}

interface MessageCloseGame {
  messageType: MessageType.CLOSE_GAME
}

interface MessageGameStarted {
  messageType: MessageType.GAME_STARTED
  isPlayingCrosses: boolean
}

interface MessageYouAreWinner {
  messageType: MessageType.YOU_ARE_WINNER
}

interface MessageDraw {
  messageType: MessageType.DRAW
}

interface MessageYouAreLooser {
  messageType: MessageType.YOU_ARE_LOOSER
}

interface MessageGameClosed {
  messageType: MessageType.GAME_CLOSED
}

interface MessageTick {
  messageType: MessageType.TICK
}

interface MessageTimeout {
  messageType: MessageType.TIMEOUT
}