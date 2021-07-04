import Toast from './Toast'
import DOMTools from './DomTools'
import $ from './DomElements'
import Utils from './Utils'
import Settings from './Settings'
import HeaderSingleton from './Header'
import ToolbarSingleton from './Toolbar'
import ImageSingleton from './Image'
import CanvasSingleton from './Canvas'
import SelectionToolSingleton from './SelectionTool'
import CanvasHistorySingleton from './CanvasHistory'
import ThemeSwitcherSingleton from './ThemeSwitcher'
import CanvasFiltersSingleton from './CanvasFilters'

import '../styles/main.scss'

class App {
  constructor() {
    this._image = null
    this._canvas = null
    this._selectionTool = null
    this._canvasHistory = null
    this._canvasFilters = null
    this._themeSwitcher = ThemeSwitcherSingleton.getInstance()
    this._header = HeaderSingleton.getInstance()
    this._toolbar = ToolbarSingleton.getInstance()
    this._settings = new Settings()
    this._toast = new Toast()

    this.__init__()
  }

  get canvasFilters() { return this._canvasFilters }
  get canvasHistory() { return this._canvasHistory }
  get selectionTool() { return this._selectionTool }
  get toolbar() { return this._toolbar }
  get header() { return this._header }
  get canvas() { return this._canvas }
  get image() { return this._image }

  set canvas(canvas) { this._canvas = canvas }
  set image(image) { this._image = image }
  set selectionTool(selectionTool) { this._selectionTool = selectionTool }
  set canvasHistory(canvasHistory) { this._canvasHistory = canvasHistory }
  set canvasFilters(canvasFilters) { this._canvasFilters = canvasFilters }

  onLoadImageFromReader() {
    this.canvas = CanvasSingleton.getInstance()
    this.canvasHistory = CanvasHistorySingleton.getInstance()
    this.selectionTool = SelectionToolSingleton.getInstance()
    this.canvasFilters = CanvasFiltersSingleton.getInstance()

    this.canvasHistory.addSnapshot({
      action: 'Uploaded Image',
      canvasData: {
        image: this.image,
        width: this.image.width,
        height: this.image.height
      },
      selectionData: null,
      filtersString: this.canvasFilters.getFiltersString(),
      isUpload: true
    })
    this.canvas.setSize(this.image.width, this.image.height)
    this.canvas.ctx.clearRect(0, 0, this.image.width, this.image.height)
    this.canvas.ctx.drawImage(this.image, 0, 0)
    $('.image_preview').style.display = 'initial'
    $('.image_preview').src = this.canvas.toDataURL()
  }

  onChangeToolbarUploadInput() {
    const imageUploaded = $('.toolbar_upload_input').files[0]
    const imageInstance = ImageSingleton.getInstance()

    imageInstance.upload(imageUploaded)

    this.image = imageInstance.data

    this.header.changeSpanText(this.image.name, true)

    let reader = new FileReader()
    reader.readAsDataURL(this.image)

    reader.addEventListener('load', (event) => {
      this.image = new Image()
      this.image.src = event.target.result
      this.image.addEventListener('load', this.onLoadImageFromReader.bind(this))

      DOMTools.elementVisibility([
        $('.toolbar_upload_btn')
      ], 'none')

      DOMTools.elementVisibility([
        $('.toolbar_save_btn'),
        $('.toolbar_clear_btn'),
        $('.effects_wrapper'),
        $('.history_wrapper')
      ], 'flex')
    })
  }

  onClickToolbarUploadBtn() {
    $('.toolbar_upload_input').click()
  }

  onClickEffectsHeaderResetBtn() {
    this.canvas.resetFilters()
  }

  /**
   * Creates an anchor element in the document and gives it a href of the canvas data
   * and a download of the image name
   */
  onClickToolbarSaveBtn() {
    const a = document.createElement('a')
    a.download = this.image.name + '-cropped.jpeg'
    this.canvas.applyFiltersToCtx()
    this.canvas.ctx.drawImage(this.image, 0, 0)
    a.href = this.canvas.toDataURL()
    a.click()
  }

  onClickToolbarClearBtn() {
    //clear the context and erase the image selected
    this.canvas.ctx.clearRect(0, 0, this.canvas.ctx.width, this.canvas.ctx.height)
    this.canvas = null

    $('.selection_tool').style.display = 'none'
    $('.image_preview').src = ''

    this.header.changeSpanText('No Image uploaded', false)

    //remove all the elements needed
    $('.image_preview').style.display = 'none'
    $('.toolbar_clear_btn').style.display = 'none'
    $('.selection_crop_btn').style.display = 'none'
    $('.toolbar_save_btn').style.display = 'none'
    $('.selection_tool_mask').style.display = 'none'
    $('.effects_wrapper').style.display = 'none'
    $('.history_wrapper').style.display = 'none'
    $('.effects_list').innerHTML = ''

    //add upload button back in
    $('.toolbar_upload_btn').style.display = 'flex'
  }

  onWheelMove(event) {
    const isZoomIn = event.deltaY < 0
    const isZoomOut = event.deltaY > 0
    const isCtrlBeingPressed = event.ctrlKey === true
    const isShiftBeingPressed = event.shiftKey === true
    const imageCurrentWidth = $('.image_preview').clientWidth
    const zoomSteps = isShiftBeingPressed ? 75 : 20

    if (isCtrlBeingPressed) event.preventDefault()
    if (imageCurrentWidth < 10) return

    //if the user is scrolling in
    if (isCtrlBeingPressed && isZoomIn)
      $('.image_preview').style.width = Utils.parsePixels(imageCurrentWidth + zoomSteps)

    //if the user is scrolling out
    if (isCtrlBeingPressed && isZoomOut)
      $('.image_preview').style.width = Utils.parsePixels(imageCurrentWidth - zoomSteps)

    if (isCtrlBeingPressed && isZoomOut || isCtrlBeingPressed && isZoomIn)
      this.selectionTool.hide()
  }

  escape() {
    if ()
  }

  onKeyDown(event) {
    if (event.ctrlKey === true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109' || event.which == '187' || event.which == '189')) {
      event.preventDefault();
    }

    //escape key
    if (event.which === 27) return this.escape()
  }

  //on app init
  __init__() {
    $('.toolbar_upload_btn').addEventListener('click', () => this.onClickToolbarUploadBtn())
    $('.toolbar_upload_input').addEventListener('change', () => this.onChangeToolbarUploadInput())
    $('.effects_header_reset_btn').addEventListener('click', () => this.onClickEffectsHeaderResetBtn())
    $('.toolbar_save_btn').addEventListener('click', () => this.onClickToolbarSaveBtn())
    $('.toolbar_clear_btn').addEventListener('click', () => this.onClickToolbarClearBtn())

    window.addEventListener('wheel', (event) => this.onWheelMove(event), { passive: false })
    window.addEventListener('mousewheel', (event) => this.onWheelMove(event), { passive: false })
    window.addEventListener('DOMMouseScroll', (event) => this.onWheelMove(event), { passive: false })
    document.addEventListener('keydown', (event) => this.onKeyDown(event))
  }
}

export default App