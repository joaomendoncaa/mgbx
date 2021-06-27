import $ from './DomElements'

import '../styles/Header.scss'

const HeaderSingleton = (() => {
  class Header {
    constructor() {
      this._headerSpan = $('.main_header_span')
      this._headerEditing = $('.main_header_editing')
    }

    get headerSpan() { return this._headerSpan }
    get headerEditing() { return this._headerEditing }

    changeSpanText(textString, editingToggle) {
      this.headerSpan.textContent = textString

      switch (editingToggle) {
        case true:
          this.headerEditing.style.display = 'flex'
          break
        case false:
          this.headerEditing.style.display = 'none'
          break
      }
    }
  }

  let headerInstance

  function createHeader() {
    headerInstance = new Header()
    return headerInstance
  }

  return {
    getInstance: () => {
      if (!headerInstance) headerInstance = createHeader()
      return headerInstance
    }
  }
})()

export default HeaderSingleton