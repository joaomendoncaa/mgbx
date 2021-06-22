import History from './History'
import HistoryButton from './HistoryButton'
import $ from './DomElements'

import '../styles/History.scss'

class CanvasHistory {
  constructor(parentDomElement, previousButtonElement, nextButtonElement) {
    this._parentDomElement = parentDomElement
    this._previousButtonElement = previousButtonElement
    this._nextButtonElement = nextButtonElement
    this._history = new History()

    this.__init__()
  }

  get parentDomElement() { return this._parentDomElement }
  get previousButtonElement() { return this._previousButtonElement }
  get nextButtonElement() { return this._nextButtonElement }
  get history() { return this._history }

  renderHistoryButtonList() {
    this.history.history.map(snapshotData => {
      new HistoryButton(this.parentDomElement, (id) => { this.setCurrentSnapshot(id) }, snapshotData)
    })
  }

  onClickPrevious() {
    const pointer = this.history.previous()
    this.setCurrentSnapshot(pointer)
  }

  onClickNext() {
    const pointer = this.history.next()
    this.setCurrentSnapshot(pointer)
  }

  setCurrentSnapshot(snapshotId) {
    this.history.pointer = snapshotId
    $(`.history_button`, true).forEach(node => node.style.background = '#2B2A33')
    $(`.history_button[data-snapshot-id="${snapshotId}"]`).style.background = '#0485DC'
  }

  __init__() {
    this.history.add({
      action: 'Teste 1',
      canvasData: {},
      selectionData: {},
      filtersData: {}
    })

    this.history.add({
      action: 'Teste 2',
      canvasData: {},
      selectionData: {},
      filtersData: {}
    })

    this.history.add({
      action: 'Teste 3',
      canvasData: {},
      selectionData: {},
      filtersData: {}
    })
    this.history.add({
      action: 'Teste 4',
      canvasData: {},
      selectionData: {},
      filtersData: {}
    })
    this.history.add({
      action: 'Teste 5',
      canvasData: {},
      selectionData: {},
      filtersData: {}
    })
    this.history.add({
      action: 'Teste 6',
      canvasData: {},
      selectionData: {},
      filtersData: {}
    })
    this.history.add({
      action: 'Teste 7',
      canvasData: {},
      selectionData: {},
      filtersData: {}
    })
    this.history.add({
      action: 'Teste 8',
      canvasData: {},
      selectionData: {},
      filtersData: {}
    })
    this.history.add({
      action: 'Teste 9',
      canvasData: {},
      selectionData: {},
      filtersData: {}
    })

    console.log(
      '⚠️ History list: ',
      this.history.history
    )

    this.renderHistoryButtonList()

    this.history.pointer = 1
    this.setCurrentSnapshot(1)

    this.previousButtonElement.addEventListener('click', () => { this.onClickPrevious() })
    this.nextButtonElement.addEventListener('click', () => { this.onClickNext() })
  }
}

export default CanvasHistory