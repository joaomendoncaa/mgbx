import { $, generateRandomClassPrefix } from './DomTools'
import Utils from './Utils'

import '../styles/HistoryButton.scss'

class HistoryButton {
  constructor(parentDomElement, callbackOnClick, historySnapshot) {
    this._parentDomElement = parentDomElement
    this._callbackOnClick = callbackOnClick
    this._historySnapshot = historySnapshot

    this.__init__()
  }

  get parentDomElement() { return this._parentDomElement }
  get callbackOnClick() { return this._callbackOnClick }
  get historySnapshot() { return this._historySnapshot }

  __init__() {
    const historyButtonClass = generateRandomClassPrefix(10) + '_history_button'

    this.parentDomElement.insertAdjacentHTML('beforeend', /*HTML*/`
      <button class="history_button ${historyButtonClass}" data-snapshot-id="${this.historySnapshot.id}">
        <h1 class="history_button_action">${this.historySnapshot.action}</h1>
        <h3 class="history_button_timestamp">${Utils.timestampToDateTime(this.historySnapshot.timestamp)}</h3>
      </button>
    `)

    $(`.${historyButtonClass}`).addEventListener('click', () => { this.callbackOnClick(this.historySnapshot.id) })
  }
}

export default HistoryButton