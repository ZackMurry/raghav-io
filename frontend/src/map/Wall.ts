import autoBind from 'auto-bind'
import { WALL_THICKNESS } from '../constants'
import MapObject from './MapObject'

export type WallDirection = 'vertical' | 'horizontal'

export default class Wall extends MapObject {
  length: number
  dir: WallDirection
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor(x: number, y: number, length: number, dir: WallDirection, canvas: HTMLCanvasElement) {
    let w
    let h
    if (dir === 'horizontal') {
      w = length
      h = WALL_THICKNESS
    } else {
      h = length
      w = WALL_THICKNESS
    }
    super(x, y, w, h, true)
    autoBind(this)
    this.x = x
    this.y = y
    this.length = length
    this.dir = dir
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
  }

  render(px: number, py: number): void {
    this.context.fillStyle = 'black'
    this.context.fillRect(this.canvas.width / 2 + this.x - px, this.canvas.height / 2 - this.y + py, this.width, this.height)
  }
}
