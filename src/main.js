import Toast from './Toast.js'
import CanvasFilters from './CanvasFilters.js'

//styles
import '../styles/main.scss'

const toast = new Toast();
toast.displayMessage('hello world', 3000)

//------------Dom Elements-------------//

//Toolbar upload image Button 
const toolbar_upload_btn = document.querySelector('.toolbar_upload_btn')
const toolbar_upload_input = document.querySelector('.toolbar_upload_input')
//Toolbar save image button
const toolbar_save_btn = document.querySelector('.toolbar_save_btn')
//Toolbar crop selection button
const toolbar_clear_btn = document.querySelector('.toolbar_clear_btn')
//Crop button
const selection_crop_btn = document.querySelector('.selection_crop_btn')
//Canvas
const image_preview = document.querySelector('.image_preview')
const selection_tool = document.querySelector('.selection_tool')
//Header span
const main_header_span = document.querySelector('.main_header_span')

const filterSection = document.querySelector('.menu-right-filters')
const filterSelectForm = document.getElementById('filter-select-form')
const filterSelect = document.getElementById('filter-select')

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


const tools = {
  /**
   * Creates an element with set children and set attributes, in the end
   * appends it to the element given in the arguments
   * @param {string} elementType is a string defining the html element to create
   * @param {string} elementInnerHTML is a string that defines the HTML inside the 
   * element created (can be any HTML) 
   * TODO:Protect the innerHTML for dangerous code
   * @param {array} elementAttributes is a list where each item is an array with 2 items
   * first item is a element attribute type string, second one the attribute value also 
   * as a string
   * @param {HTMLElement} elementToAppendTo is a HTML element that will be father to the 
   * element created 
   * @returns {HTMLElement} the function returns the HTML element created
   */
  createElement: (elementType, elementInnerHTML = '', elementAttributes, elementToAppendTo) => {
    const element = document.createElement(elementType)
    element.innerHTML = elementInnerHTML
    elementAttributes.forEach(atribute => {
      element.setAttribute(`${atribute[0]}`, `${atribute[1]}`)
    })
    elementToAppendTo.append(element)
    return element
  },
  changeTextOnElement: (text, element) => {
    element.textContent = text
  },
  elementVisibility: (elementsArray, displayMode = 'flex') => {
    elementsArray.forEach(element => {
      element.style.display = displayMode
    })
  }
}

//When an image is uploaded using the file input
toolbar_upload_input.addEventListener('change', () => {
  //get the file
  let file = toolbar_upload_input.files[0]
  tools.changeTextOnElement(file.name, main_header_span)
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
      toolbar_upload_btn
    ], 'none')
  }
})

//simulate the click on the input type file whenever the user clicks on the btnSelectImage
toolbar_upload_btn.onclick = () => {
  toolbar_upload_input.click()
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

    selection_tool.style.display = 'initial'

    function drawRectanglePositiveXPositiveY() {
      selection_tool.style.width = (endX - startX) + 'px'
      selection_tool.style.height = (endY - startY) + 'px'
      selection_tool.style.left = startX + 'px'
      selection_tool.style.top = startY + 'px'

      selectionOriginCoordinates.x = offsetX - Number(selection_tool.style.width.replace('px', ''))
      selectionOriginCoordinates.y = offsetY - Number(selection_tool.style.height.replace('px', ''))
    }

    function drawRectanglePositiveXNegativeY() {
      selection_tool.style.width = (endX - startX) + 'px'
      selection_tool.style.height = (startY - endY) + 'px'
      selection_tool.style.left = startX + 'px'
      selection_tool.style.top = endY + 'px'

      selectionOriginCoordinates.x = offsetX - Number(selection_tool.style.width.replace('px', ''))
      selectionOriginCoordinates.y = offsetY
    }

    function drawRectangleNegativeXNegativeY() {
      selection_tool.style.width = (startX - endX) + 'px'
      selection_tool.style.height = (startY - endY) + 'px'
      selection_tool.style.left = endX + 'px'
      selection_tool.style.top = endY + 'px'

      selectionOriginCoordinates.x = offsetX
      selectionOriginCoordinates.y = offsetY
    }

    function drawRectangleNegativeXPositiveY() {
      selection_tool.style.width = (startX - endX) + 'px'
      selection_tool.style.height = (endY - startY) + 'px'
      selection_tool.style.left = endX + 'px'
      selection_tool.style.top = startY + 'px'

      selectionOriginCoordinates.x = offsetX
      selectionOriginCoordinates.y = offsetY - Number(selection_tool.style.height.replace('px', ''))
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
    selection_crop_btn.style.display = 'flex'
  }
}

Object.keys(events).forEach(key => {
  image_preview.addEventListener(key, events[key])
})


const onLoadImage = () => {
  canvas.width = image.width
  canvas.height = image.height

  //clear the context
  ctx.clearRect(0, 0, image.width, image.height)

  ctx.drawImage(image, 0, 0)

  image_preview.style.display = 'initial'
  image_preview.src = canvas.toDataURL()
}

const scale = 0.5;

selection_crop_btn.onclick = () => {
  const { width: imageWidth, height: imageHeight } = image
  const { width: previewImageWidth, height: previewImageHeight } = image_preview
  // const [previewImageWidth, previewImageHeight] = [
  //     (((1 * imagePreview.width) / scale) - (imagePreview.width * scale)),
  //     (((1 * imagePreview.height) / scale) - (imagePreview.width * scale))
  // ]

  const [widthRatio, heightRatio] = [
    Number(imageWidth / previewImageWidth),
    Number(imageHeight / previewImageHeight)
  ]

  const [selectionWidth, selectionHeight] = [
    Number(selection_tool.style.width.replace('px', '')),
    Number(selection_tool.style.height.replace('px', ''))
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
  selection_tool.style.display = 'none'

  //update the imagePreview
  image_preview.src = canvas.toDataURL()

  //show save image button
  toolbar_clear_btn.style.display = 'flex'
  toolbar_save_btn.style.display = 'flex'
  selection_crop_btn.style.display = 'none'
}

toolbar_save_btn.onclick = () => {
  const a = document.createElement('a')
  a.download = imageName.split('.').join("") + '-cropped.jpeg'
  a.href = canvas.toDataURL()
  a.click()
}

toolbar_clear_btn.onclick = () => {
  //clear the context and erase the image selected
  ctx.clearRect(0, 0, ctx.width, ctx.height)
  selection_tool.style.display = 'none'
  image_preview.src = ''

  //remove all the elements needed
  image_preview.style.display = 'none'
  toolbar_clear_btn.style.display = 'none'
  selection_crop_btn.style.display = 'none'
  toolbar_save_btn.style.display = 'none'

  //turn on the no image warning
  noImage.style.display = "flex"
}

function createFilter(filter) {
  //generates the filter interface in the DOM
  tools.createElement(
    'div',
    `
            <div class="filter-header">
                <span class="filter-span">
                    <img class="filter-icon" src="src/img/filter-icons/icon-${filter}.svg" alt="${filter} Icon">
                    ${filter}
                </span>
                <button class="remove-filter-btn" id="remove-filter-${filter}">
                    <img src="src/img/icons/icon-remove-filter.svg" alt="Remove Icon" class="remove-filter-svg">
                </button>
            </div>
            <input type="range" min="1" max="100" value="50" id="${filter}" class="filter-input"/>
        `,
    [
      ['class', 'filter-wrapper'],
      ['id', `filter-wrapper-${filter}`]
    ],
    filterSection
  )

  //Get the element in the DOM
  setBehaviourToAllFilters()

  //Add Listeners to change the values of the picture
  //whenever the filter is added listen to their value changes
  // sepiaControls.addEventListener('input', event => {
  //     brightness.changeValue(event.target.value)
  //     applyFilter(event.target.id, ctx)
  // })
}

function setBehaviourToAllFilters() {
  const filterWrappers = document.querySelectorAll('.filter-wrapper')
  const filtersRemoveBtn = document.querySelectorAll('.remove-filter-btn')

  filtersRemoveBtn.forEach(button => {
    button.addEventListener('click', event => {
      console.log(event.target.parentElement.id)
    })
  })
}

function removeFilter(filter) {
  console.log('remove filter')
}

function applyFilter(filterName, context) {

  // console.log('apply filter was called')

  // ctx.clearRect(0, 0, image.width, image.height)

  image_preview.style.filter = brightness.applyFilter()

  //draw image with new filter
  // context.filter = brightness.applyFilter()
  // ctx.drawImage(image, 0, 0)
  // imagePreview.src = canvas.toDataURL()
}