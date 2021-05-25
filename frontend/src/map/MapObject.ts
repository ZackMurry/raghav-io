export default abstract class MapObject {
  x: number
  y: number
  width: number
  height: number
  hasHitbox: boolean

  constructor(x: number, y: number, width: number, height: number, hasHitbox: boolean) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.hasHitbox = hasHitbox
  }

  abstract render(px: number, py: number): void
}
