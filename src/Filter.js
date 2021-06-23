import DOMTools from './DomTools'
import icons from './SvgIcons'
import '../styles/Filter.scss'
import CanvasHistory from './CanvasHistory'
import Canvas from './Canvas'

class Filter {
  /**
   * A filter instance takes the parent HTML Element it will be inserted
   * and some filter values like the type of metric, name, min, max
   * default and currentValue
   * @param {HTMLElement} parentDomElement 
   * @param {string} name 
   * @param {string} metric 
   * @param {number} min 
   * @param {number} max 
   * @param {number} def 
   * @param {number} current 
   */
  constructor(parentDomElement, name, metric, min, max, def, filterUpdateCallback) {
    this._parentDomElement = parentDomElement
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

  set current(value) { this._current = value }
  set inputElement(htmlElement) { this._inputElement = htmlElement }
  set currentValueElement(htmlElement) { this._currentValueElement = htmlElement }
  set resetButtonElement(htmlElement) { this._resetButtonElement = htmlElement }
  set beforeChangeValue(beforeChangeValue) { this._beforeChangeValue = beforeChangeValue }

  reset() {
    this.current = this.def
    this.inputElement.value = this.def
    this._updateFilterValueSpan(this.def)
    this._updateInputBarWidth()
    this.filterUpdateCallback(this.name, this.current, this.metric)
  }

  _updateInputBarWidth() {
    //gets the percentage of progression on the input
    let value = (this.current - this.min) / (this.max - this.min) * 100
    //updates the background with the percentage value calculated above
    const backgroundStyle = 'linear-gradient(to right, #18A0FB 0%, #18A0FB ' + value + '%, #454351 ' + value + '%, #454351 100%)'
    this.inputElement.style.background = `${backgroundStyle}`
  }

  _updateFilterValueSpan(newValue) {
    this.currentValueElement.textContent = newValue + ' ' + this.metric
  }

  _handleResetFilter(e) {
    if (this.current === this.def) return

    this.inputElement.value = this.def
    this.reset()

    this.resetButtonElement.animate([
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-360deg)' }
    ], {
      duration: 150,
      easing: 'ease-in-out'
    });
  }

  _handleInputData(event) {
    const { value } = event.target
    this._current = value
    this._updateFilterValueSpan(this.current)
    this._updateInputBarWidth()
    this.filterUpdateCallback(this.name, this.current, this.metric)
  }

  onMouseUpFilterInput() {
    const history = new CanvasHistory()
    const canvas = new Canvas()

    const action = `Changed ${this.name} from ${this.beforeChangeValue} to ${this.current}`

    //TODO: Change this
    history.addSnapshot({
      action,
      canvasData: {
        image: canvas.image.toDataURL(),
        width: canvas.width,
        height: canvas.height
      },
      selectionData: null,
      filtersString: canvas.filters.getFiltersString(),
      isUpload: false
    })
  }

  onMouseDownFilterInput() {
    this.beforeChangeValue = this.current
  }

  __init__() {
    const filterInputClass = DOMTools.generateRandomClassPrefix(10) + '_filter_input'
    const filterResetButtonClass = DOMTools.generateRandomClassPrefix(10) + '_filter_reset_btn'
    const filterCurrentClass = DOMTools.generateRandomClassPrefix(10) + '_filter_current'

    this.parentDomElement.insertAdjacentHTML('beforeend', /*HTML*/`
      <div class="filter_wrapper">
        <header class="filter_header">
          <div class="filter_header_info">
            <h3 class="filter_header_info_title">${DOMTools.capitalizeFirstLetter(this.name)}</h3>
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

    this.inputElement.addEventListener('mousedown', () => this.onMouseDownFilterInput())
    this.inputElement.addEventListener('mouseup', () => this.onMouseUpFilterInput())
  }
}

export default Filter