import autoBind from 'auto-bind'
import { BULLET_RADIUS, BULLET_SPEED, PLAYER_RADIUS } from './constants'
import DefaultMap from './map/DefaultMap'
import Player from './Player'

export default class Bullet {
  x: number
  y: number
  angle: number
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  id: string
  player: Player
  onHitPlayer: () => void
  shotBy: string
  map: DefaultMap
  onCollision: () => void

  constructor(
    x1: number,
    y1: number,
    angle: number,
    shotBy: string,
    canvas: HTMLCanvasElement,
    id: string,
    player: Player,
    map: DefaultMap,
    onCollision: () => void
  ) {
    autoBind(this)
    this.x = x1
    this.y = y1
    this.angle = angle
    this.shotBy = shotBy
    this.canvas = canvas
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.id = id
    this.player = player
    this.onHitPlayer = () => undefined
    this.map = map
    this.onCollision = onCollision
  }

  update(delta: number): void {
    const actualSpeed = delta * BULLET_SPEED
    this.x += Math.cos((Math.PI / 180) * this.angle) * actualSpeed
    this.y += Math.sin((Math.PI / 180) * this.angle) * actualSpeed
    if (!this.map.canBulletTravelToPosition(this.x, this.y)) {
      this.onCollision()
    }
    if (this.player.id !== this.shotBy) {
      console.log('bullet not shot by player')
      const xs = (this.x - this.player.x) * (this.x - this.player.x)
      const ys = (this.y - this.player.y) * (this.y - this.player.y)
      if (xs + ys <= PLAYER_RADIUS * PLAYER_RADIUS) {
        this.onHitPlayer()
      }
    }
  }

  render(): void {
    this.context.fillStyle = 'black'
    this.context.save()
    // this.context.translate(this.canvas.width / 2 + this.x - this.player.x, this.canvas.height / 2 - this.y + this.player.y)
    this.context.beginPath()
    this.context.ellipse(
      this.canvas.width / 2 + this.x - this.player.x,
      this.canvas.height / 2 - this.y + this.player.y,
      BULLET_RADIUS,
      BULLET_RADIUS,
      0,
      0,
      2 * Math.PI
    )
    this.context.fill()
    this.context.restore()
  }
}
