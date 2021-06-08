import { ERROR_MESSAGE_DISPLAY_TIME_MS } from './constants'

const portal = document.getElementById('error-msg-portal') as HTMLDivElement
const showErrorMessage = (msg: string): void => {
  const errorElement = document.createElement('div')
  errorElement.className = 'error-message'
  errorElement.innerHTML = `Error: ${msg}`
  portal.appendChild(errorElement)
  setTimeout(() => {
    portal.removeChild(errorElement)
  }, ERROR_MESSAGE_DISPLAY_TIME_MS)
}

export default showErrorMessage
