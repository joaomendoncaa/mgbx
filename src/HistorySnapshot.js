class HistorySnapshot {
  constructor(id, action, canvasData, selectionData, filtersString, timestamp, isUpload) {
    this._id = id
    this._action = action
    this._canvasData = canvasData
    this._selectionData = selectionData
    this._filtersString = filtersString
    this._timestamp = timestamp
    this._isUpload = isUpload
  }

  get id() { return this._id }
  get action() { return this._action }
  get canvasData() { return this._canvasData }
  get selectionData() { return this._selectionData }
  get filtersString() { return this._filtersString }
  get timestamp() { return this._timestamp }
  get isUpload() { return this._isUpload }
}

export default HistorySnapshot