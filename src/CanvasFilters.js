class CanvasFilters {
  constructor(context) {
    this._filters = {

    }
    this._context = context
  }

  get filter() {
    return this._filter
  }

  get value() {
    return this._value
  }

  get min() {
    return this._min
  }

  get max() {
    return this._max
  }

  get unit() {
    return this._unit
  }

  set value(newValue) {
    console.log(`Changed ${this.filter} value to ${value}`)
    this._value = newValue
  }

  changeValue(value) {
    this._value = value
  }

  applyFilter() {
    return `${this.filter}(${this.value}${this.unit})`
  }
}

export default CanvasFilters