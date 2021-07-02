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

    updateHistoryButtonListStyle(currentSnapshotID) {
      if ($('.history_button') === null) return

      $(`.history_button`, true).forEach(node => {
        node.classList.remove('history_button_active')
        node.classList.add('history_button_inactive')
      })

      $(`.history_button[data-snapshot-id="${currentSnapshotID}"]`).classList.remove('history_button_inactive')
      $(`.history_button[data-snapshot-id="${currentSnapshotID}"]`).classList.add('history_button_active')
    }

    disablePreviousButton() {
      this.previousButtonElement.classList.remove('history_header_button_active')
      this.previousButtonElement.classList.add('history_header_button_disabled')
    }

    disableNextButton() {
      this.nextButtonElement.classList.remove('history_header_button_active')
      this.nextButtonElement.classList.add('history_header_button_disabled')
    }

    enablePreviousButton() {
      this.previousButtonElement.classList.remove('history_header_button_disabled')
      this.previousButtonElement.classList.add('history_header_button_active')
    }

    enableNextButton() {
      this.nextButtonElement.classList.remove('history_header_button_disabled')
      this.nextButtonElement.classList.add('history_header_button_active')
    }

    updateHeaderButtonsStyle(pointer) {
      const isLastItem = pointer === Utils.arrayLastIndex(this.history.list)
      const isFirstItem = pointer === 0

      if (!isLastItem && !isFirstItem) {
        this.enablePreviousButton()
        this.enableNextButton()
        return
      }

      if (isLastItem && isFirstItem) {
        this.disablePreviousButton()
        this.disableNextButton()
        return
      }

      if (isLastItem && !isFirstItem) {
        this.enablePreviousButton()
        this.disableNextButton()
        return
      }

      if (!isLastItem && isFirstItem) {
        this.disablePreviousButton()
        this.enableNextButton()
        return
      }
    }

    setCurrentSnapshot(snapshotId) {
      if (this.history.list.length === 0) return

      const filters = CanvasFiltersSingleton.getInstance()

      this.history.pointer = snapshotId

      this.updateHeaderButtonsStyle(this.history.pointer)
      this.updateHistoryButtonListStyle(snapshotId)

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
        filters.reset()
        //TODO: Add to history that filters were reseted
      }

      filters.updateAllFilterButtons()
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