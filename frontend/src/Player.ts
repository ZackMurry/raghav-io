import autoBind from 'auto-bind'

const PLAYER_MOVE_SPEED = 0.005
const PLAYER_RADIUS = 15

export default class Player {
  x = 0
  y = 0
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  keys: { [key: string]: boolean } = {}
  rotation = 90 // In degrees (because the server stores it as a short), starting from the right and moving counter-clockwise
  mouseX = 0
  mouseY = 0

  constructor(canvas: HTMLCanvasElement) {
    autoBind(this)
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('mousemove', this.onMouseMove)
  }

  update(delta: number): void {
    let actualPlayerMoveSpeed = PLAYER_MOVE_SPEED * delta
    if ((this.keys.w || this.keys.s) && (this.keys.a || this.keys.d)) {
      actualPlayerMoveSpeed /= Math.SQRT2
    }
    if (this.keys.w) {
      this.y += actualPlayerMoveSpeed
    } else if (this.keys.s) {
      this.y -= actualPlayerMoveSpeed
    }

    if (this.keys.d) {
      this.x += actualPlayerMoveSpeed
    } else if (this.keys.a) {
      this.x -= actualPlayerMoveSpeed
    }
    this.rotation = -(Math.atan(this.mouseY / this.mouseX) * 180) / Math.PI
    if ((this.mouseX < 0 && this.mouseY > 0) || (this.mouseX < 0 && this.mouseY < 0)) {
      // console.log(`flipping rotation; x: ${this.mouseX > 0}; y: ${this.mouseY > 0}`)
      this.rotation += 180
    }
    console.log(`x: ${this.mouseX > 0}; y: ${this.mouseY > 0}`)
    console.log(this.rotation)
  }

  render(): void {
    this.context.fillStyle = '#4a4e54'
    this.context.beginPath()
    this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, PLAYER_RADIUS, PLAYER_RADIUS, 0, 0, 2 * Math.PI)
    this.context.fill()

    this.context.save()
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2)
    this.context.rotate((-this.rotation * Math.PI) / 180)
    this.context.fillStyle = 'black'
    this.context.fillRect(0, -5, 25, 10)
    this.context.restore()
  }

  onKeyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true
  }

  onKeyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false
  }

  onMouseMove(e: MouseEvent): void {
    this.mouseX = e.pageX - this.canvas.width / 2
    this.mouseY = e.pageY - this.canvas.height / 2
  }
}
