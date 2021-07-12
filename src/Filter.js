import { $, generateRandomClassPrefix } from './DomTools'
import icons from './SvgIcons'
import '../styles/Filter.scss'
import CanvasHistorySingleton from './CanvasHistory'
import CanvasSingleton from './Canvas'
import CanvasFiltersSingleton from './CanvasFilters'
import ThemeSwitcherSingleton from './ThemeSwitcher'
import Utils from './Utils'

class Filter {
  /**
   * A filter instance takes the some filter values like the type of metric, 
   * name, min, max, default and currentValue
   * @param {string} name 
   * @param {string} metric 
   * @param {number} min 
   * @param {number} max 
   * @param {number} def 
   * @param {number} current 
   */
  constructor(name, metric, min, max, def, filterUpdateCallback) {
    this._history = CanvasHistorySingleton.getInstance()
    this._canvas = CanvasSingleton.getInstance()

    this._parentDomElement = $('.effects_list')
    this._inputElement = null
    this._currentValueElement = null
    this._resetButtonElement = null
    this._name = name
    this._metric = metric
    this._min = min
    this._max = max
    this._def = def
    this._current = def
    this._filterUpdateCallback = filterUpdateCallback
    this._beforeChangeValue = 0

    this.__init__()
  }

  get resetButtonElement() { return this._resetButtonElement }
  get currentValueElement() { return this._currentValueElement }
  get filterUpdateCallback() { return this._filterUpdateCallback }
  get name() { return this._name }
  get metric() { return this._metric }
  get min() { return this._min }
  get max() { return this._max }
  get def() { return this._def }
  get parentDomElement() { return this._parentDomElement }
  get inputElement() { return this._inputElement }
  get current() { return this._current }
  get beforeChangeValue() { return this._beforeChangeValue }
  get canvas() { return this._canvas }
  get history() { return this._history }
  get canvasFilters() { return this._canvasFilters }

  set current(value) { this._current = value }
  set inputElement(htmlElement) { this._inputElement = htmlElement }
  set currentValueElement(htmlElement) { this._currentValueElement = htmlElement }
  set resetButtonElement(htmlElement) { this._resetButtonElement = htmlElement }
  set beforeChangeValue(beforeChangeValue) { this._beforeChangeValue = beforeChangeValue }

  updateFilterValue(newFilterValue) {
    this.current = parseFloat(newFilterValue)
    this.beforeChangeValue = parseFloat(newFilterValue)
    this.inputElement.value = parseFloat(newFilterValue)
    this._updateFilterValueSpan(parseFloat(newFilterValue))
    this._updateInputBarWidth()
  }

  reset() {
    this.beforeChangeValue = this.current
    this._onMouseUpFilterInput()
    this._updateFilterValueSpan(this.def)
    this.current = this.def
    this._updateInputBarWidth()
    this.filterUpdateCallback(this.name, this.current, this.metric)
    this.inputElement.value = this.def
  }

  _updateInputBarWidth() {
    const theme = ThemeSwitcherSingleton.getInstance()
    //gets the percentage of progression on the input
    let value = (this.current - this.min) / (this.max - this.min) * 100
    //updates the background with the percentage value calculated above
    const backgroundStyle = `linear-gradient(to right, ${theme.current['--filter-input-track-filled']} 0%, ${theme.current['--filter-input-track-filled']} ${value}%, ${theme.current['--filter-input-track']} ${value}%, ${theme.current['--filter-input-track']} 100%)`
    this.inputElement.style.background = `${backgroundStyle}`
  }

  _updateFilterValueSpan(newValue) {
    this.currentValueElement.textContent = newValue + this.metric
  }

  _handleResetFilter(e) {
    if (this.current === this.def) return

    const canvasFilters = CanvasFiltersSingleton.getInstance()

    const action = `${Utils.capitalizeFirstLetter(this.name)} reseted`

    this.reset()

    this.history.addSnapshot({
      action,
      canvasData: {
        image: this.canvas.ctx.getImageData(0, 0, this.canvas.image.width, this.canvas.image.height),
        width: this.canvas.image.width,
        height: this.canvas.image.height
      },
      selectionData: null,
      filtersString: canvasFilters.getFiltersString(),
      isUpload: false
    })
  }

  _handleInputData(event) {
    const { value } = event.target
    this._current = value
    this._updateFilterValueSpan(this.current)
    this._updateInputBarWidth()
    this.filterUpdateCallback(this.name, this.current, this.metric)
  }

  _onMouseUpFilterInput() {
    if (this.current === this.beforeChangeValue) return

    const canvasFilters = CanvasFiltersSingleton.getInstance()

    const action = `${Utils.capitalizeFirstLetter(this.name)} from ${this.beforeChangeValue}${this.metric} to ${this.current}${this.metric}`

    this.history.addSnapshot({
      action,
      canvasData: {
        image: this.canvas.ctx.getImageData(0, 0, this.canvas.image.width, this.canvas.image.height),
        width: this.canvas.image.width,
        height: this.canvas.image.height
      },
      selectionData: null,
      filtersString: canvasFilters.getFiltersString(),
      isUpload: false
    })
  }

  _onMouseDownFilterInput() {
    this.beforeChangeValue = this.current
  }

  __init__() {
    const filterInputClass = generateRandomClassPrefix(10) + '_filter_input'
    const filterResetButtonClass = generateRandomClassPrefix(10) + '_filter_reset_btn'
    const filterCurrentClass = generateRandomClassPrefix(10) + '_filter_current'

    this.parentDomElement.insertAdjacentHTML('beforeend', /*HTML*/`
      <div class="filter_wrapper">
        <header class="filter_header">
          <div class="filter_header_info">
            <h3 class="filter_header_info_title">${Utils.capitalizeFirstLetter(this.name)}</h3>
            <span class="filter_header_info_current ${filterCurrentClass}"></span>
          </div>
          <button class="filter_reset_btn ${filterResetButtonClass}">${icons.reset}</button>
        </header>
        <input 
          class="filter_input ${filterInputClass}"
          type="range" 
          min="${this.min}" 
          max="${this.max}" 
          value="${this.current}"
        />
      </div>
    `)

    this.inputElement = document.querySelector(`.${filterInputClass}`)
    this.currentValueElement = document.querySelector(`.${filterCurrentClass}`)
    this.resetButtonElement = document.querySelector(`.${filterResetButtonClass}`)

    this.inputElement.addEventListener('input', (event) => { this._handleInputData(event) })
    this.resetButtonElement.addEventListener('click', (event) => { this._handleResetFilter(event) })

    this._updateFilterValueSpan(this.def)
    this._updateInputBarWidth()

    this.inputElement.addEventListener('mousedown', () => this._onMouseDownFilterInput())
    this.inputElement.addEventListener('mouseup', () => this._onMouseUpFilterInput())
  }
}

export default Filter