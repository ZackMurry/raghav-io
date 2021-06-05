import autoBind from 'auto-bind'
import { GUN_LENGTH, GUN_WIDTH, NAME_HEIGHT_ABOVE_PLAYER, OUTLINE_COLOR, PLAYER_RADIUS } from './constants'
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
      console.log('returning ', this.x, this.y, this.rotation, this.name)
      return
    }
    this.context.fillStyle = '#7d5d4f'
    this.context.strokeStyle = OUTLINE_COLOR
    this.context.lineWidth = 10
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
    this.context.stroke()
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

    if (this.name !== null) {
      this.context.save()
      this.context.font = 'bold 26px "Hammersmith One"'
      this.context.fillStyle = 'white'
      this.context.textAlign = 'center'
      this.context.lineWidth = 6
      this.context.strokeStyle = OUTLINE_COLOR
      this.context.shadowColor = OUTLINE_COLOR
      this.context.shadowBlur = 1
      this.context.strokeText(
        this.name,
        this.canvas.width / 2 + this.x - this.player.x,
        this.canvas.height / 2 - NAME_HEIGHT_ABOVE_PLAYER - this.y + this.player.y
      )
      this.context.fillText(
        this.name,
        this.canvas.width / 2 + this.x - this.player.x,
        this.canvas.height / 2 - NAME_HEIGHT_ABOVE_PLAYER - this.y + this.player.y
      )
      this.context.restore()
    }

    this.context.save()
    this.context.translate(this.canvas.width / 2 + this.x - this.player.x, this.canvas.height / 2 - this.y + this.player.y)
    this.context.rotate((-this.rotation * Math.PI) / 180)
    this.context.fillStyle = OUTLINE_COLOR
    this.context.fillRect(GUN_WIDTH / 2, -GUN_WIDTH / 2, GUN_LENGTH, GUN_WIDTH)
    this.context.restore()
  }
}
