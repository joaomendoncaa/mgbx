import HistorySingleton from './History'
import CanvasSingleton from './Canvas'
import HistoryButton from './HistoryButton'
import CanvasFiltersSingleton from './CanvasFilters'
import $ from './DomElements'
import Utils from './Utils'

import '../styles/History.scss'

const CanvasHistorySingleton = (() => {
  class CanvasHistory {
    constructor() {
      this._history = HistorySingleton.getInstance()
      this._canvas = CanvasSingleton.getInstance()

      this._historyListElement = $('.history_list')
      this._previousButtonElement = $('.history_controls_previous')
      this._nextButtonElement = $('.history_controls_next')

      this.previousButtonElement.addEventListener('click', () => { this.onClickPrevious() })
      this.nextButtonElement.addEventListener('click', () => { this.onClickNext() })

      this.renderHistoryButtonList()
    }

    get history() { return this._history }
    get canvas() { return this._canvas }
    get historyListElement() { return this._historyListElement }
    get previousButtonElement() { return this._previousButtonElement }
    get nextButtonElement() { return this._nextButtonElement }

    renderHistoryButtonList() {
      if (this.history.list.length === 0) return

      this.history.list.map(snapshotData => {
        new HistoryButton(this.historyListElement, (id) => { this.setCurrentSnapshot(id) }, snapshotData)
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

      const filters = CanvasFiltersSingleton.getInstance()

      this.history.pointer = snapshotId
      this.setActiveButton(snapshotId)

      const snapshotData = this.history.list[snapshotId]

      const isUnknownFilters = !snapshotData.filtersString || snapshotData.filtersString.length === 0

      if (snapshotData.isUpload === true) {
        this.canvas.putImage(snapshotData.canvasData.image, snapshotData.canvasData.width, snapshotData.canvasData.height)
      } else {
        this.canvas.changeImage(snapshotData.canvasData.image, snapshotData.canvasData.width, snapshotData.canvasData.height)
      }

      if (!isUnknownFilters) {
        filters.setFiltersMapFromSnapshotString(snapshotData.filtersString)
        filters.applyFiltersOnImagePreview()
      } else {

      }
    }

    addSnapshot({ action, canvasData, selectionData, filtersString, isUpload }) {
      const snapshotData = this.history.add({
        action,
        canvasData,
        selectionData,
        filtersString,
        isUpload
      })

      new HistoryButton(this.historyListElement, () => { this.setCurrentSnapshot(snapshotData.id) }, snapshotData)

      this.setCurrentSnapshot(snapshotData.id)
    }
  }//CanvasHistory

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