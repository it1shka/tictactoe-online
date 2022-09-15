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
  messageType: 'text'
  content: string
}

export interface MessageSetFigure {
  messageType: 'figure'
  row: number
  column: number
}

export interface MessageStartGame {
  messageType: 'start'
}

export interface MessageCancelSearching {
  messageType: 'cancel'
}

export interface MessageCloseGame {
  messageType: 'close'
}

export interface MessageGameStarted {
  messageType: 'started'
  isPlayingCrosses: boolean
}

export interface MessageYouAreWinner {
  messageType: 'winner'
}

export interface MessageDraw {
  messageType: 'draw'
}

export interface MessageYouAreLooser {
  messageType: 'looser'
}

export interface MessageGameClosed {
  messageType: 'closed'
}