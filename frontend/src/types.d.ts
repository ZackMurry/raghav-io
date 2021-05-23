export interface Position {
  x: number
  y: number
}

export interface PositionInformation {
  position: Position
  rotation: number
}

export interface PlayerPositionInformation {
  name: string
  position: Position
  rotation: number
}

export interface BulletMessage {
  name: string
  origin: Position
  angle: number
  time: number
  id: string
}

export type GameState = 'STARTING' | 'PLAYING' | 'DEAD'

export interface DeathMessage {
  name: string
  bulletId: string
}
