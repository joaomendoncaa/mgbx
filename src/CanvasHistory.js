import History from './History'
import HistoryButton from './HistoryButton'
import $ from './DomElements'
import Utils from './Utils'

import '../styles/History.scss'

const CanvasHistorySingleton = (() => {
  class CanvasHistory {
    constructor() {
      this._parentDomElement = $('.history_list')
      this._previousButtonElement = $('.history_controls_previous')
      this._nextButtonElement = $('.history_controls_next')
      this._canvas = canvas
      this._image = image

      this.__init__()

      return this
    }
  }

  let canvasHistoryInstance

  function createCanvasHistory() {
    canvasHistoryInstance = new CanvasHistory()
    return canvasHistoryInstance
  }

  return {
    getInstance: () => {
      if (!canvasHistoryInstance) canvasHistoryInstance = createCanvasHistory()
      return canvasHistoryInstance
    }
  }
})()

export default CanvasHistorySingleton

class CanvasHistory {
  constructor(canvas, image) {
    if (!!CanvasHistory.instance) {
      return CanvasHistory.instance
    }
    CanvasHistory.instance = this

    this._parentDomElement = $('.history_list')
    this._previousButtonElement = $('.history_controls_previous')
    this._nextButtonElement = $('.history_controls_next')
    this._canvas = canvas
    this._image = image
    this._history = new History()

    this.__init__()

    return this
  }

  get parentDomElement() { return this._parentDomElement }
  get previousButtonElement() { return this._previousButtonElement }
  get nextButtonElement() { return this._nextButtonElement }
  get canvas() { return this._canvas }
  get image() { return this._image }
  get history() { return this._history }

  renderHistoryButtonList() {
    if (this.history.list.length === 0) return

    this.history.list.map(snapshotData => {
      new HistoryButton(this.parentDomElement, (id) => { this.setCurrentSnapshot(id) }, snapshotData)
    })
  }

  onClickPrevious() {
    if (this.history.pointer === 0) return

    const pointer = this.history.previous()
    this.setCurrentSnapshot(pointer)
  }

  onClickNext() {
    if (this.history.pointer === Utils.arrayLastIndex(this.history.list)) return

    const pointer = this.history.next()
    this.setCurrentSnapshot(pointer)
  }

  setActiveButton(snapshotId) {
    if ($('.history_button') === null) return

    $(`.history_button`, true).forEach(node => node.style.background = '#2B2A33')
    $(`.history_button[data-snapshot-id="${snapshotId}"]`).style.background = '#0485DC'
  }

  setCurrentSnapshot(snapshotId) {
    if (this.history.list.length === 0) return

    this.history.pointer = snapshotId
    this.setActiveButton(snapshotId)

    const snapshotData = this.history.list[snapshotId]

    if (snapshotData.isUpload === true) {
      this.canvas.putImage(snapshotData.canvasData.image, snapshotData.canvasData.width, snapshotData.canvasData.height)
      return
    }
    this.canvas.changeImage(snapshotData.canvasData.image, snapshotData.canvasData.width, snapshotData.canvasData.height)

    this.canvas.filters = snapshotData.filtersString
    this.canvas.applyFiltersToImagePreview()
  }

  addSnapshot({ action, canvasData, selectionData, filtersString, isUpload }) {
    const snapshotData = this.history.add({
      action,
      canvasData,
      selectionData,
      filtersString,
      isUpload
    })

    new HistoryButton(this.parentDomElement, () => { this.setCurrentSnapshot(snapshotData.id) }, snapshotData)

    this.setCurrentSnapshot(snapshotData.id)
  }

  __init__() {
    this.renderHistoryButtonList()

    this.previousButtonElement.addEventListener('click', () => { this.onClickPrevious() })
    this.nextButtonElement.addEventListener('click', () => { this.onClickNext() })
  }
}