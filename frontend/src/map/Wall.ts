import autoBind from 'auto-bind'
import { OUTLINE_COLOR, WALL_THICKNESS } from '../constants'
import MapObject from './MapObject'

export type WallDirection = 'vertical' | 'horizontal'

const WOOD_WALL_COLOR = '#7d5d4f'

// todo: create a WoodFloor object as well as other types of wall that would extend wall
// (including a WoodWall that this would now become)
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
    super(x, y, w, h, true, true)
    autoBind(this)
    this.x = x
    this.y = y
    this.length = length
    this.dir = dir
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
  }

  render(px: number, py: number): void {
    this.context.fillStyle = WOOD_WALL_COLOR
    this.context.fillRect(this.canvas.width / 2 + this.x - px, this.canvas.height / 2 - this.y + py, this.width, this.height)
    this.context.strokeStyle = OUTLINE_COLOR
    this.context.lineWidth = 3
    this.context.strokeRect(
      this.canvas.width / 2 + this.x - px,
      this.canvas.height / 2 - this.y + py,
      this.width,
      this.height
    )
  }
}
