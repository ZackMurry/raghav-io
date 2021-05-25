import autoBind from 'auto-bind'
import { WALL_THICKNESS } from '../constants'

export type WallDirection = 'vertical' | 'horizontal'

export default class Wall {
  x: number
  y: number
  length: number
  dir: WallDirection
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  width: number
  height: number

  constructor(x: number, y: number, length: number, dir: WallDirection, canvas: HTMLCanvasElement) {
    autoBind(this)
    this.x = x
    this.y = y
    this.length = length
    this.dir = dir
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    if (dir === 'horizontal') {
      this.width = length
      this.height = WALL_THICKNESS
    } else {
      this.height = length
      this.width = WALL_THICKNESS
    }
  }

  render(px: number, py: number): void {
    this.context.fillStyle = 'black'
    this.context.fillRect(this.canvas.width / 2 + this.x - px, this.canvas.height / 2 - this.y + py, this.width, this.height)
  }
}
