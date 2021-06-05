class Toast {
  constructor() {
    this._toast = document.createElement('span')
    this.init()
  }

  get toast() {
    return this._toast
  }

  displayMessage(messageString, messageDuration = 3000) {
    this.toast.textContent = messageString
    this.toast.style.display = 'flex'
    setTimeout(() => {
      this.toast.style.display = 'none'
    }, messageDuration)
  }

  setStyle(styleDictionary) {
    const styleAttributes = Object.keys(styleDictionary)
    styleAttributes.forEach(attribute => {
      this.toast.style[attribute] = styleDictionary[attribute]
    })
  }

  init() {
    //get body to use it as a parent for the toast html span
    const body = document.querySelector('body')
    //set the default style
    this.setStyle({
      display: 'none',
      color: '#ffffff',
      position: 'absolute',
      zIndex: 3,
      top: '80%',
      right: 0,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'max-content',
      height: 'max-content',
      padding: '1rem 2rem',
      background: '#2B2A33',
      borderRadius: '10px',
    })
    //append the toast html element to document's body
    body.append(this.toast)
  }
}

export default Toast