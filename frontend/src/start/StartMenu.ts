import autoBind from 'auto-bind'
import { MapSize } from '../types'
import CreateGameForm from './CreateGameForm'
import JoinGameForm from './JoinGameForm'

export default class StartMenu {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  isVisible = true
  menuElement: HTMLDivElement
  state: 'join' | 'create' = 'join'
  joinGameForm: JoinGameForm
  createGameForm: CreateGameForm
  switchScreenButton: HTMLButtonElement

  constructor(canvas: HTMLCanvasElement) {
    autoBind(this)
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    this.menuElement = document.getElementById('start-menu') as HTMLDivElement
    this.joinGameForm = new JoinGameForm(canvas)
    this.createGameForm = new CreateGameForm(canvas)
    this.switchScreenButton = document.getElementById('switch-screen-btn') as HTMLButtonElement
    this.switchScreenButton.onclick = this.showCreateGameScreen
  }

  setVisibility(visibility: boolean): void {
    if (this.isVisible === visibility) {
      return
    }
    if (visibility) {
      this.menuElement.removeAttribute('style')
    } else {
      this.menuElement.setAttribute('style', 'display: none')
    }
    this.isVisible = visibility
  }

  showCreateGameScreen(): void {
    console.log('create')
    if (this.state === 'create') {
      return
    }
    this.state = 'create'
    this.joinGameForm.setVisibility(false)
    this.createGameForm.setVisibility(true)
    this.switchScreenButton.innerText = 'join a game'
    this.switchScreenButton.onclick = this.showJoinGameScreen
  }

  showJoinGameScreen(): void {
    if (this.state === 'join') {
      return
    }
    this.state = 'join'
    this.joinGameForm.setVisibility(true)
    this.createGameForm.setVisibility(false)
    this.switchScreenButton.innerText = 'create a game'
    this.switchScreenButton.onclick = this.showCreateGameScreen
  }
}
