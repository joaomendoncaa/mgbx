import DomTools from './DomTools'

const DOMTools = new DomTools()

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
  constructor(parentDomElement, name, metric, min, max, def) {
    this._parentDomElement = parentDomElement
    this._name = name
    this._metric = metric
    this._min = min
    this._max = max
    this._def = def
    this._current = 0

    this.__init__()
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

  set current(value) {
    this._current = value
  }

  _resetIcon() {
    return /*HTML*/`
      <span>reset</span>
    `
  }

  __init__() {
    this.current = this.def

    this.parentDomElement.insertAdjacentHTML('beforeend', /*HTML*/`
      <div class="filter_wrapper">
        <header class="filter_header">
          <h3>${DOMTools.capitalizeFirstLetter(this.name)}</h3>
          <button class="filter_reset_btn">${this._resetIcon()}</button>
        </header>
        <input 
          class="filter_input"
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
  }
}

export default Filter