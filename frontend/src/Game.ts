import autoBind from 'auto-bind'
import Player from './Player'

export default class Game {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  lastFrame = 0
  fps = 0
  fpsTimeout = 0
  frameCount = 0
  player: Player

  constructor() {
    autoBind(this)
    this.canvas = document.getElementById('game') as HTMLCanvasElement
    if (!this.canvas) {
      throw new Error('Canvas not found')
    }
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    if (!this.context) {
      throw new Error('Canvas 2D context not found')
    }
    this.player = new Player(this.canvas)
    window.addEventListener('resize', this.onResize)
    this.onResize()
    this.main(0)
  }

  main(time: number): void {
    requestAnimationFrame(this.main)
    this.update(time)
    this.render()
  }

  update(time: number): void {
    const delta = time - this.lastFrame
    this.lastFrame = time
    this.updateFps(delta)
    this.player.update(delta)
  }

  updateFps(delta: number): void {
    if (this.fpsTimeout > 250) {
      this.fps = Math.round((this.frameCount / this.fpsTimeout) * 1000)
      this.fpsTimeout = 0
      this.frameCount = 0
    }
    this.fpsTimeout += delta
    this.frameCount++
  }

  render(): void {
    // Clear previous frame
    this.context.fillStyle = '#529148'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Display fps
    this.context.fillStyle = 'black'
    this.context.font = '18px Roboto'
    this.context.fillText(
      `Fps: ${this.fps}; x: ${Math.round(this.player.x)}; y: ${Math.round(this.player.y)}`,
      this.canvas.width - 200,
      50
    )

    this.player.render()
  }

  onResize(): void {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }
}
