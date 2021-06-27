import $ from './DomElements'
import Filter from './Filter'

const CanvasFiltersSingleton = (() => {
  class CanvasFilters {
    constructor(context) {
      this._context = context
      this._filters = {}
      this._blur = new Filter('blur', 'px', 0, 100, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
      this._brightness = new Filter('brightness', '%', 0, 200, 100, (a, b, c) => this.updateFiltersMap(a, b, c))
      this._contrast = new Filter('contrast', '%', 0, 200, 100, (a, b, c) => this.updateFiltersMap(a, b, c))
      this._grayscale = new Filter('grayscale', '%', 0, 100, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
      this._hueRotate = new Filter('hue-rotate', 'deg', 0, 360, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
      this._invert = new Filter('invert', '%', 0, 100, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
      this._opacity = new Filter('opacity', '%', 0, 100, 100, (a, b, c) => this.updateFiltersMap(a, b, c))
      this._saturate = new Filter('saturate', '%', 0, 200, 100, (a, b, c) => this.updateFiltersMap(a, b, c))
      this._sepia = new Filter('sepia', '%', 0, 200, 0, (a, b, c) => this.updateFiltersMap(a, b, c))
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
      $('.image_preview').style.filter = this.getFiltersString()
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
  }//CanvasFilters

  let canvasFiltersInstance

  function createCanvasFilters() {
    canvasFiltersInstance = new CanvasFilters()
    return canvasFiltersInstance
  }

  return {
    getInstance: () => {
      if (!canvasFiltersInstance) canvasFiltersInstance = createCanvasFilters()
      return canvasFiltersInstance
    }
  }
})()

export default CanvasFiltersSingleton