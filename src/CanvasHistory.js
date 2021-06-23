import History from './History'
import HistoryButton from './HistoryButton'
import $ from './DomElements'
import Utils from './Utils'

import '../styles/History.scss'

class CanvasHistory {
  constructor(parentDomElement, previousButtonElement, nextButtonElement, canvas, image) {
    this._parentDomElement = parentDomElement
    this._previousButtonElement = previousButtonElement
    this._nextButtonElement = nextButtonElement
    this._canvas = canvas
    this._image = image
    this._history = new History()

    this.__init__()
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

    console.log('data to be displayed', snapshotData)

    if (snapshotData.isUpload === true) return this.canvas.putImage(snapshotData.canvasData.image, snapshotData.canvasData.width, snapshotData.canvasData.height)
    this.canvas.changeImage(snapshotData.canvasData.image, snapshotData.canvasData.width, snapshotData.canvasData.height)
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

    this.history.pointer = 1
    this.setCurrentSnapshot(1)

    this.previousButtonElement.addEventListener('click', () => { this.onClickPrevious() })
    this.nextButtonElement.addEventListener('click', () => { this.onClickNext() })
  }
}

export default CanvasHistory