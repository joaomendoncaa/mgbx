import $ from './DomElements'

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

export default Header