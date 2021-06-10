import './Toast.scss'

class Toast {
  constructor() {
    this._toast = null
    this._toastTextHeading = null
    this._toastTimeBar = null
    this._defaultStyle = {}
    this._highPriorityQueue = []
    this._normalPriorityQueue = []
    this._lowPriorityQueue = []
    this._areQueuesBeingDispatched = false
    this.__init__()
  }

  get toast() {
    return this._toast
  }

  get toastTimeBar() {
    return this._toastTimeBar
  }

  get toastTextHeading() {
    return this._toastTextHeading
  }

  get highPriorityQueue() {
    return this._highPriorityQueue
  }

  get normalPriorityQueue() {
    return this._normalPriorityQueue
  }

  get lowPriorityQueue() {
    return this._lowPriorityQueue
  }

  get areQueuesBeingDispatched() {
    return this._areQueuesBeingDispatched
  }

  set toast(htmlElement) {
    this._toast = htmlElement
  }

  set toastTimeBar(htmlElement) {
    this._toastTimeBar = htmlElement
  }

  set toastTextHeading(htmlElement) {
    this._toastTextHeading = htmlElement
  }

  set areQueuesBeingDispatched(isQueueBeingDispatched) {
    this._areQueuesBeingDispatched = isQueueBeingDispatched
  }

  _generateToastClass() {
    const toastClass = this._generateRandomClassPrefix(10) + '_toast'
    return toastClass
  }

  _generateToastTimeBarClass() {
    const toastTimeBarClass = this._generateRandomClassPrefix(10) + '_toast_timebar'
    return toastTimeBarClass
  }

  _generateRandomClassPrefix(prefixLength) {
    let finalClassPrefix = ''

    const letters = ['t', 'T', 'o', 'O', 'a', 'A', 's', 'S', 't', 'T', 'j', 'J', 's', 'S']

    for (let i = 0; i < prefixLength; i++) {
      const randomIndex = Math.floor(Math.random() * 10)
      finalClassPrefix += letters[randomIndex]
    }

    return finalClassPrefix
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

      this.toast.style.display = 'initial'
      this.toastTextHeading.textContent = message

      this.toastTimeBar.style.display = 'flex'
      this.toastTimeBar.style.animation = `shrink ${duration}ms forwards`

      setTimeout(() => {
        this.toast.style.display = 'none'
        this.toastTextHeading.textContent = ''

        this.toastTimeBar.style.animation = `none`
        this.toastTimeBar.style.display = 'none'

        this._removeFirstItemInQueue(messagePriority)
        resolve(true)
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
        this._highPriorityQueue.unshift(newMessage)
        break
      case 'normal':
        this._normalPriorityQueue.unshift(newMessage)
        break
      case 'low':
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

  __init__() {
    //get body to use it as a parent for the toast html span
    const body = document.querySelector('body')

    const toastClass = this._generateToastClass()
    const toastTimeBarClass = this._generateToastTimeBarClass()

    body.insertAdjacentHTML('beforeend', /*HTML*/`
      <div style="
        pointer-events: none;
        width: 100vw;
        height: 100vh;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        <span class="${toastClass}">
          <p></p>
          <span class="${toastTimeBarClass}"></span>
        </span>
      </div>
    `)

    this.toast = document.querySelector(`.${toastClass}`)
    this.toastTimeBar = document.querySelector(`.${toastTimeBarClass}`)
    this.toastTextHeading = document.querySelector(`.${toastClass} > p`)

    this.setStyle({
      overflow: 'hidden',
      pointerEvents: 'none',
      display: 'none',
      color: '#ffffff',
      position: 'relative',
      transform: 'translateY(calc(50vh - 250%))',
      width: 'max-content',
      height: 'max-content',
      padding: '1rem 2rem',
      background: '#2B2A33',
      borderRadius: '5px',
      toastTimeBar: {
        display: 'none',
        width: '100%',
        pointerEvents: 'none',
        height: '2.5px',
        background: '#fff',
        position: 'absolute',
        left: 0,
        bottom: 0,
      }
    })
  }
}

export default Toast
