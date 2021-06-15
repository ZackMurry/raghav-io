import autoBind from 'auto-bind'
import { Client, IMessage } from '@stomp/stompjs'
import Body from './Body'
import Player from './Player'
import {
  BulletMessage,
  DeathMessage,
  GameEntity,
  GameJoinMessage,
  GameState,
  IAmMessage,
  MapSize,
  PlayerPositionInformation
} from './types'
import Bullet from './Bullet'
import FadingCanvasMask from './FadingCanvasMask'
import SmallMap from './map/SmallMap'
import StartMenu from './start/StartMenu'
import showErrorMessage from './showErrorMessage'
import GameMap from './map/GameMap'

// todo fix "You died screen" (it doesn't show up rn)
// todo only load players within a certain radius of the player to avoid cheating by zooming out
// todo add teams (show teams by using player color)
export default class Game {
  state: GameState
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  lastFrame = 0
  fps = 0
  fpsTimeout = 0
  frameCount = 0
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  player: Player | undefined
  ws: Client
  players: { [id: string]: Body } = {}
  bullets: Bullet[] = []
  darkenMask: FadingCanvasMask
  map: GameMap
  startMenu: StartMenu
  gameId: string | null = null

  constructor() {
    autoBind(this)
    this.state = 'STARTING'
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
        showErrorMessage('Websocket connected')
      }
    })
    this.ws.activate()
    window.addEventListener('resize', this.onResize)
    this.map = new SmallMap(this.canvas)
    this.startMenu = new StartMenu(this.canvas)
    this.startMenu.joinGameForm.onJoinGame = this.onJoinGame
    this.startMenu.createGameForm.onCreateGame = (username, mapSize) => this.onCreateGame(username, mapSize)
    this.darkenMask = new FadingCanvasMask(0, 0, 0, 2500, 0.4, this.canvas)
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
    if (this.state === 'PLAYING' && this.player) {
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
    // todo show game id somewhere
    this.context.fillStyle = '#758f58'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.player) {
      this.map.render(this.player.x, this.player.y)
    }

    // Display fps
    this.context.fillStyle = 'white'
    this.context.font = '18px Roboto'
    if (this.player) {
      this.context.fillText(
        `Fps: ${this.fps}; x: ${Math.round(this.player.x)}; y: ${Math.round(this.player.y)}`,
        this.canvas.width - 200,
        50
      )
    }

    // Display game id
    if (this.gameId) {
      this.context.fillText(`Game id: ${this.gameId}`, 200, 50)
    }

    this.bullets.forEach(b => b.render())
    Object.values(this.players).forEach(b => b.render())

    if (this.state === 'PLAYING' && this.player) {
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
    if (!this.player) {
      showErrorMessage('Player is undefined')
      return
    }
    const parsed = JSON.parse(message.body) as BulletMessage
    if (parsed.playerId === this.player.id) {
      return
    }
    const bullet = new Bullet(
      parsed.origin.x,
      parsed.origin.y,
      parsed.angle,
      parsed.playerId,
      this.canvas,
      parsed.id,
      this.player,
      this.map,
      () => this.handleBulletCollision(parsed.id)
    )
    bullet.onHitPlayer = () => this.onPlayerDeath(bullet.id)
    this.bullets.push(bullet)
    setTimeout(() => {
      this.bullets = this.bullets.filter(b => b.id !== parsed.id)
    }, 5000)
  }

  onDeathMessage(message: IMessage): void {
    if (!this.player) {
      showErrorMessage('Player is undefined')
      return
    }
    const { playerId, bulletId } = JSON.parse(message.body) as DeathMessage
    console.log(`${playerId} died`)
    if (playerId === this.player.id) {
      return
    }
    this.bullets = this.bullets.filter(b => b.id !== bulletId)
    delete this.players[playerId]
  }

  onPlayerDeath(bulletId: string): void {
    if (!this.player) {
      showErrorMessage('Player is undefined')
      return
    }
    this.state = 'DEAD'
    this.player.isAlive = false
    this.bullets = this.bullets.filter(b => b.id !== bulletId)
    this.darkenMask.fadeIn()
    this.startMenu.setVisibility(true)
    this.players = {}
    if (this.ws.connected) {
      this.ws.publish({
        destination: `/app/games/${this.gameId}/death`,
        body: JSON.stringify({
          playerId: this.player.id,
          bulletId
        })
      })
    }
  }

  handleBulletCollision(bulletId: string): void {
    this.bullets = this.bullets.filter(b => b.id !== bulletId)
  }

  onGameJoinMessage(message: IMessage): void {
    if (!this.player) {
      showErrorMessage('Player is undefined')
      return
    }
    const { id, name } = JSON.parse(message.body) as GameJoinMessage
    console.log(name, ' joined the game')
    if (id === this.player.id) {
      console.log('player joined game')
      this.player.onJoinedGame()
      return
    }
    this.players[id] = new Body(name, null, null, null, this.canvas, this.player)
    this.player.sendIAmMessage()
  }

  onIAmMessage(message: IMessage): void {
    if (!this.player) {
      showErrorMessage('Player is undefined')
      return
    }
    const { id, name, position, rotation } = JSON.parse(message.body) as IAmMessage
    if (id === this.player.id) {
      return
    }
    if (this.players[id]) {
      if (this.players[id].name === null) {
        this.players[id].name = name
      }
      return
    }
    this.players[id] = new Body(name, position.x, position.y, rotation, this.canvas, this.player)
  }

  subscribeToWSChannels(): void {
    if (!this.player) {
      showErrorMessage('Player is undefined')
      return
    }
    if (!this.ws.connected) {
      showErrorMessage('Websocket is not connected')
      return
    }
    this.ws.subscribe(`/topic/games/${this.gameId}/positions`, message => {
      if (!this.player) {
        showErrorMessage('Player is undefined')
        return
      }
      const parsed = JSON.parse(message.body) as PlayerPositionInformation
      if (parsed.playerId === this.player.id) {
        this.player.onPositionMessage(parsed)
        return
      }
      console.log('setting position for ', parsed.playerId)
      if (this.players[parsed.playerId]) {
        this.players[parsed.playerId].setPosition(parsed.position.x, parsed.position.y, parsed.rotation)
      } else {
        this.players[parsed.playerId] = new Body(
          null,
          parsed.position.x,
          parsed.position.y,
          parsed.rotation,
          this.canvas,
          this.player
        )
      }
    })
    this.ws.subscribe(`/topic/games/${this.gameId}/bullets`, this.onBulletMessage)
    this.ws.subscribe(`/topic/games/${this.gameId}/deaths`, this.onDeathMessage)
    this.ws.subscribe(`/topic/games/${this.gameId}/joins`, this.onGameJoinMessage)
    this.ws.subscribe(`/topic/games/${this.gameId}/iams`, this.onIAmMessage)
    setTimeout(() => {
      this.ws.unsubscribe(`/topic/games/${this.gameId}/iams`)
    }, 10000)
  }

  async onJoinGame(username: string, gameId: string): Promise<void> {
    const response = await fetch(`/api/v1/games/id/${gameId}`)
    if (!response.ok) {
      if (response.status === 404) {
        showErrorMessage('Game not found')
      } else {
        showErrorMessage(`Error joining game. Response status: ${response.status}`)
      }
      return
    }
    // todo: when map sizes are implemented, a map size variable will need to be set here based on the map size returned

    this.player = new Player(username, this.canvas, this.ws, this.map)
    this.player.onShoot = (angle, bulletId) => {
      if (!this.player) {
        showErrorMessage('Player is undefined')
        return
      }
      const bullet = new Bullet(
        this.player.x,
        this.player.y,
        angle,
        this.player.id,
        this.canvas,
        bulletId,
        this.player,
        this.map,
        () => this.handleBulletCollision(bulletId)
      )
      bullet.onHitPlayer = () => this.onPlayerDeath(bulletId)
      this.bullets.push(bullet)
      setTimeout(() => {
        this.bullets = this.bullets.filter(b => b.id !== bulletId)
      }, 5000)
    }
    this.player.name = username
    this.player.x = 0
    this.player.y = 0
    this.player.isAlive = true
    this.gameId = gameId
    this.state = 'PLAYING'
    this.startMenu.setVisibility(false)
    this.darkenMask.fadeDir = -1
    this.subscribeToWSChannels()
    this.player.joinGame(this.gameId)
    this.player.isAlive = true
  }

  async onCreateGame(username: string, mapSize: MapSize): Promise<void> {
    console.log(username, mapSize)
    const response = await fetch('/api/v1/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mapSize
      })
    })
    if (!response.ok) {
      console.error(`Error creating game. Response status: ${response.status}`)
      return
    }
    const { id } = (await response.json()) as GameEntity
    console.log(id)
    this.onJoinGame(username, id)
  }
}
