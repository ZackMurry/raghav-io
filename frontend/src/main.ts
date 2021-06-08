import Game from './Game'
import showErrorMessage from './showErrorMessage'
import './style.css'

window.onload = () => {
  try {
    // eslint-disable-next-line no-new
    new Game()
  } catch (e) {
    showErrorMessage(e.message)
  }
}
