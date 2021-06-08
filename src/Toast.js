class Toast {
  constructor() {
    this._toast = document.createElement('span')
    this._queue = []
    this._isQueueBeingDispatched = false
    this.init()
  }

  get toast() {
    return this._toast
  }

  get queue() {
    return this._queue
  }

  get isQueueBeingDispatched() {
    return this._isQueueBeingDispatched
  }

  set isQueueBeingDispatched(isQueueBeingDispatched) {
    this._isQueueBeingDispatched = isQueueBeingDispatched
  }

  shiftQueue() {
    this._queue.shift()
  }

  popQueue() {
    this._queue.pop()
  }

  async displayOneMessage() {
    return new Promise((resolve, reject) => {
      if (this.queue.length === 0) {
        this.isQueueBeingDispatched = false
        reject(false)
      }

      this.isQueueBeingDispatched = true

      const { message, duration } = this.queue[this.queue.length - 1]

      this.toast.style.display = 'initial'
      this.toast.textContent = message

      setTimeout(() => {
        this.toast.style.display = 'none'
        this.toast.textContent = ''
        this.popQueue()
        resolve(true)
      }, duration)
    })
  }

  async _displayMessages() {
    const hasDisplayedMessage = await this.displayOneMessage()
    if (hasDisplayedMessage) this._displayMessages()
  }

  putMessage(messageString, messageDuration) {
    const newMessage = {
      message: messageString,
      duration: messageDuration
    }

    this.queue.push(newMessage)

    if (this.isQueueBeingDispatched) return

    this._displayMessages()
  }

  setStyle(styleMap) {
    const styleAttributes = Object.keys(styleMap)
    styleAttributes.forEach(attribute => {
      this.toast.style[attribute] = styleMap[attribute]
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