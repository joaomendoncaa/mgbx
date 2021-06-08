import Toast from './Toast'
import CanvasFilters from './CanvasFilters'
import DomTools from './DomTools'
import Canvas from './Canvas'

import DOM from './DomElements'

import '../styles/main.scss'

const toast = new Toast()
const DOMTools = new DomTools()
const filters = new CanvasFilters()

toast.putMessage('Low priority', 3000, 'low')
toast.putMessage('High priority', 3000, 'high')
toast.putMessage('Normal priority', 3000, 'normal')

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
  DOMTools.changeTextOnElement(file.name, DOM['main_header_span'])
  imageName = file.name
  //read the file
  let reader = new FileReader()
  reader.readAsDataURL(file)
  //get's the event of loading the image to the reader and makes it the src of the img on the DOM
  reader.onload = (event) => {
    image = new Image()
    image.src = event.target.result
    image.onload = onLoadImage

    DOMTools.elementVisibility([
      DOM['toolbar_upload_btn']
    ], 'none')

    DOMTools.elementVisibility([
      DOM['toolbar_save_btn'],
      DOM['toolbar_clear_btn']
    ], 'flex')
  }
})

//simulate the click on the input type file whenever the user clicks on the btnSelectImage
DOM['toolbar_upload_btn'].onclick = () => {
  DOM['toolbar_upload_input'].click()
}

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
      selectionOriginCoordinates.y = offsetX - parseInt(DOM['selection_tool'].style.width) - parseInt(DOM['selection_tool'].style.height)
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

//Crop button is clicked to crop the image selected
DOM['selection_crop_btn'].onclick = () => {
  const { width: imageWidth, height: imageHeight } = image
  const { width: previewImageWidth, height: previewImageHeight } = DOM['image_preview']

  //get the aspect ratio of the image
  const [widthRatio, heightRatio] = [
    Number(imageWidth / previewImageWidth),
    Number(imageHeight / previewImageHeight)
  ]

  // console.log("Valores", {
  //   parseInt: {
  //     value: parseInt(DOM['selection_tool'].style.width),
  //     type: typeof parseInt(DOM['selection_tool'].style.width)
  //   },
  //   replaceMethod: {
  //     value: Number(DOM['selection_tool'].style.width.replace('px', '')),
  //     type: typeof Number(DOM['selection_tool'].style.width.replace('px', ''))
  //   }
  // })

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
  const croppedImage = ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight)

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
  DOM['selection_tool_mask'].style.display = 'none'

  //add upload button back in
  DOM['toolbar_upload_btn'].style.display = 'flex'
}