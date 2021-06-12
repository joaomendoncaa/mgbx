class Filters {
  constructor() {
    this._filters = {}
    //initialize the filters
    this.__init__()
  }

  get filters() {
    return this._filters
  }

  set filters(filters) {
    this._filters = filters
  }

  _createFilter(name, metric, min, max, def, current) {
    this.filters[name] = {
      metric,
      min,
      max,
      def,
      current
    }
  }

  __init__() {
    this._createFilter('blur', 'px', 0, 20, 0, 0)
    this._createFilter('blur', 'px', 0, 20, 0, 0)
    this._createFilter('blur', 'px', 0, 20, 0, 0)
    this._createFilter('blur', 'px', 0, 20, 0, 0)
    this._createFilter('blur', 'px', 0, 20, 0, 0)
    this._createFilter('blur', 'px', 0, 20, 0, 0)
    this._createFilter('blur', 'px', 0, 20, 0, 0)
    this._createFilter('blur', 'px', 0, 20, 0, 0)


    console.log(this.filters)
  }
}

export default Filters