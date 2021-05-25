export default class CollisionUtils {
  static doRectanglesIntercept(
    ax1: number,
    ay1: number,
    ax2: number,
    ay2: number,
    bx1: number,
    by1: number,
    bx2: number,
    by2: number
  ): boolean {
    const amaxx = Math.max(ax1, ax2)
    const bmaxx = Math.max(bx1, bx2)
    const aminx = Math.min(ax1, ax2)
    const bminx = Math.min(bx1, bx2)
    if (amaxx < bminx || bmaxx < aminx) {
      return false
    }
    const amaxy = Math.max(ay1, ay2)
    const bmaxy = Math.max(by1, by2)
    const aminy = Math.min(ay1, ay2)
    const bminy = Math.min(by1, by2)
    if (amaxy < bminy || bmaxy < aminy) {
      return false
    }
    console.log('intercept')
    return true
  }
}
