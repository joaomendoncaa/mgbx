import Filter from './Filter'
import DOM from './DomElements'

class Canvas {
  constructor(image) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this._image = image
    this._filters = {}

    this.__init__()
  }

  get image() {
    return this._image
  }

  get canvas() {
    return this._canvas
  }

  get ctx() {
    return this._ctx
  }

  get filters() {
    return this._filters
  }

  set canvas(canvas) {
    this._canvas = canvas
  }

  set ctx(ctx) {
    this._ctx = ctx
  }

  set filters(filters) {
    this._filters = filters
  }

  updateFilters(filterName, filterValue, filterUnit) {
    this.filters[filterName] = `${filterValue}${filterUnit}`

    let filterString = ''

    Object.keys(this.filters).map(filterName => {
      filterString += `${filterName}(${this.filters[filterName]}) `
    })

    this.injectFilterInImage(filterString)
  }

  injectFilterInImage(filterString) {
    DOM['image_preview'].style.filter = filterString
  }

  resetFilters() {
    this.filters.blur.reset()
    this.filters.brightness.reset()
    this.filters.contrast.reset()
    this.filters.grayscale.reset()
    this.filters.hueRotate.reset()
    this.filters.invert.reset()
    this.filters.opacity.reset()
    this.filters.saturate.reset()
    this.filters.sepia.reset()
  }

  __init__() {
    this.filters = {
      blur: new Filter(DOM['effects_list'], 'blur', 'px', 0, 20, 0, () => this.updateFilters()),
      brightness: new Filter(DOM['effects_list'], 'brightness', '%', 0, 200, 100, () => this.updateFilters()),
      contrast: new Filter(DOM['effects_list'], 'contrast', '%', 0, 200, 100, () => this.updateFilters()),
      grayscale: new Filter(DOM['effects_list'], 'grayscale', '%', 0, 100, 0, () => this.updateFilters()),
      hueRotate: new Filter(DOM['effects_list'], 'hue-rotate', 'deg', 0, 360, 0, () => this.updateFilters()),
      invert: new Filter(DOM['effects_list'], 'invert', '%', 0, 100, 0, () => this.updateFilters()),
      opacity: new Filter(DOM['effects_list'], 'opacity', '%', 0, 100, 100, () => this.updateFilters()),
      saturate: new Filter(DOM['effects_list'], 'saturate', '%', 0, 200, 100, () => this.updateFilters()),
      sepia: new Filter(DOM['effects_list'], 'sepia', '%', 0, 200, 0, () => this.updateFilters())
    }

  }
}

export default Canvas