import { $ } from './DomTools'
import SelectionToolSingleton from './SelectionTool'
import CanvasFiltersSingleton from './CanvasFilters'
import ImageSingleton from './Image'

import '../styles/Canvas.scss'

const CanvasSingleton = (() => {
  class Canvas {
    constructor() {
      this._canvas = document.createElement('canvas')
      this._ctx = this.canvas.getContext('2d')
      this._image = ImageSingleton.getInstance()
      this._selectionTool = null
    }

    get image() { return this._image }
    get canvas() { return this._canvas }
    get ctx() { return this._ctx }
    get selectionTool() { return this._selectionTool }
    get toast() { return this._toast }

    set canvas(canvas) { this._canvas = canvas }
    set ctx(ctx) { this._ctx = ctx }
    set selectionTool(selectionTool) { this._selectionTool = selectionTool }

    toDataURL() {
      return this.canvas.toDataURL()
    }

    setSize(width, height) {
      this.canvas.width = width
      this.canvas.height = height
    }

    resetFilters() {
      const filters = CanvasFiltersSingleton.getInstance()

      if (filters.getFiltersString().length === 0) return
      filters.reset()
      // this.toast.putMessage('⚠️ Filters reseted!', 2000, 'normal')
    }

    applyFiltersToCtx() {
      const filters = CanvasFiltersSingleton.getInstance()

      filters.applyFiltersOnCanvasContext()
    }

    applyFiltersToImagePreview() {
      const filters = CanvasFiltersSingleton.getInstance()

      filters.applyFiltersOnImagePreview()
    }

    putImage(image, width, height) {
      this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height)

      this.image.width = width
      this.image.height = height
      this.setSize(width, height)

      this.ctx.drawImage(image, 0, 0)

      $('.image_preview').src = this.toDataURL()

    }

    changeImage(image, width, height) {
      this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height)

      this.image.width = width
      this.image.height = height
      this.setSize(width, height)

      this.ctx.putImageData(image, 0, 0)

      $('.image_preview').src = this.toDataURL()
    }

    cropImage() {
      this.selectionTool = SelectionToolSingleton.getInstance()

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

      //update the imagePreview
      $('.image_preview').src = this.canvas.toDataURL()

      //show Elements
      $('.toolbar_clear_btn').style.display = 'flex'
      $('.toolbar_save_btn').style.display = 'flex'

      this.selectionTool.hide()

      return {
        image: croppedImage,
        width: croppedWidth,
        height: croppedHeight
      }
    }
  }

  let canvasInstance

  function createCanvas() {
    canvasInstance = new Canvas()
    return canvasInstance
  }

  return {
    getInstance: () => {
      if (!canvasInstance) canvasInstance = createCanvas()
      return canvasInstance
    }
  }
})()

export default CanvasSingleton