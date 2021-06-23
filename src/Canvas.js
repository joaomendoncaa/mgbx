import CanvasFilters from './CanvasFilters'
import $ from './DomElements'
import SelectionTool from './SelectionTool'
import Toast from './Toast'

class Canvas {
  constructor(image) {
    if (!!Canvas.instance) return Canvas.instance
    Canvas.instance = this

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this._image = image
    this._filters = new CanvasFilters(this.ctx)
    this._toast = new Toast()
    this._selectionTool = null

    return this
  }

  get image() { return this._image }
  get canvas() { return this._canvas }
  get ctx() { return this._ctx }
  get filters() { return this._filters }
  get selectionTool() { return this._selectionTool }
  get toast() { return this._toast }

  set canvas(canvas) { this._canvas = canvas }
  set ctx(ctx) { this._ctx = ctx }
  set filters(filters) { this._filters = filters }
  set selectionTool(selectionTool) { this._selectionTool = selectionTool }

  toDataURL() {
    return this.canvas.toDataURL()
  }

  setSize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }

  resetFilters() {
    if (this.filters.getFiltersString().length === 0) return
    this.filters.reset()
    this.toast.putMessage('⚠️ Filters reseted!', 2000, 'normal')
  }

  applyFiltersToCtx() {
    this.filters.applyFiltersOnCanvasContext()
  }

  putImage(image, width, height) {
    this.image.width = width
    this.image.height = height
    this.setSize(width, height)

    this.ctx.drawImage(image, 0, 0)

    $('.image_preview').src = this.canvas.toDataURL()
  }

  changeImage(image, width, height) {
    this.image.width = width
    this.image.height = height
    this.setSize(width, height)

    this.ctx.putImageData(image, 0, 0)

    $('.image_preview').src = this.canvas.toDataURL()
  }

  cropImage() {
    this.selectionTool = new SelectionTool()

    const imageWidth = this.image.width
    const imageHeight = this.image.height

    const { width: previewImageWidth, height: previewImageHeight } = $('.image_preview')

    //get the aspect ratio of the image
    const [widthRatio, heightRatio] = [
      Number(imageWidth / previewImageWidth),
      Number(imageHeight / previewImageHeight)
    ]

    const [selectionWidth, selectionHeight] = [
      parseInt($('.selection_tool').style.width),
      parseInt($('.selection_tool').style.height)
    ]

    const [croppedWidth, croppedHeight] = [
      Number(selectionWidth * widthRatio),
      Number(selectionHeight * heightRatio)
    ]

    const [actualX, actualY] = [
      Number(this.selectionTool.selectionOriginCoordinates.x * widthRatio),
      Number(this.selectionTool.selectionOriginCoordinates.y * heightRatio)
    ]

    //get the cropped image from the canvas context
    const croppedImage = this.ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight)

    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height)

    //ajust propotions to the new image
    this.image.width = croppedWidth
    this.image.height = croppedHeight
    this.setSize(croppedWidth, croppedHeight)

    //add the cropped image to the context
    this.ctx.putImageData(croppedImage, 0, 0)

    //hide the selection tool
    $('.selection_tool').style.display = 'none'

    //update the imagePreview
    $('.image_preview').src = this.canvas.toDataURL()

    //show Elements
    $('.toolbar_clear_btn').style.display = 'flex'
    $('.toolbar_save_btn').style.display = 'flex'

    //Hide elements
    $('.selection_tool_controls').style.display = 'none'
    $('.selection_tool_mask').style.display = 'none'

    return {
      image: croppedImage,
      width: croppedWidth,
      height: croppedHeight
    }
  }
}

export default Canvas