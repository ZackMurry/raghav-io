import { Client } from '@stomp/stompjs'
import autoBind from 'auto-bind'
import { v4 as generateUUID } from 'uuid'
import { PLAYER_MOVE_SPEED, PLAYER_RADIUS, POSITION_UPDATE_TIME } from './constants'

export default class Player {
  x = 0
  y = 0
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  keys: { [key: string]: boolean } = {}
  rotation = 90 // In degrees (because the server stores it as a short), starting from the right and moving counter-clockwise
  mouseX = 0
  mouseY = 0
  name: string
  ws: Client
  onShoot: (angle: number, bulletId: string) => void
  isAlive = true

  constructor(canvas: HTMLCanvasElement, ws: Client) {
    autoBind(this)
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    this.ws = ws
    this.name = `Zack ${Math.floor(Math.random() * 100)}`
    this.onShoot = () => undefined
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
    this.sendPositionToServer()
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
    this.rotation = Math.round(-(Math.atan2(this.mouseY, this.mouseX) * 180) / Math.PI)
    if (this.rotation < 0) {
      this.rotation += 360
    }
    // console.log(`x: ${this.mouseX > 0}; y: ${this.mouseY > 0}`)
    // console.log(this.rotation)
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
    this.context.fillRect(5, -5, 25, 10)
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

  onMouseDown(e: MouseEvent): void {
    const targetOffsetX = e.pageX - this.canvas.width / 2
    const targetOffsetY = e.pageY - this.canvas.height / 2
    let angle = Math.round(-(Math.atan2(targetOffsetY, targetOffsetX) * 180) / Math.PI)
    if (angle < 0) {
      angle += 360
    }
    const id = generateUUID()
    this.onShoot(angle, id)
    this.sendShotToServer(angle, id)
  }

  sendPositionToServer(): void {
    if (this.ws.connected && this.isAlive) {
      this.ws.publish({
        destination: '/app/position',
        body: JSON.stringify({
          name: this.name,
          position: {
            x: Math.round(this.x),
            y: Math.round(this.y)
          },
          rotation: this.rotation
        })
      })
    }
    setTimeout(this.sendPositionToServer, POSITION_UPDATE_TIME)
  }

  sendShotToServer(angle: number, id: string): void {
    if (this.ws.connected) {
      console.log('Sending shot')
      this.ws.publish({
        destination: '/app/fire',
        body: JSON.stringify({
          name: this.name,
          origin: {
            x: Math.round(this.x),
            y: Math.round(this.y)
          },
          angle,
          time: new Date().getTime(),
          id
        })
      })
    }
  }
}
