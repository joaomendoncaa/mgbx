import DOM from './DomElements'
import Filter from './Filter'

class CanvasFilters {
  constructor(context) {
    this._context = context
    this._filters = {}
    this._blur = new Filter(DOM['effects_list'], 'blur', 'px', 0, 20, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
    this._brightness = new Filter(DOM['effects_list'], 'brightness', '%', 0, 200, 100, (a, b, c) => this.updateFiltersMap(a, b, c))
    this._contrast = new Filter(DOM['effects_list'], 'contrast', '%', 0, 200, 100, (a, b, c) => this.updateFiltersMap(a, b, c))
    this._grayscale = new Filter(DOM['effects_list'], 'grayscale', '%', 0, 100, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
    this._hueRotate = new Filter(DOM['effects_list'], 'hue-rotate', 'deg', 0, 360, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
    this._invert = new Filter(DOM['effects_list'], 'invert', '%', 0, 100, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
    this._opacity = new Filter(DOM['effects_list'], 'opacity', '%', 0, 100, 100, (a, b, c) => this.updateFiltersMap(a, b, c))
    this._saturate = new Filter(DOM['effects_list'], 'saturate', '%', 0, 200, 100, (a, b, c) => this.updateFiltersMap(a, b, c))
    this._sepia = new Filter(DOM['effects_list'], 'sepia', '%', 0, 200, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
  }

  get context() { return this._context }

  get filters() { return this._filters }

  get blur() { return this._blur }

  get brightness() { return this._brightness }

  get contrast() { return this._contrast }

  get grayscale() { return this._grayscale }

  get hueRotate() { return this._hueRotate }

  get invert() { return this._invert }

  get opacity() { return this._opacity }

  get saturate() { return this._saturate }

  get sepia() { return this._sepia }

  set filters(filters) { this._filters = filters }

  setFilter(key, value) { this._filters[key] = value }

  updateFiltersMap(filterName, filterValue, filterUnit) {
    this.setFilter(filterName, `${filterValue}${filterUnit}`)
    this.applyFiltersOnImagePreview(this.getFiltersString())
  }

  applyFiltersOnCanvasContext() {
    this.context.filter = this.getFiltersString()
  }

  applyFiltersOnImagePreview() {
    DOM['image_preview'].style.filter = this.getFiltersString()
  }

  getFiltersString() {
    let filtersFinalString = ''
    Object.keys(this.filters).map(filterName => {
      filtersFinalString += `${filterName}(${this.filters[filterName]}) `
    })
    return filtersFinalString
  }

  reset() {
    this.blur.reset()
    this.brightness.reset()
    this.contrast.reset()
    this.grayscale.reset()
    this.hueRotate.reset()
    this.invert.reset()
    this.opacity.reset()
    this.saturate.reset()
    this.sepia.reset()
  }
}

export default CanvasFilters