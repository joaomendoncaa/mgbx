class Toast {
  constructor() {
    this._toast = document.createElement('span')
    this._toastTimeBar = document.createElement('span')
    this._highPriorityQueue = []
    this._normalPriorityQueue = []
    this._lowPriorityQueue = []
    this._areQueuesBeingDispatched = false
    this.init()
  }

  get toast() { return this._toast }

  get toastTimeBar() { return this._toastTimeBar }

  get highPriorityQueue() { return this._highPriorityQueue }

  get normalPriorityQueue() { return this._normalPriorityQueue }

  get lowPriorityQueue() { return this._lowPriorityQueue }

  get areQueueBeingDispatched() {
    return this._areQueuesBeingDispatched
  }

  set areQueueBeingDispatched(isQueueBeingDispatched) {
    this._areQueuesBeingDispatched = isQueueBeingDispatched
  }

  async displayOneMessage() {
    return new Promise((resolve, reject) => {
      const hasHighPriorityMessages = this.highPriorityQueue.length !== 0 ? true : false
      const hasNormalPriorityMessages = this.normalPriorityQueue.length !== 0 ? true : false
      const hasLowPriorityMessages = this.lowPriorityQueue.length !== 0 ? true : false

      console.log({
        hasHighPriorityMessages,
        hasNormalPriorityMessages,
        hasLowPriorityMessages
      })

      if (!hasHighPriorityMessages && !hasNormalPriorityMessages && !hasLowPriorityMessages) {
        this.isQueueBeingDispatched = false
        reject(false)
      }

      this.isQueueBeingDispatched = true

      if (hasHighPriorityMessages) {
        const { message, duration } = this.highPriorityQueue[this.highPriorityQueue.length - 1]

        this.toast.style.display = 'initial'
        this.toast.textContent = message

        setTimeout(() => {
          this.toast.style.display = 'none'
          this.toast.textContent = ''
          this._highPriorityQueue.shift()
          resolve(true)
          return
        }, duration)
      } else if (hasNormalPriorityMessages) {
        const { message, duration } = this.normalPriorityQueue[this.normalPriorityQueue.length - 1]

        this.toast.style.display = 'initial'
        this.toast.textContent = message

        setTimeout(() => {
          this.toast.style.display = 'none'
          this.toast.textContent = ''
          this._normalPriorityQueue.shift()
          resolve(true)
          return
        }, duration)
      } else if (hasLowPriorityMessages) {
        const { message, duration } = this.lowPriorityQueue[this.lowPriorityQueue.length - 1]

        this.toast.style.display = 'initial'
        this.toast.textContent = message

        setTimeout(() => {
          this.toast.style.display = 'none'
          this.toast.textContent = ''
          this._lowPriorityQueue.shift()
          resolve(true)
          return
        }, duration)
      }
    })
  }

  async _displayMessages() {
    try {
      const hasDisplayedMessage = await this.displayOneMessage()
      if (hasDisplayedMessage) this._displayMessages()
    } catch (error) {
      console.log(error)
    }
  }

  putMessage(messageString, messageDuration, messagePriority) {
    const newMessage = {
      message: messageString,
      duration: messageDuration
    }

    switch (messagePriority) {
      case 'high':
        console.log('Added high priority message')
        this._highPriorityQueue.unshift(newMessage)
        break
      case 'normal':
        console.log('Added normal priority message')
        this._normalPriorityQueue.unshift(newMessage)
        break
      case 'low':
        console.log('Added low priority message')
        this._lowPriorityQueue.unshift(newMessage)
        break
    }

    if (this.areQueueBeingDispatched) return

    this._displayMessages()
  }

  _setToastTimeBarStyle(styleMap) {
    const styleAttributes = Object.keys(styleMap)
    styleAttributes.forEach(attribute => {
      this.toastTimeBar.style[attribute] = styleMap[attribute]
    })
  }

  setStyle(styleMap) {
    const styleAttributes = Object.keys(styleMap)
    styleAttributes.forEach(attribute => {
      if (attribute === 'toastTimeBar') {
        this._setToastTimeBarStyle(styleMap[attribute])
      } else {
        this.toast.style[attribute] = styleMap[attribute]
      }
    })
  }

  init() {
    //get body to use it as a parent for the toast html span
    const body = document.querySelector('body')
    //set the default style
    this.setStyle({
      overflow: 'hidden',
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
      toastTimeBar: {
        width: '100%',
        height: '3px',
        background: '#fff'
      }
    })
    //append the toast html element to document's body
    body.append(this.toast)
    this.toast.append(this.toastTimeBar)
  }
}

export default Toast
