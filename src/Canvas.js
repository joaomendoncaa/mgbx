import CanvasFilters from './CanvasFilters'

class Canvas {
  constructor(image) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this._image = image
    this._filters = new CanvasFilters(this.ctx)

    this.__init__()
  }

  get image() { return this._image }

  get canvas() { return this._canvas }

  get ctx() { return this._ctx }

  get filters() { return this._filters }

  set canvas(canvas) { this._canvas = canvas }

  set ctx(ctx) { this._ctx = ctx }

  set filters(filters) { this._filters = filters }

  toDataURL() {
    return this.canvas.toDataURL()
  }

  setSize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }

  resetFilters() {
    this.filters.reset()
  }

  applyFiltersToCtx() {
    this.filters.applyFiltersOnCanvasContext()
  }

  __init__() {

  }
}

export default Canvas