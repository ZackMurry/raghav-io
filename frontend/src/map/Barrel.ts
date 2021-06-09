import autoBind from 'auto-bind'
import { OUTLINE_COLOR } from '../constants'
import MapObject from './MapObject'

export const BARREL_RADIUS = 30

const BARREL_COLOR = '#7d5d4f'
const BARREL_HITBOX_RADIUS = Math.round((BARREL_RADIUS * 2) / 3)

export default class Barrel extends MapObject {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  rotation: number

  // x and y are the center coordinates
  constructor(x: number, y: number, canvas: HTMLCanvasElement) {
    super(x - BARREL_HITBOX_RADIUS, y - BARREL_HITBOX_RADIUS, BARREL_HITBOX_RADIUS * 2 - 5, BARREL_HITBOX_RADIUS * 2, true)
    autoBind(this)
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    this.rotation = (Math.random() * Math.PI) / 2
  }

  render(px: number, py: number): void {
    this.context.fillStyle = BARREL_COLOR
    this.context.beginPath()
    this.context.ellipse(
      this.canvas.width / 2 + this.x - px + BARREL_HITBOX_RADIUS,
      this.canvas.height / 2 - this.y + py + BARREL_HITBOX_RADIUS,
      BARREL_RADIUS,
      BARREL_RADIUS,
      0,
      0,
      2 * Math.PI
    )
    this.context.fill()

    this.context.beginPath()
    this.context.strokeStyle = OUTLINE_COLOR
    this.context.lineWidth = 3
    this.context.ellipse(
      this.canvas.width / 2 + this.x - px + BARREL_HITBOX_RADIUS,
      this.canvas.height / 2 - this.y + py + BARREL_HITBOX_RADIUS,
      BARREL_RADIUS,
      BARREL_RADIUS,
      0,
      0,
      2 * Math.PI
    )
    this.context.stroke()

    this.drawLine(px, py, BARREL_RADIUS / 3)
    this.drawLine(px, py, (2.25 * BARREL_RADIUS) / 3)
    this.drawLine(px, py, (3.75 * BARREL_RADIUS) / 3)
    this.drawLine(px, py, (5 * BARREL_RADIUS) / 3)
  }

  drawLine(px: number, py: number, o: number): void {
    this.context.fillStyle = OUTLINE_COLOR
    const halfLineHeight = Math.sqrt(2 * BARREL_RADIUS * o - o * o)
    this.context.fillRect(0, 0, 3, 3)
    this.context.fillRect(
      this.canvas.width / 2 + this.x - px + o - (BARREL_RADIUS - BARREL_HITBOX_RADIUS),
      this.canvas.height / 2 - this.y + py - (BARREL_RADIUS - BARREL_HITBOX_RADIUS) + (BARREL_RADIUS - halfLineHeight),
      3,
      2 * halfLineHeight
    )
    // this.context.fillRect(0, -halfLineHeight, 3, 2 * halfLineHeight)
    // this.context.restore()
  }
}
