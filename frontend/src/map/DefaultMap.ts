import autoBind from 'auto-bind'
import { PLAYER_COLLISION_LENIENCY, PLAYER_RADIUS } from '../constants'
import CollisionUtils from './CollisionUtils'
import Wall from './Wall'

export default class DefaultMap {
  walls: Wall[]
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    autoBind(this)
    this.canvas = canvas
    this.walls = []
    this.walls.push(new Wall(150, 150, 150, 'horizontal', this.canvas))
    this.walls.push(new Wall(150, 150, 150, 'vertical', this.canvas))
  }

  render(px: number, py: number): void {
    this.walls.forEach(w => w.render(px, py))
  }

  canPlayerMoveToPosition(px: number, py: number): boolean {
    // Treat player's hitbox as a square
    for (let i = 0; i < this.walls.length; i++) {
      const w = this.walls[i]
      if (
        CollisionUtils.doRectanglesIntercept(
          w.x,
          w.y,
          w.x + w.width,
          w.y - w.height,
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
}
