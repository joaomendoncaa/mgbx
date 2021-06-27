import HistorySnapshot from './HistorySnapshot'
import Utils from './Utils'

const HistorySingleton = (() => {
  class History {
    constructor() {
      this._list = []
      this._pointer = 0
    }

    get list() { return this._list }
    get pointer() { return this._pointer }

    set list(list) { this._list = list }
    set pointer(pointer) { this._pointer = pointer }

    previous() {
      if (this.pointer === 0) return this.pointer

      this.pointer = this.pointer - 1

      return this.pointer
    }

    next() {
      if (this.pointer === (this.list.length - 1)) return this.pointer

      this.pointer = this.pointer + 1

      return this.pointer
    }

    add({ action, canvasData, selectionData, filtersString, isUpload }) {
      const snapshot = new HistorySnapshot(
        (Utils.arrayLastIndex(this.list) + 1),
        action,
        canvasData,
        selectionData,
        filtersString,
        Date.now(),
        isUpload
      )

      this.list = [...this.list, snapshot]

      return snapshot
    }
  }

  let historyInstance

  function createHistory() {
    historyInstance = new History()
    return historyInstance
  }

  return {
    getInstance: () => {
      if (!historyInstance) historyInstance = createHistory()
      return historyInstance
    }
  }
})()


export default HistorySingleton