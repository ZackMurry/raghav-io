export interface Position {
  x: number
  y: number
}

export interface PositionInformation {
  position: Position
  rotation: number
}

export interface PlayerPositionInformation {
  playerId: string
  position: Position
  rotation: number
}

export interface BulletMessage {
  playerId: string
  origin: Position
  angle: number
  time: number
  id: string
}

export type GameState = 'STARTING' | 'PLAYING' | 'DEAD'

export interface DeathMessage {
  playerId: string
  bulletId: string
}

export interface GameJoinMessage {
  id: string
  name: string
}

export interface IAmMessage {
  id: string
  name: string
  position: Position
  rotation: number
}
