import autoBind from 'auto-bind'
import { Client, IMessage } from '@stomp/stompjs'
import Body from './Body'
import Player from './Player'
import { BulletMessage, DeathMessage, GameState, PlayerPositionInformation } from './types'
import Bullet from './Bullet'
import FadingCanvasMask from './FadingCanvasMask'
import DefaultMap from './map/DefaultMap'

export default class Game {
  state: GameState
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  lastFrame = 0
  fps = 0
  fpsTimeout = 0
  frameCount = 0
  player: Player
  ws: Client
  players: { [name: string]: Body } = {}
  bullets: Bullet[] = []
  darkenMask: FadingCanvasMask
  map: DefaultMap

  constructor() {
    autoBind(this)
    this.state = 'PLAYING'
    this.canvas = document.getElementById('game') as HTMLCanvasElement
    if (!this.canvas) {
      throw new Error('Canvas not found')
    }
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    if (!this.context) {
      throw new Error('Canvas 2D context not found')
    }
    this.ws = new Client()
    this.ws.configure({
      brokerURL: 'ws://localhost/api/v1/websocket',
      onConnect: () => {
        this.ws.subscribe('/topic/positions', message => {
          const parsed = JSON.parse(message.body) as PlayerPositionInformation
          if (parsed.name === this.player.name) {
            return
          }
          // console.log(`received position of ${parsed.name}`)
          if (this.players[parsed.name]) {
            this.players[parsed.name].setPosition(parsed.position.x, parsed.position.y, parsed.rotation)
          } else {
            this.players[parsed.name] = new Body(
              parsed.name,
              parsed.position.x,
              parsed.position.y,
              parsed.rotation,
              this.canvas,
              this.player
            )
          }
        })
        this.ws.subscribe('/topic/bullets', this.onBulletMessage)
        this.ws.subscribe('/topic/deaths', this.onDeathMessage)
      }
    })
    this.ws.activate()
    if (!this.ws.connected) {
      console.log('WS is not connected!')
    }
    this.map = new DefaultMap(this.canvas)
    this.player = new Player(this.canvas, this.ws, this.map)
    this.player.onShoot = (angle, bulletId) => {
      const bullet = new Bullet(this.player.x, this.player.y, angle, this.player.name, this.canvas, bulletId, this.player)
      bullet.onHitPlayer = () => this.onPlayerDeath(bulletId)
      this.bullets.push(bullet)
      setTimeout(() => {
        this.bullets = this.bullets.filter(b => b.id !== bulletId)
      }, 5000)
    }
    window.addEventListener('resize', this.onResize)
    this.onResize()
    this.darkenMask = new FadingCanvasMask(0, 0, 0, 2500, 0.4, this.canvas)
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
    if (this.state === 'PLAYING') {
      this.player.update(delta)
    }
    this.bullets.forEach(b => b.update(delta))
    this.darkenMask.update(delta)
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

    this.map.render(this.player.x, this.player.y)

    // Display fps
    this.context.fillStyle = 'black'
    this.context.font = '18px Roboto'
    this.context.fillText(
      `Fps: ${this.fps}; x: ${Math.round(this.player.x)}; y: ${Math.round(this.player.y)}`,
      this.canvas.width - 200,
      50
    )
    Object.values(this.players).forEach(b => b.render())
    this.bullets.forEach(b => b.render())

    if (this.state === 'PLAYING') {
      this.player.render()
    } else {
      this.context.fillStyle = 'rgba(0, 0, 0, 0.5)'
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    this.darkenMask.render()
    if (this.state === 'DEAD' && this.darkenMask.isDoneFading()) {
      this.context.fillStyle = 'white'
      this.context.font = '36px Roboto'
      this.context.textAlign = 'center'
      this.context.fillText('You died!', this.canvas.width / 2, this.canvas.height / 2)
    }
  }

  onResize(): void {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  onBulletMessage(message: IMessage): void {
    const parsed = JSON.parse(message.body) as BulletMessage
    if (parsed.name === this.player.name) {
      return
    }
    const bullet = new Bullet(
      parsed.origin.x,
      parsed.origin.y,
      parsed.angle,
      parsed.name,
      this.canvas,
      parsed.id,
      this.player
    )
    bullet.onHitPlayer = () => this.onPlayerDeath(bullet.id)
    this.bullets.push(bullet)
    setTimeout(() => {
      this.bullets = this.bullets.filter(b => b.id !== parsed.id)
    }, 5000)
  }

  onDeathMessage(message: IMessage): void {
    const { name, bulletId } = JSON.parse(message.body) as DeathMessage
    if (name === this.player.name) {
      return
    }
    this.bullets = this.bullets.filter(b => b.id !== bulletId)
    delete this.players[name]
  }

  onPlayerDeath(bulletId: string): void {
    this.state = 'DEAD'
    this.player.isAlive = false
    this.bullets = this.bullets.filter(b => b.id !== bulletId)
    this.darkenMask.fadeIn()
    if (this.ws.connected) {
      this.ws.publish({
        destination: '/app/death',
        body: JSON.stringify({
          name: this.player.name,
          bulletId
        })
      })
    }
  }
}
