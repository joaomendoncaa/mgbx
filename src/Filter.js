import DOMTools from './DomTools'
import DOM from './DomElements'
import icons from './Icons'
import '../styles/Filter.scss'

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
    this._name = name
    this._metric = metric
    this._min = min
    this._max = max
    this._def = def
    this._current = def
    this._filterUpdateCallback = filterUpdateCallback

    this.__init__()
  }

  get filterUpdateCallback() {
    return this._filterUpdateCallback
  }

  get name() {
    return this._name
  }

  get metric() {
    return this._metric
  }

  get min() {
    return this._min
  }

  get max() {
    return this._max
  }

  get def() {
    return this._def
  }

  get parentDomElement() {
    return this._parentDomElement
  }

  get inputElement() {
    return this._inputElement
  }

  get current() {
    return this._current
  }

  set current(value) {
    this._current = value
  }

  set inputElement(htmlElement) {
    this._inputElement = htmlElement
  }

  reset() {
    this.current = this.def
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

  __init__() {
    const filterInputClass = DOMTools.generateRandomClassPrefix(10) + '_filter_input'
    const filterResetButtonClass = DOMTools.generateRandomClassPrefix(10) + '_filter_reset_btn'

    this.parentDomElement.insertAdjacentHTML('beforeend', /*HTML*/`
      <div class="filter_wrapper">
        <header class="filter_header">
          <h3>${DOMTools.capitalizeFirstLetter(this.name)}</h3>
          <button class="filter_reset_btn ${filterResetButtonClass}">${icons.reset}</button>
        </header>
        <input 
          class="filter_input ${filterInputClass}"
          type="range" 
          min="${this.min}" 
          max="${this.max}" 
          value="${this.current}"
        />
        <section class="filter_values_wrapper">
          <span class="filter_min">${this.min}</span>
          <span class="filter_max">${this.max}</span>
        </section>
      </div>
    `)

    let input = document.querySelector(`.${filterInputClass}`)
    let resetBtn = document.querySelector(`.${filterResetButtonClass}`)

    input.addEventListener('input', (event) => {
      const { value, dataset } = event.target

      //sets the current value of the input on the object instance
      this._current = value
      //updates the input background for visual representation on the range progress
      this._updateInputBarWidth()
      this.filterUpdateCallback(this.name, this.current, this.metric)
    })

    resetBtn.addEventListener('click', (event) => {
      input.value = this.def
      this.reset()
    })

    this.inputElement = input
    this._updateInputBarWidth()
  }
}

export default Filter