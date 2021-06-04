import autoBind from 'auto-bind'
import { PLAYER_RADIUS } from './constants'
import Player from './Player'

/**
 * A player controlled by somebody on another device
 */
export default class Body {
  name: string | null
  x: number | null
  y: number | null
  rotation: number | null
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  player: Player

  constructor(
    name: string | null,
    x: number | null,
    y: number | null,
    rotation: number | null,
    canvas: HTMLCanvasElement,
    player: Player
  ) {
    autoBind(this)
    this.name = name
    this.x = x
    this.y = y
    this.rotation = rotation
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    this.player = player
  }

  setPosition(x: number, y: number, rotation: number): void {
    this.x = x
    this.y = y
    this.rotation = rotation
  }

  render(): void {
    if (this.x === null || this.y === null || this.rotation === null) {
      return
    }
    this.context.fillStyle = '#4a4e54'
    this.context.beginPath()
    this.context.ellipse(
      this.canvas.width / 2 + this.x - this.player.x,
      this.canvas.height / 2 - this.y + this.player.y,
      PLAYER_RADIUS,
      PLAYER_RADIUS,
      0,
      0,
      2 * Math.PI
    )
    this.context.fill()

    this.context.save()
    this.context.translate(this.canvas.width / 2 + this.x - this.player.x, this.canvas.height / 2 - this.y + this.player.y)
    this.context.rotate((-this.rotation * Math.PI) / 180)
    this.context.fillStyle = 'black'
    this.context.fillRect(5, -5, 25, 10)
    this.context.restore()
  }
}
