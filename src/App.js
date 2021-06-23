import Toast from './Toast'
import DOMTools from './DomTools'
import $ from './DomElements'
import Canvas from './Canvas'
import ImageUploaded from './ImageUploaded'
import Header from './Header'
import Toolbar from './Toolbar'
import SelectionTool from './SelectionTool'
import CanvasHistory from './CanvasHistory'

import '../styles/main.scss'

class App {
  constructor() {
    this._image = null
    this._canvas = null
    this._selectionTool = null
    this._canvasHistory = null
    this._header = new Header()
    this._toolbar = new Toolbar()
    this._toast = new Toast()

    this.__init__()
  }

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

  onLoadImageFromReader() {
    this.canvas = new Canvas(this.image)
    this.canvasHistory = new CanvasHistory(
      $('.history_list'),
      $('.history_controls_previous'),
      $('.history_controls_next'),
      this.canvas,
      this.image
    )
    this.selectionTool = new SelectionTool(this.canvas)
    this.canvasHistory.addSnapshot({
      action: 'Uploaded Image',
      canvasData: {
        image: this.image,
        width: this.image.width,
        height: this.image.height
      },
      selectionData: null,
      filtersString: this.canvas.filters.getFiltersString(),
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

    this.image = new ImageUploaded(imageUploaded)

    this.header.changeSpanText(this.image.getName(), true)

    let reader = new FileReader()
    reader.readAsDataURL(this.image.getBlob())

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
    a.download = this.image.getName() + '-cropped.jpeg'
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

  //on app init
  __init__() {
    $('.toolbar_upload_btn').addEventListener('click', () => this.onClickToolbarUploadBtn())
    $('.toolbar_upload_input').addEventListener('change', () => this.onChangeToolbarUploadInput())
    $('.effects_header_reset_btn').addEventListener('click', () => this.onClickEffectsHeaderResetBtn())
    $('.toolbar_save_btn').addEventListener('click', () => this.onClickToolbarSaveBtn())
    $('.toolbar_clear_btn').addEventListener('click', () => this.onClickToolbarClearBtn())
  }
}

export default App