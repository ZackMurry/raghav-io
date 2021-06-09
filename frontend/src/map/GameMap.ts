export default interface GameMap {
  render: (px: number, py: number) => void
  canPlayerMoveToPosition: (px: number, py: number) => boolean
  canBulletTravelToPosition: (bx: number, by: number) => boolean
}
