class HistorySnapshot {
  constructor(id, action, canvasData, selectionData, filtersData, timestamp) {
    this._id = id
    this._action = action
    this._canvasData = canvasData
    this._selectionData = selectionData
    this._filtersData = filtersData
    this._timestamp = timestamp
  }

  get id() { return this._id }
  get action() { return this._action }
  get canvasData() { return this._canvasData }
  get selectionData() { return this._selectionData }
  get filtersData() { return this._filtersData }
  get timestamp() { return this._timestamp }
}

export default HistorySnapshot