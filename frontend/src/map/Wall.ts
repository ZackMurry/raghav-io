import autoBind from 'auto-bind'
import { WALL_THICKNESS } from '../constants'
import MapObject from './MapObject'
import WallTexture from '../img/wall.png'

export type WallDirection = 'vertical' | 'horizontal'

// todo: create a WoodFloor object as well as other types of wall that would extend wall
// (including a WoodWall that this would now become)
export default class Wall extends MapObject {
  length: number
  dir: WallDirection
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  element: HTMLImageElement

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
    this.element = document.createElement('img')
    this.element.src = WallTexture
  }

  render(px: number, py: number): void {
    this.context.fillStyle = 'black'
    this.context.fillRect(this.canvas.width / 2 + this.x - px, this.canvas.height / 2 - this.y + py, this.width, this.height)
    this.context.save()
    this.context.translate(this.canvas.width / 2 + this.x - px, this.canvas.height / 2 - this.y + py)
    if (this.dir === 'horizontal') {
      this.context.rotate(-Math.PI / 2)
      this.context.drawImage(this.element, -this.height, 0, this.height, this.width)
    } else {
      this.context.drawImage(this.element, 0, 0, this.width, this.height)
    }
    this.context.restore()
  }
}
