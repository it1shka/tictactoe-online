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

export type IncomingMessageType = 
  | IncomingMessage['messageType']

export interface MessageText {
  messageType: MessageType.TEXT_MESSAGE
  content: string
}

export interface MessageSetFigure {
  messageType: MessageType.SET_FIGURE
  row: number
  column: number
}

export interface MessageStartGame {
  messageType: MessageType.START_GAME
}

export interface MessageCancelSearching {
  messageType: MessageType.CANCEL_GAME
}

export interface MessageCloseGame {
  messageType: MessageType.CLOSE_GAME
}

export interface MessageGameStarted {
  messageType: MessageType.GAME_STARTED
  isPlayingCrosses: boolean
}

export interface MessageYouAreWinner {
  messageType: MessageType.YOU_ARE_WINNER
}

export interface MessageDraw {
  messageType: MessageType.DRAW
}

export interface MessageYouAreLooser {
  messageType: MessageType.YOU_ARE_LOOSER
}

export interface MessageGameClosed {
  messageType: MessageType.GAME_CLOSED
}