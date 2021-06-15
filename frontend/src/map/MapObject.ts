// todo circular objects
export default abstract class MapObject {
  x: number
  y: number
  width: number
  height: number
  hasHitbox: boolean
  stopsBullets: boolean

  constructor(x: number, y: number, width: number, height: number, hasHitbox: boolean, stopsBullets: boolean) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.hasHitbox = hasHitbox
    this.stopsBullets = stopsBullets
  }

  abstract render(px: number, py: number): void
}
