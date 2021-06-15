import autoBind from 'auto-bind'
import { BULLET_RADIUS, PLAYER_COLLISION_LENIENCY, PLAYER_RADIUS, WALL_THICKNESS } from '../constants'
import Barrel, { BARREL_RADIUS } from './Barrel'
import CollisionUtils from './CollisionUtils'
import GameMap from './GameMap'
import MapBoundaries from './MapBoundaries'
import MapObject from './MapObject'
import Wall from './Wall'
import Window from './Window'

const SMALL_MAP_SIDE_LENGTH = 1500

// todo windows: you can shoot through them but not walk through them
export default class SmallMap implements GameMap {
  objects: MapObject[] = []
  canvas: HTMLCanvasElement
  boundaries: MapBoundaries

  constructor(canvas: HTMLCanvasElement) {
    autoBind(this)
    this.canvas = canvas
    this.boundaries = new MapBoundaries(SMALL_MAP_SIDE_LENGTH, this.canvas)
    this.objects.push(new Wall(-750, -500, 100, 'horizontal', this.canvas))
    this.objects.push(new Window(-650, -500, 50, 'horizontal', this.canvas))
    this.objects.push(new Wall(-600, -500, 100, 'horizontal', this.canvas))
    this.objects.push(new Wall(-500, -500, 100, 'vertical', this.canvas))
    this.objects.push(new Barrel(-515, -450 + BARREL_RADIUS, this.canvas))
    this.objects.push(new Wall(150, 150, 150, 'horizontal', this.canvas))
    this.objects.push(new Wall(150, 150, 150, 'vertical', this.canvas))
    this.objects.push(new Wall(500, 150, 400, 'vertical', this.canvas))
    this.objects.push(new Wall(-150, -250, 300, 'horizontal', this.canvas))
    this.objects.push(new Barrel(145 - BARREL_RADIUS, 150, this.canvas))
    this.objects.push(new Wall(-100, 300, 400, 'horizontal', this.canvas))
    this.objects.push(new Wall(300, 450 - WALL_THICKNESS, 150, 'vertical', this.canvas))
    this.objects.push(new Barrel(530 + BARREL_RADIUS, -200 + BARREL_RADIUS, this.canvas))
    this.objects.push(new Wall(500, 550, 125, 'horizontal', this.canvas))
    this.objects.push(new Wall(300, 650, 100, 'vertical', this.canvas))
    this.objects.push(new Wall(-400, 100, 250, 'vertical', this.canvas))
    this.objects.push(new Wall(-550, 400, 250, 'horizontal', this.canvas))
  }

  render(px: number, py: number): void {
    this.boundaries.render(px, py)
    this.objects.forEach(o => o.render(px, py))
  }

  canPlayerMoveToPosition(px: number, py: number): boolean {
    if (this.boundaries.isOutsideBounds(px, py)) {
      return false
    }

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
      if (!o.stopsBullets) {
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
