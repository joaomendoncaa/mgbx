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

  get areQueuesBeingDispatched() {
    return this._areQueuesBeingDispatched
  }

  set areQueuesBeingDispatched(isQueueBeingDispatched) {
    this._areQueuesBeingDispatched = isQueueBeingDispatched
  }

  _getFirstItemInQueue(queuePriority) {
    switch (queuePriority) {
      case 'high':
        return this.highPriorityQueue[this.highPriorityQueue.length - 1]
      case 'normal':
        return this.normalPriorityQueue[this.normalPriorityQueue.length - 1]
      case 'low':
        return this.lowPriorityQueue[this.lowPriorityQueue.length - 1]
    }
  }

  _removeFirstItemInQueue(queuePriority) {
    switch (queuePriority) {
      case 'high':
        this._highPriorityQueue.shift()
        break
      case 'normal':
        this._normalPriorityQueue.shift()
        break
      case 'low':
        this._lowPriorityQueue.shift()
        break
    }
  }

  async _displayOneMessageByPriority(messagePriority) {
    return new Promise((resolve, reject) => {
      this.areQueuesBeingDispatched = true

      const { message, duration } = this._getFirstItemInQueue(messagePriority)

      if (!message) reject(null)

      console.log(`⚠️ Will display ${messagePriority} priority message.`, {
        message,
        duration
      })

      this.toast.style.display = 'initial'
      this.toast.textContent = message

      setTimeout(() => {
        this.toast.style.display = 'none'
        this.toast.textContent = ''
        this._removeFirstItemInQueue(messagePriority)
        resolve(true)
        return
      }, duration)
    })
  }

  async _displayAllMessages() {
    const hasHighPriorityMessages = this.highPriorityQueue.length !== 0 ? true : false
    const hasNormalPriorityMessages = this.normalPriorityQueue.length !== 0 ? true : false
    const hasLowPriorityMessages = this.lowPriorityQueue.length !== 0 ? true : false

    if (!hasHighPriorityMessages && !hasNormalPriorityMessages && !hasLowPriorityMessages) {
      this.areQueuesBeingDispatched = false
      return
    }

    if (hasHighPriorityMessages) {
      const hasDisplayedMessage = await this._displayOneMessageByPriority('high')
      if (hasDisplayedMessage) return this._displayAllMessages()
      throw new Error('Error trying to display high priority message')
    }

    if (hasNormalPriorityMessages) {
      const hasDisplayedMessage = await this._displayOneMessageByPriority('normal')
      if (hasDisplayedMessage) return this._displayAllMessages()
      throw new Error('Error trying to display normal priority message')
    }

    if (hasLowPriorityMessages) {
      const hasDisplayedMessage = await this._displayOneMessageByPriority('low')
      if (hasDisplayedMessage) return this._displayAllMessages()
      throw new Error('Error trying to display low priority message')
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

    if (this.areQueuesBeingDispatched) return

    this._displayAllMessages()
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
