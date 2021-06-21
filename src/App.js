import Toast from './Toast'
import DOMTools from './DomTools'
import $ from './DomElements'
import Canvas from './Canvas'
import ImageUploaded from './ImageUploaded'
import Header from './Header'
import Toolbar from './Toolbar'
import SelectionTool from './SelectionTool'

import '../styles/main.scss'

class App {
  constructor() {
    this._image = null
    this._canvas = null
    this._header = new Header()
    this._toolbar = new Toolbar()
    this._toast = new Toast()

    this.__init__()
  }

  get toolbar() { return this._toolbar }

  get header() { return this._header }

  get canvas() { return this._canvas }

  get image() { return this._image }

  set canvas(canvas) { this._canvas = canvas }

  set image(image) { this._image = image }

  onLoadImageFromReader() {
    this.canvas = new Canvas(this.image)

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

  onClickSelectionCancelBtn() {
    DOMTools.elementVisibility([
      $('.selection_tool'),
      $('.selection_tool_mask'),
      $('.selection_crop_btn'),
      $('.selection_cancel_btn'),
    ], 'none')
  }

  onClickEffectsHeaderResetBtn() {
    this.canvas.resetFilters()
  }

  onClickSelectionCropBtn() {
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
      Number(selectionOriginCoordinates.x * widthRatio),
      Number(selectionOriginCoordinates.y * heightRatio)
    ]

    //get the cropped image from the canvas context
    const croppedImage = this.canvas.ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight)

    this.canvas.ctx.clearRect(0, 0, this.canvas.ctx.width, this.canvas.ctx.height)

    //ajust propotions to the new image
    this.image.width = croppedWidth
    this.image.height = croppedHeight
    this.canvas.setSize(croppedWidth, croppedHeight)

    //add the cropped image to the context
    this.canvas.ctx.putImageData(croppedImage, 0, 0)

    //hide the selection tool
    $('.selection_tool').style.display = 'none'

    //update the imagePreview
    $('.image_preview').src = this.canvas.toDataURL()

    //show Elements
    $('.toolbar_clear_btn').style.display = 'flex'
    $('.toolbar_save_btn').style.display = 'flex'

    //Hide elements
    $('.selection_crop_btn').style.display = 'none'
    $('.selection_tool_mask').style.display = 'none'
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
    $('.selection_cancel_btn').addEventListener('click', () => this.onClickSelectionCancelBtn())
    $('.effects_header_reset_btn').addEventListener('click', () => this.onClickEffectsHeaderResetBtn())
    $('.selection_crop_btn').addEventListener('click', () => this.onClickSelectionCropBtn())
    $('.toolbar_save_btn').addEventListener('click', () => this.onClickToolbarSaveBtn())
    $('.toolbar_clear_btn').addEventListener('click', () => this.onClickToolbarClearBtn())
  }
}

export default App

let startX
let startY
let selectionOriginCoordinates = {
  x: 0,
  y: 0
}
let isSelecting = false

function parsePixels(integer) {
  return `${integer}px`
}

function getPolygonVectorPoints(width, height, top, left) {
  const widthInt = parseInt(width)
  const heightInt = parseInt(height)
  const topInt = parseInt(top)
  const leftInt = parseInt(left)

  const topLeftCoords = [
    parsePixels(leftInt),
    parsePixels(topInt)
  ]
  const topRightCoords = [
    parsePixels(leftInt + widthInt),
    parsePixels(topInt)
  ]
  const bottomRightCoords = [
    parsePixels(leftInt + widthInt),
    parsePixels(topInt + heightInt)
  ]
  const bottomLeftCoords = [
    parsePixels(leftInt),
    parsePixels(topInt + heightInt)
  ]

  return `polygon( 
    evenodd,
    0 0,       
    100% 0,   
    100% 100%,
    0% 100%,  
    0 0,      
    ${topLeftCoords[0]} ${topLeftCoords[1]},
    ${topRightCoords[0]} ${topRightCoords[1]},
    ${bottomRightCoords[0]} ${bottomRightCoords[1]},
    ${bottomLeftCoords[0]} ${bottomLeftCoords[1]},
    ${topLeftCoords[0]} ${topLeftCoords[1]}
   )`
}

const events = {
  mouseover() {
    this.style.cursor = 'crosshair'
  },
  mousedown(event) {
    const { clientX, clientY, offsetX, offsetY } = event

    startX = clientX
    startY = clientY

    selectionOriginCoordinates.x = offsetX
    selectionOriginCoordinates.y = offsetY

    isSelecting = true
  },
  mousemove(event) {
    if (!isSelecting) return

    let endX = event.clientX
    let endY = event.clientY
    let { offsetX, offsetY } = event

    $('.selection_tool').style.display = 'initial'

    DOMTools.styleElement($('.selection_tool_mask'), {
      display: 'initial',
      width: parsePixels($('.image_preview').width),
      height: parsePixels($('.image_preview').height)
    })

    function drawRectanglePositiveXPositiveY() {
      const width = parsePixels(endX - startX)
      const height = parsePixels(endY - startY)
      const top = parsePixels(startY)
      const left = parsePixels(startX)

      DOMTools.styleElement($('.selection_tool'), {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement($('.selection_tool_mask'), {
        clipPath: getPolygonVectorPoints(
          width,
          height,
          parsePixels(offsetY - parseInt($('.selection_tool').style.height)),
          parsePixels(offsetX - parseInt($('.selection_tool').style.width))
        )
      })

      selectionOriginCoordinates.x = offsetX - parseInt($('.selection_tool').style.width)
      selectionOriginCoordinates.y = offsetY - parseInt($('.selection_tool').style.height)
    }

    function drawRectanglePositiveXNegativeY() {
      const width = parsePixels(endX - startX)
      const height = parsePixels(startY - endY)
      const top = parsePixels(endY)
      const left = parsePixels(startX)

      DOMTools.styleElement($('.selection_tool'), {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement($('.selection_tool_mask'), {
        clipPath: getPolygonVectorPoints(
          width,
          height,
          parsePixels(offsetY),
          parsePixels(offsetX - parseInt($('.selection_tool').style.width))
        )
      })

      selectionOriginCoordinates.x = offsetX - parseInt($('.selection_tool').style.width)
      selectionOriginCoordinates.y = offsetY
    }

    function drawRectangleNegativeXNegativeY() {
      const width = parsePixels(startX - endX)
      const height = parsePixels(startY - endY)
      const top = parsePixels(endY)
      const left = parsePixels(endX)

      DOMTools.styleElement($('.selection_tool'), {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement($('.selection_tool_mask'), {
        clipPath: getPolygonVectorPoints(
          width,
          height,
          parsePixels(offsetY),
          parsePixels(offsetX)
        )
      })

      selectionOriginCoordinates.x = offsetX
      selectionOriginCoordinates.y = offsetY
    }

    function drawRectangleNegativeXPositiveY() {
      const width = parsePixels(startX - endX)
      const height = parsePixels(endY - startY)
      const top = parsePixels(startY)
      const left = parsePixels(endX)

      DOMTools.styleElement($('.selection_tool'), {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement($('.selection_tool_mask'), {
        clipPath: getPolygonVectorPoints(
          width,
          height,
          parsePixels(offsetY - parseInt($('.selection_tool').style.height)),
          parsePixels(offsetX)
        )
      })

      selectionOriginCoordinates.x = offsetX
      selectionOriginCoordinates.y = offsetY - parseInt($('.selection_tool').style.height)
    }

    if (endX < startX && endY < startY) return drawRectangleNegativeXNegativeY()
    if (endX > startX && endY > startY) return drawRectanglePositiveXPositiveY()
    if (endX > startX && endY < startY) return drawRectanglePositiveXNegativeY()
    if (endX < startX && endY > startY) return drawRectangleNegativeXPositiveY()
  },
  mouseup(event) {
    isSelecting = false
    //show the crop button
    $('.selection_crop_btn').style.display = 'flex'
    $('.selection_cancel_btn').style.display = 'flex'
  }
}

Object.keys(events).forEach(key => {
  $('.image_preview').addEventListener(key, events[key])
})