import Toast from './Toast'
import DOMTools from './DomTools'
import DOM from './DomElements'
import Canvas from './Canvas'
import ImageUploaded from './ImageUploaded'
import Header from './Header'


import '../styles/main.scss'

class App {
  constructor() {
    this._image = null
    this._canvas = null
    this._header = new Header()
    this._toast = new Toast()

    this.__init__()
  }

  get canvas() {
    return this._canvas
  }

  get image() {
    return this._image
  }

  set canvas(canvas) {
    this._canvas = canvas
  }

  set image(image) {
    this._image = image
  }

  onLoadImageFromReader() {
    this.canvas = new Canvas(this.image)

    this.canvas.width = this.image.width
    this.canvas.height = this.image.height

    this.canvas.ctx.clearRect(0, 0, this.image.width, this.image.height)

    this.canvas.ctx.drawImage(this.image, 0, 0)

    console.log(this.canvas)

    DOM['image_preview'].style.display = 'initial'
    DOM['image_preview'].src = this.canvas.toDataURL()
  }

  onChangeToolbarUploadInput() {
    const imageUploaded = DOM['toolbar_upload_input'].files[0]

    this.image = new ImageUploaded(imageUploaded)

    DOMTools.changeTextOnElement(this.image.name, DOM['main_header_span'])

    let reader = new FileReader()
    reader.readAsDataURL(this.image.getBlob())

    reader.addEventListener('load', (event) => {
      this.image = new Image()
      this.image.src = event.target.result
      this.image.addEventListener('load', this.onLoadImageFromReader.bind(this))

      DOMTools.elementVisibility([
        DOM['toolbar_upload_btn']
      ], 'none')

      DOMTools.elementVisibility([
        DOM['toolbar_save_btn'],
        DOM['toolbar_clear_btn'],
        DOM['effects_wrapper'],
        DOM['presets_wrapper']
      ], 'flex')
    })
  }

  onClickToolbarUploadBtn() {
    DOM['toolbar_upload_input'].click()
  }

  onClickSelectionCancelBtn() {
    DOMTools.elementVisibility([
      DOM['selection_tool'],
      DOM['selection_tool_mask'],
      DOM['selection_crop_btn'],
      DOM['selection_cancel_btn'],
    ], 'none')
  }

  onClickEffectsHeaderResetBtn() {
    this.canvas.resetAllFilters()
  }

  onClickSelectionCropBtn() {
    const imageWidth = this.image.width
    const imageHeight = this.image.height

    const { width: previewImageWidth, height: previewImageHeight } = DOM['image_preview']

    //get the aspect ratio of the image
    const [widthRatio, heightRatio] = [
      Number(imageWidth / previewImageWidth),
      Number(imageHeight / previewImageHeight)
    ]

    const [selectionWidth, selectionHeight] = [
      parseInt(DOM['selection_tool'].style.width),
      parseInt(DOM['selection_tool'].style.height)
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
    const croppedImage = this.ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight)

    //delete canvas context
    ctx.clearRect(0, 0, ctx.width, ctx.height)

    //ajust propotions to the new image
    image.width = canvas.width = croppedWidth
    image.height = canvas.height = croppedHeight

    //add the cropped image to the context
    ctx.putImageData(croppedImage, 0, 0)

    //hide the selection tool
    DOM['selection_tool'].style.display = 'none'

    //update the imagePreview
    DOM['image_preview'].src = canvas.toDataURL()

    //show Elements
    DOM['toolbar_clear_btn'].style.display = 'flex'
    DOM['toolbar_save_btn'].style.display = 'flex'

    //Hide elements
    DOM['selection_crop_btn'].style.display = 'none'
    DOM['selection_tool_mask'].style.display = 'none'
  }

  onClickToolbarSaveBtn() {
    const a = document.createElement('a')
    a.download = this.image.name.split('.').join("") + '-cropped.jpeg'
    a.href = canvas.toDataURL()
    a.click()
  }

  onClickToolbarClearBtn() {
    //clear the context and erase the image selected
    this.canvas.ctx.clearRect(0, 0, this.canvas.ctx.width, this.canvas.ctx.height)

    DOM['selection_tool'].style.display = 'none'
    DOM['image_preview'].src = ''

    DOM['main_header_span'].textContent = 'No Image uploaded'

    //remove all the elements needed
    DOM['image_preview'].style.display = 'none'
    DOM['toolbar_clear_btn'].style.display = 'none'
    DOM['selection_crop_btn'].style.display = 'none'
    DOM['toolbar_save_btn'].style.display = 'none'
    DOM['selection_tool_mask'].style.display = 'none'

    //add upload button back in
    DOM['toolbar_upload_btn'].style.display = 'flex'
  }

  //on app init
  __init__() {
    DOM['toolbar_upload_btn'].addEventListener('click', () => this.onClickToolbarUploadBtn())
    DOM['toolbar_upload_input'].addEventListener('change', () => this.onChangeToolbarUploadInput())
    DOM['selection_cancel_btn'].addEventListener('click', () => this.onClickSelectionCancelBtn())
    DOM['effects_header_reset_btn'].addEventListener('click', () => this.onClickEffectsHeaderResetBtn())
    DOM['selection_crop_btn'].addEventListener('click', () => this.onClickSelectionCropBtn())
    DOM['toolbar_save_btn'].addEventListener('click', () => this.onClickToolbarSaveBtn())
    DOM['toolbar_clear_btn'].addEventListener('click', () => this.onClickToolbarClearBtn())
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

    DOM['selection_tool'].style.display = 'initial'

    DOMTools.styleElement(DOM['selection_tool_mask'], {
      display: 'initial',
      width: parsePixels(DOM['image_preview'].width),
      height: parsePixels(DOM['image_preview'].height)
    })

    function drawRectanglePositiveXPositiveY() {
      const width = parsePixels(endX - startX)
      const height = parsePixels(endY - startY)
      const top = parsePixels(startY)
      const left = parsePixels(startX)

      DOMTools.styleElement(DOM['selection_tool'], {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement(DOM['selection_tool_mask'], {
        clipPath: getPolygonVectorPoints(
          width,
          height,
          parsePixels(offsetY - parseInt(DOM['selection_tool'].style.height)),
          parsePixels(offsetX - parseInt(DOM['selection_tool'].style.width))
        )
      })

      selectionOriginCoordinates.x = offsetX - parseInt(DOM['selection_tool'].style.width)
      selectionOriginCoordinates.y = offsetY - parseInt(DOM['selection_tool'].style.height)
    }

    function drawRectanglePositiveXNegativeY() {
      const width = parsePixels(endX - startX)
      const height = parsePixels(startY - endY)
      const top = parsePixels(endY)
      const left = parsePixels(startX)

      DOMTools.styleElement(DOM['selection_tool'], {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement(DOM['selection_tool_mask'], {
        clipPath: getPolygonVectorPoints(
          width,
          height,
          parsePixels(offsetY),
          parsePixels(offsetX - parseInt(DOM['selection_tool'].style.width))
        )
      })

      selectionOriginCoordinates.x = offsetX - parseInt(DOM['selection_tool'].style.width)
      selectionOriginCoordinates.y = offsetY
    }

    function drawRectangleNegativeXNegativeY() {
      const width = parsePixels(startX - endX)
      const height = parsePixels(startY - endY)
      const top = parsePixels(endY)
      const left = parsePixels(endX)

      DOMTools.styleElement(DOM['selection_tool'], {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement(DOM['selection_tool_mask'], {
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

      DOMTools.styleElement(DOM['selection_tool'], {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement(DOM['selection_tool_mask'], {
        clipPath: getPolygonVectorPoints(
          width,
          height,
          parsePixels(offsetY - parseInt(DOM['selection_tool'].style.height)),
          parsePixels(offsetX)
        )
      })

      selectionOriginCoordinates.x = offsetX
      selectionOriginCoordinates.y = offsetY - parseInt(DOM['selection_tool'].style.height)
    }

    if (endX < startX && endY < startY) return drawRectangleNegativeXNegativeY()
    if (endX > startX && endY > startY) return drawRectanglePositiveXPositiveY()
    if (endX > startX && endY < startY) return drawRectanglePositiveXNegativeY()
    if (endX < startX && endY > startY) return drawRectangleNegativeXPositiveY()
  },
  mouseup(event) {
    isSelecting = false
    //show the crop button
    DOM['selection_crop_btn'].style.display = 'flex'
    DOM['selection_cancel_btn'].style.display = 'flex'
  }
}

Object.keys(events).forEach(key => {
  DOM['image_preview'].addEventListener(key, events[key])
})