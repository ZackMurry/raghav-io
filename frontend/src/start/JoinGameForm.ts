export default class JoinGameForm {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  isVisible = true
  formElement: HTMLFormElement
  onJoinGame: (username: string, gameId: string) => void = () => undefined

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    this.formElement = document.getElementById('join-game-form') as HTMLFormElement
    this.formElement.onsubmit = e => this.onEnterGame(e)
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

  onEnterGame(e: Event): void {
    e.preventDefault()
    const formData = new FormData(this.formElement)
    const username = formData.get('username') as string
    const gameId = formData.get('gameId') as string
    this.onJoinGame(username, gameId)
  }
}
