import autoBind from 'auto-bind'
import { BULLET_RADIUS, PLAYER_COLLISION_LENIENCY, PLAYER_RADIUS } from '../constants'
import CollisionUtils from './CollisionUtils'
import MapObject from './MapObject'
import Wall from './Wall'

export default class DefaultMap {
  objects: MapObject[] = []
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    autoBind(this)
    this.canvas = canvas
    this.objects.push(new Wall(150, 150, 150, 'horizontal', this.canvas))
    this.objects.push(new Wall(150, 150, 150, 'vertical', this.canvas))
  }

  render(px: number, py: number): void {
    this.objects.forEach(o => o.render(px, py))
  }

  canPlayerMoveToPosition(px: number, py: number): boolean {
    // Treat player's hitbox as a square
    for (let i = 0; i < this.objects.length; i++) {
      const o = this.objects[i]
      if (!o.hasHitbox) {
        continue
      }
      if (
        CollisionUtils.doRectanglesIntersect(
          o.x,
          o.y,
          o.x + o.width,
          o.y - o.height,
          px - PLAYER_RADIUS + PLAYER_COLLISION_LENIENCY,
          py - PLAYER_RADIUS + PLAYER_COLLISION_LENIENCY,
          px + PLAYER_RADIUS - PLAYER_COLLISION_LENIENCY,
          py + PLAYER_RADIUS - PLAYER_COLLISION_LENIENCY
        )
      ) {
        return false
      }
    }
    return true
  }

  canBulletTravelToPosition(bx: number, by: number): boolean {
    // Treat bullet's hitbox as a square
    for (let i = 0; i < this.objects.length; i++) {
      const o = this.objects[i]
      if (!o.hasHitbox) {
        continue
      }
      if (
        CollisionUtils.doRectanglesIntersect(
          o.x,
          o.y,
          o.x + o.width,
          o.y - o.height,
          bx - BULLET_RADIUS,
          by - BULLET_RADIUS,
          bx + BULLET_RADIUS,
          by + BULLET_RADIUS
        )
      ) {
        return false
      }
    }
    return true
  }
}
