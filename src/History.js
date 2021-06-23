import HistorySnapshot from './HistorySnapshot'

class History {
  constructor() {
    this._history = []
    this._pointer = 0
  }

  get parentDomElement() { return this._parentDomElement }
  get history() { return this._history }
  get pointer() { return this._pointer }

  set history(history) { this._history = history }
  set pointer(pointer) { this._pointer = pointer }

  previous() {
    if (this.pointer === 0) return this.pointer

    this.pointer = this.pointer - 1

    return this.pointer
  }

  next() {
    if (this.pointer === (this.history.length - 1)) return this.pointer

    this.pointer = this.pointer + 1

    return this.pointer
  }

  add({ action, canvasData, selectionData, filtersString, isUpload }) {
    const snapshot = new HistorySnapshot(
      this.history.length,
      action,
      canvasData,
      selectionData,
      filtersString,
      Date.now(),
      isUpload
    )

    this.history = [...this.history, snapshot]

    return snapshot
  }
}

export default History