export default class FadingCanvasMask {
  r: number
  g: number
  b: number
  fadeTime: number
  maxOpacity: number
  currentFade = 0
  fadeDir = 0
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor(r: number, g: number, b: number, fadeTime: number, maxOpacity: number, canvas: HTMLCanvasElement) {
    this.r = r
    this.g = g
    this.b = b
    this.fadeTime = fadeTime
    this.maxOpacity = maxOpacity
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
  }

  fadeIn(): void {
    this.fadeDir = 1
  }

  fadeOut(): void {
    this.fadeDir = -1
  }

  isDoneFading(): boolean {
    return this.fadeDir === 0
  }

  update(delta: number): void {
    if (this.fadeDir === 0) {
      return
    }
    if (this.fadeDir > 0) {
      this.currentFade = Math.min(this.maxOpacity, this.currentFade + delta / this.fadeTime)
    } else {
      this.currentFade = Math.max(0, this.currentFade - delta / this.fadeTime)
    }
    if (this.currentFade === 0 || this.currentFade === this.maxOpacity) {
      this.fadeDir = 0
    }
  }

  render(): void {
    this.context.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.currentFade})`
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
