import { MapSize } from '../types'

export default class CreateGameForm {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  isVisible = false
  formElement: HTMLFormElement
  onCreateGame: (username: string, mapSize: MapSize) => void = () => undefined

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    this.formElement = document.getElementById('create-game-form') as HTMLFormElement
    this.formElement.onsubmit = e => this.handleCreateGame(e)
  }

  setVisibility(visibility: boolean): void {
    if (this.isVisible === visibility) {
      return
    }
    if (visibility) {
      this.formElement.removeAttribute('style')
    } else {
      this.formElement.setAttribute('style', 'display: none')
    }
    this.isVisible = visibility
  }

  handleCreateGame(e: Event): void {
    e.preventDefault()
    const formData = new FormData(this.formElement)
    const username = formData.get('username') as string
    const mapSize = formData.get('mapSize') as MapSize
    this.onCreateGame(username, mapSize)
  }
}
