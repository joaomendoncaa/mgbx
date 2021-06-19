import DOM from './DomElements'

class Header {
  constructor() {
    this._headerSpan = DOM['main_header_span']
    this._headerEditing = DOM['main_header_editing']
  }

  get headerSpan() {
    return this._headerSpan
  }

  get headerEditing() {
    return this._headerEditing
  }

  changeSpanText(textString) {
    this.headerSpan.textContent = textString
  }

  editingToggle() {
    const currentDisplayStyle = this.headerEditing.style.display
    switch (currentDisplayStyle) {
      case 'flex':
        this.headerEditing.style.display = 'none'
        break
      case 'none':
        this.headerEditing.style.display = 'flex'
        break
    }
  }
}

export default Header