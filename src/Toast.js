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

  setStyle(attribute, value) {
    this.toast.style[attribute] = value
  }

  initStyle() {
    this.toast.style.display = 'none'
    this.toast.style.color = '#ffffff'
    this.toast.style.position = 'absolute'
    this.toast.style.zIndex = 3
    this.toast.style.top = '80%'
    this.toast.style.right = 0
    this.toast.style.bottom = 0
    this.toast.style.left = '50%'
    this.toast.style.transform = 'translateX(-50%)'
    this.toast.style.width = 'max-content'
    this.toast.style.height = 'max-content'
    this.toast.style.padding = '1rem 2rem'
    this.toast.style.background = '#2B2A33'
    this.toast.style.borderRadius = '10px'
  }

  init() {
    //get body to use it as a parent for the toast html span
    const body = document.querySelector('body')
    //init the default style
    this.initStyle()
    //append the toast html element already with styles to document's body
    body.append(this.toast)
  }
}

export default Toast