import { Client } from '@stomp/stompjs'
import autoBind from 'auto-bind'
import { v4 as generateUUID } from 'uuid'
import {
  GUN_LENGTH,
  GUN_WIDTH,
  NAME_HEIGHT_ABOVE_PLAYER,
  OUTLINE_COLOR,
  PLAYER_MOVE_SPEED,
  PLAYER_RADIUS,
  POSITION_UPDATE_TIME
} from './constants'
import DefaultMap from './map/DefaultMap'

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
  map: DefaultMap
  id: string
  hasJoinedGame = false

  constructor(canvas: HTMLCanvasElement, ws: Client, map: DefaultMap) {
    autoBind(this)
    this.ws = ws
    this.id = generateUUID()
    this.name = `Zack ${Math.floor(Math.random() * 100)}`
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    this.map = map
    this.onShoot = () => undefined
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
  }

  update(delta: number): void {
    let actualPlayerMoveSpeed = PLAYER_MOVE_SPEED * delta
    if ((this.keys.w || this.keys.s) && (this.keys.a || this.keys.d)) {
      actualPlayerMoveSpeed /= Math.SQRT2
    }
    let newY = this.y
    if (this.keys.w) {
      newY += actualPlayerMoveSpeed
    } else if (this.keys.s) {
      newY -= actualPlayerMoveSpeed
    }

    let newX = this.x
    if (this.keys.d) {
      newX += actualPlayerMoveSpeed
    } else if (this.keys.a) {
      newX -= actualPlayerMoveSpeed
    }
    this.rotation = Math.round(-(Math.atan2(this.mouseY, this.mouseX) * 180) / Math.PI)
    if (this.rotation < 0) {
      this.rotation += 360
    }
    if (this.x !== newX && this.y !== newY) {
      if (this.map.canPlayerMoveToPosition(newX, newY)) {
        this.x = newX
        this.y = newY
      } else if (this.map.canPlayerMoveToPosition(this.x, newY)) {
        this.y = newY
      } else if (this.map.canPlayerMoveToPosition(newX, this.y)) {
        this.x = newX
      }
    } else if (this.x !== newX) {
      if (this.map.canPlayerMoveToPosition(newX, this.y)) {
        this.x = newX
      }
    } else if (this.y !== newY) {
      if (this.map.canPlayerMoveToPosition(this.x, newY)) {
        this.y = newY
      }
    }
    // console.log(`x: ${this.mouseX > 0}; y: ${this.mouseY > 0}`)
    // console.log(this.rotation)
  }

  render(): void {
    this.context.fillStyle = '#7d5d4f'
    this.context.strokeStyle = '#35354d'
    this.context.lineWidth = 10
    this.context.beginPath()
    this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, PLAYER_RADIUS, PLAYER_RADIUS, 0, 0, 2 * Math.PI)
    this.context.stroke()
    this.context.beginPath()
    this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, PLAYER_RADIUS, PLAYER_RADIUS, 0, 0, 2 * Math.PI)
    this.context.fill()

    this.context.save()
    this.context.font = 'bold 26px "Hammersmith One"'
    this.context.fillStyle = 'white'
    this.context.textAlign = 'center'
    this.context.lineWidth = 6
    this.context.strokeStyle = OUTLINE_COLOR
    this.context.shadowColor = OUTLINE_COLOR
    this.context.shadowBlur = 1
    this.context.strokeText(this.name, this.canvas.width / 2, this.canvas.height / 2 - NAME_HEIGHT_ABOVE_PLAYER)
    this.context.fillText(this.name, this.canvas.width / 2, this.canvas.height / 2 - NAME_HEIGHT_ABOVE_PLAYER)
    this.context.restore()

    this.context.save()
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2)
    this.context.rotate((-this.rotation * Math.PI) / 180)
    this.context.fillStyle = '#35354d'
    this.context.fillRect(GUN_WIDTH / 2, -GUN_WIDTH / 2, GUN_LENGTH, GUN_WIDTH)
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
    if (!this.isAlive || !this.hasJoinedGame) {
      return
    }
    // todo make bullet origin at end of gun
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
    if (this.ws.connected && this.isAlive && this.hasJoinedGame) {
      this.ws.publish({
        destination: '/app/position',
        body: JSON.stringify({
          playerId: this.id,
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
    if (this.ws.connected && this.hasJoinedGame) {
      console.log('Sending shot')
      this.ws.publish({
        destination: '/app/fire',
        body: JSON.stringify({
          playerId: this.id,
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

  joinGame(): void {
    if (this.ws.connected) {
      this.ws.publish({
        destination: '/app/games/join',
        body: JSON.stringify({
          id: this.id,
          name: this.name
        })
      })
    }
  }

  onJoinedGame(): void {
    this.hasJoinedGame = true
    this.sendPositionToServer()
  }

  sendIAmMessage(): void {
    if (this.ws.connected && this.hasJoinedGame) {
      this.ws.publish({
        destination: '/app/games/iam',
        body: JSON.stringify({
          id: this.id,
          name: this.name
        })
      })
    }
  }
}
