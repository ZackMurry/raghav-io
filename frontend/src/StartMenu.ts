import autoBind from 'auto-bind'

export default class StartMenu {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  isVisible = true
  menuElement: HTMLDivElement
  onJoinGame: (name: string, gameId: string) => void = () => undefined

  constructor(canvas: HTMLCanvasElement) {
    autoBind(this)
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    this.menuElement = document.getElementById('start-menu') as HTMLDivElement
    const formElement = document.getElementById('details-form') as HTMLFormElement
    formElement.onsubmit = this.onEnterGame
  }

  setVisibility(visibility: boolean): void {
    if (this.isVisible === visibility) {
      return
    }
    if (visibility) {
      this.menuElement.removeAttribute('style')
    } else {
      this.menuElement.setAttribute('style', 'visibility: hidden')
    }
    this.isVisible = visibility
  }

  onEnterGame(e: Event): void {
    e.preventDefault()
    const formData = new FormData(document.getElementById('details-form') as HTMLFormElement)
    const username = formData.get('username') as string
    const gameId = formData.get('gameId') as string
    this.onJoinGame(username, gameId)
  }
}
