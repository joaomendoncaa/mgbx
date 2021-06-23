import CanvasFilters from './CanvasFilters'
import $ from './DomElements'

class Canvas {
  constructor(image) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this._image = image
    this._filters = new CanvasFilters(this.ctx)
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

  putImage(image, width, height) {
    this.image.width = width
    this.image.height = height
    this.setSize(width, height)

    this.ctx.drawImage(image, 0, 0)

    $('.image_preview').src = this.canvas.toDataURL()
  }

  changeImage(image, width, height) {
    this.image.width = width
    this.image.height = height
    this.setSize(width, height)

    this.ctx.putImageData(image, 0, 0)

    $('.image_preview').src = this.canvas.toDataURL()
  }
}

export default Canvas