const BOUNDARY_THICKNESS = 1000

export default class MapBoundaries {
  sideLength: number
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor(sideLength: number, canvas: HTMLCanvasElement) {
    this.sideLength = sideLength
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
  }

  isOutsideBounds(x: number, y: number): boolean {
    return Math.abs(x) * 2 > this.sideLength || Math.abs(y) * 2 > this.sideLength
  }

  render(px: number, py: number): void {
    const halfSideLength = this.sideLength / 2
    this.context.fillStyle = 'rgba(0, 0, 0, 0.4)'
    this.context.fillRect(
      this.canvas.width / 2 - BOUNDARY_THICKNESS - halfSideLength - px,
      this.canvas.height / 2 - BOUNDARY_THICKNESS - halfSideLength + py,
      BOUNDARY_THICKNESS,
      this.sideLength + 2 * BOUNDARY_THICKNESS
    )
    this.context.fillRect(
      this.canvas.width / 2 - halfSideLength - px,
      this.canvas.height / 2 - BOUNDARY_THICKNESS - halfSideLength + py,
      this.sideLength + BOUNDARY_THICKNESS,
      BOUNDARY_THICKNESS
    )
    this.context.fillRect(
      this.canvas.width / 2 + halfSideLength - px,
      this.canvas.height / 2 - halfSideLength + py,
      BOUNDARY_THICKNESS,
      this.sideLength + BOUNDARY_THICKNESS
    )
    this.context.fillRect(
      this.canvas.width / 2 - halfSideLength - px,
      this.canvas.height / 2 + halfSideLength + py,
      this.sideLength,
      BOUNDARY_THICKNESS
    )
  }
}
