class CanvasFilters {
  constructor(canvasContext) {
    this._filters = {

    }
    this._context = canvasContext
  }

  get filters() {
    return this._filters
  }

  get context() {
    return this._context
  }
}

export default CanvasFilters