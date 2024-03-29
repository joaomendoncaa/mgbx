import { $ } from './DomTools'
import icons from './SvgIcons'

import '../styles/Toolbar.scss'

const ToolbarSingleton = (() => {
  class Toolbar {
    constructor() {
      if (!!Toolbar.instance) {
        return Toolbar.instance
      }
      Toolbar.instance = this

      this._leftArea = $('.toolbar_leftarea')
      this._rightArea = $('.toolbar_rightarea')

      this.__init__()

      return this
    }

    get leftArea() { return this._leftArea }
    get rightArea() { return this._rightArea }

    __init__() {
      this.leftArea.insertAdjacentHTML('afterbegin', /*HTML*/`
        <button class="toolbar_settings_btn rect_toolbar_btn">
          ${icons.settings}
        </button>

        <button class="toolbar_instructions_btn rect_toolbar_btn">
          ${icons.instructions}
        </button>
      `)

      this.rightArea.insertAdjacentHTML('afterbegin', /*HTML*/`
          <button class="toolbar_clear_btn rect_toolbar_btn">
            <span class="rect_toolbar_btn_text">Clear Canvas</span>
          </button>
  
          <button class="toolbar_save_btn rect_toolbar_btn">
            ${icons.save}
            <span class="rect_toolbar_btn_text">Save Image</span>
          </button>
  
          <button class="toolbar_upload_btn rect_toolbar_btn">
            <input type="file" class="toolbar_upload_input" />
            ${icons.upload}
            <span class="rect_toolbar_btn_text">Upload Image</span>
          </button>
      `)
    }
  }

  let toolbarInstance

  function createToolbar() {
    toolbarInstance = new Toolbar()
    return toolbarInstance
  }

  return {
    getInstance: () => {
      if (!toolbarInstance) toolbarInstance = createToolbar()
      return toolbarInstance
    }
  }
})()


export default ToolbarSingleton