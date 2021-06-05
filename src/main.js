import Toast from './Toast'
import CanvasFilters from './CanvasFilters'
import DomTools from './DomTools'
import Canvas from './Canvas'

import DOM from './DomElements'

import '../styles/main.scss'

const toast = new Toast()
const tools = new DomTools()
const filters = new CanvasFilters()

//Global Variables
let canvas = document.createElement('canvas')
let ctx = canvas.getContext('2d')
let startX
let startY
let selectionOriginCoordinates = {
  x: 0,
  y: 0
}
let isSelecting = false
let image
let imageName


//When an image is uploaded using the file input
DOM['toolbar_upload_input'].addEventListener('change', () => {
  //get the file
  let file = DOM['toolbar_upload_input'].files[0]
  tools.changeTextOnElement(file.name, DOM['main_header_span'])
  imageName = file.name
  //read the file
  let reader = new FileReader()
  reader.readAsDataURL(file)
  //get's the event of loading the image to the reader and makes it the src of the img on the DOM
  reader.onload = (event) => {
    image = new Image()
    image.src = event.target.result
    image.onload = onLoadImage

    tools.elementVisibility([
      DOM['toolbar_upload_btn']
    ], 'none')

    tools.elementVisibility([
      DOM['toolbar_save_btn'],
      DOM['toolbar_clear_btn']
    ], 'flex')
  }
})

//simulate the click on the input type file whenever the user clicks on the btnSelectImage
DOM['toolbar_upload_btn'].onclick = () => {
  DOM['toolbar_upload_input'].click()
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

    function drawRectanglePositiveXPositiveY() {
      DOM['selection_tool'].style.width = (endX - startX) + 'px'
      DOM['selection_tool'].style.height = (endY - startY) + 'px'
      DOM['selection_tool'].style.left = startX + 'px'
      DOM['selection_tool'].style.top = startY + 'px'

      selectionOriginCoordinates.x = offsetX - Number(DOM['selection_tool'].style.width.replace('px', ''))
      selectionOriginCoordinates.y = offsetY - Number(DOM['selection_tool'].style.height.replace('px', ''))
    }

    function drawRectanglePositiveXNegativeY() {
      DOM['selection_tool'].style.width = (endX - startX) + 'px'
      DOM['selection_tool'].style.height = (startY - endY) + 'px'
      DOM['selection_tool'].style.left = startX + 'px'
      DOM['selection_tool'].style.top = endY + 'px'

      selectionOriginCoordinates.x = offsetX - Number(DOM['selection_tool'].style.width.replace('px', ''))
      selectionOriginCoordinates.y = offsetY
    }

    function drawRectangleNegativeXNegativeY() {
      DOM['selection_tool'].style.width = (startX - endX) + 'px'
      DOM['selection_tool'].style.height = (startY - endY) + 'px'
      DOM['selection_tool'].style.left = endX + 'px'
      DOM['selection_tool'].style.top = endY + 'px'

      selectionOriginCoordinates.x = offsetX
      selectionOriginCoordinates.y = offsetY
    }

    function drawRectangleNegativeXPositiveY() {
      DOM['selection_tool'].style.width = (startX - endX) + 'px'
      DOM['selection_tool'].style.height = (endY - startY) + 'px'
      DOM['selection_tool'].style.left = endX + 'px'
      DOM['selection_tool'].style.top = startY + 'px'

      selectionOriginCoordinates.x = offsetX
      selectionOriginCoordinates.y = offsetY - Number(DOM['selection_tool'].style.height.replace('px', ''))
    }

    if (endX < startX && endY < startY) {
      drawRectangleNegativeXNegativeY()
      return
    }

    if (endX > startX && endY > startY) {
      drawRectanglePositiveXPositiveY()
      return
    }

    if (endX > startX && endY < startY) {
      drawRectanglePositiveXNegativeY()
      return
    }

    if (endX < startX && endY > startY) {
      drawRectangleNegativeXPositiveY()
      return
    }

  },
  mouseup(event) {
    isSelecting = false
    //show the crop button
    DOM['selection_crop_btn'].style.display = 'flex'
  }
}

Object.keys(events).forEach(key => {
  DOM['image_preview'].addEventListener(key, events[key])
})


const onLoadImage = () => {
  canvas.width = image.width
  canvas.height = image.height

  //clear the context
  ctx.clearRect(0, 0, image.width, image.height)

  ctx.drawImage(image, 0, 0)

  DOM['image_preview'].style.display = 'initial'
  DOM['image_preview'].src = canvas.toDataURL()
}

DOM['selection_crop_btn'].onclick = () => {
  const { width: imageWidth, height: imageHeight } = image
  const { width: previewImageWidth, height: previewImageHeight } = DOM['image_preview']

  const [widthRatio, heightRatio] = [
    Number(imageWidth / previewImageWidth),
    Number(imageHeight / previewImageHeight)
  ]

  const [selectionWidth, selectionHeight] = [
    Number(DOM['selection_tool'].style.width.replace('px', '')),
    Number(DOM['selection_tool'].style.height.replace('px', ''))
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
  const croppedImage = ctx.getImageData(
    actualX,
    actualY,
    croppedWidth,
    croppedHeight
  )

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

  //show save image button
  DOM['toolbar_clear_btn'].style.display = 'flex'
  DOM['toolbar_save_btn'].style.display = 'flex'
  DOM['selection_crop_btn'].style.display = 'none'
}

DOM['toolbar_save_btn'].onclick = () => {
  const a = document.createElement('a')
  a.download = imageName.split('.').join("") + '-cropped.jpeg'
  a.href = canvas.toDataURL()
  a.click()
}

DOM['toolbar_clear_btn'].onclick = () => {
  //clear the context and erase the image selected
  ctx.clearRect(0, 0, ctx.width, ctx.height)
  DOM['selection_tool'].style.display = 'none'
  DOM['image_preview'].src = ''

  DOM['main_header_span'].textContent = 'No Image uploaded'

  //remove all the elements needed
  DOM['image_preview'].style.display = 'none'
  DOM['toolbar_clear_btn'].style.display = 'none'
  DOM['selection_crop_btn'].style.display = 'none'
  DOM['toolbar_save_btn'].style.display = 'none'

  //add upload button back in
  DOM['toolbar_upload_btn'].style.display = 'flex'
}