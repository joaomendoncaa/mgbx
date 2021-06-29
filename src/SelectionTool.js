import $ from './DomElements'
import DOMTools from './DomTools'
import Utils from './Utils'
import CanvasHistorySingleton from './CanvasHistory'
import CanvasSingleton from './Canvas'
import CanvasFilters from './CanvasFilters'

import '../styles/SelectionTool.scss'

const SelectionToolSingleton = (() => {
  class SelectionTool {
    constructor() {
      this._startX = 0
      this._startY = 0
      this._endX = 0
      this._endY = 0
      this._offsetX = 0
      this._offsetY = 0
      this._selectionOriginCoordinates = { x: 0, y: 0 }
      this._isSelecting = false

      $('.image_preview').addEventListener('mouseover', (e) => { this.mouseOver(e) })
      $('.image_preview').addEventListener('mousedown', (e) => { this.mouseDown(e) })
      $('.image_preview').addEventListener('mousemove', (e) => { this.mouseMove(e) })
      $('.image_preview').addEventListener('mouseup', (e) => { this.mouseUp(e) })

      $('.selection_cancel_btn').addEventListener('click', () => this.onClickSelectionCancelBtn())
      $('.selection_crop_btn').addEventListener('click', () => this.onClickSelectionCropBtn())
    }

    get startX() { return this._startX }
    get startY() { return this._startY }
    get endX() { return this._endX }
    get endY() { return this._endY }
    get offsetX() { return this._offsetX }
    get offsetY() { return this._offsetY }
    get selectionOriginCoordinates() { return this._selectionOriginCoordinates }
    get isSelecting() { return this._isSelecting }

    set startX(startX) { this._startX = startX }
    set startY(startY) { this._startY = startY }
    set endX(endX) { this._endX = endX }
    set endY(endY) { this._endY = endY }
    set offsetX(offsetX) { this._offsetX = offsetX }
    set offsetY(offsetY) { this._offsetY = offsetY }
    set selectionOriginCoordinates({ x, y }) { this._selectionOriginCoordinates = { x, y } }
    set isSelecting(isSelecting) { this._isSelecting = isSelecting }

    getPolygonVectorPoints(width, height, top, left) {
      const widthInt = parseInt(width)
      const heightInt = parseInt(height)
      const topInt = parseInt(top)
      const leftInt = parseInt(left)

      const topLeftCoords = [
        Utils.parsePixels(leftInt),
        Utils.parsePixels(topInt)
      ]
      const topRightCoords = [
        Utils.parsePixels(leftInt + widthInt),
        Utils.parsePixels(topInt)
      ]
      const bottomRightCoords = [
        Utils.parsePixels(leftInt + widthInt),
        Utils.parsePixels(topInt + heightInt)
      ]
      const bottomLeftCoords = [
        Utils.parsePixels(leftInt),
        Utils.parsePixels(topInt + heightInt)
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

    drawRectanglePositiveXPositiveY() {
      const width = Utils.parsePixels(this.endX - this.startX)
      const height = Utils.parsePixels(this.endY - this.startY)
      const top = Utils.parsePixels(this.startY)
      const left = Utils.parsePixels(this.startX)

      DOMTools.styleElement($('.selection_tool'), {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement($('.selection_tool_mask'), {
        clipPath: this.getPolygonVectorPoints(
          width,
          height,
          Utils.parsePixels(this.offsetY - parseInt($('.selection_tool').style.height)),
          Utils.parsePixels(this.offsetX - parseInt($('.selection_tool').style.width))
        )
      })

      this.selectionOriginCoordinates.x = this.offsetX - parseInt($('.selection_tool').style.width)
      this.selectionOriginCoordinates.y = this.offsetY - parseInt($('.selection_tool').style.height)
    }

    drawRectanglePositiveXNegativeY() {
      const width = Utils.parsePixels(this.endX - this.startX)
      const height = Utils.parsePixels(this.startY - this.endY)
      const top = Utils.parsePixels(this.endY)
      const left = Utils.parsePixels(this.startX)

      DOMTools.styleElement($('.selection_tool'), {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement($('.selection_tool_mask'), {
        clipPath: this.getPolygonVectorPoints(
          width,
          height,
          Utils.parsePixels(this.offsetY),
          Utils.parsePixels(this.offsetX - parseInt($('.selection_tool').style.width))
        )
      })

      this.selectionOriginCoordinates.x = this.offsetX - parseInt($('.selection_tool').style.width)
      this.selectionOriginCoordinates.y = this.offsetY
    }

    drawRectangleNegativeXNegativeY() {
      const width = Utils.parsePixels(this.startX - this.endX)
      const height = Utils.parsePixels(this.startY - this.endY)
      const top = Utils.parsePixels(this.endY)
      const left = Utils.parsePixels(this.endX)

      DOMTools.styleElement($('.selection_tool'), {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement($('.selection_tool_mask'), {
        clipPath: this.getPolygonVectorPoints(
          width,
          height,
          Utils.parsePixels(this.offsetY),
          Utils.parsePixels(this.offsetX)
        )
      })

      this.selectionOriginCoordinates.x = this.offsetX
      this.selectionOriginCoordinates.y = this.offsetY
    }

    drawRectangleNegativeXPositiveY() {
      const width = Utils.parsePixels(this.startX - this.endX)
      const height = Utils.parsePixels(this.endY - this.startY)
      const top = Utils.parsePixels(this.startY)
      const left = Utils.parsePixels(this.endX)

      DOMTools.styleElement($('.selection_tool'), {
        width,
        height,
        top,
        left
      })

      DOMTools.styleElement($('.selection_tool_mask'), {
        clipPath: this.getPolygonVectorPoints(
          width,
          height,
          Utils.parsePixels(this.offsetY - parseInt($('.selection_tool').style.height)),
          Utils.parsePixels(this.offsetX)
        )
      })

      this.selectionOriginCoordinates.x = this.offsetX
      this.selectionOriginCoordinates.y = this.offsetY - parseInt($('.selection_tool').style.height)
    }

    // windowMouseMoveListener(event) {
    //   this.mouseMove(event)
    // }

    mouseOver() {
      $('.image_preview').style.cursor = 'crosshair'
    }

    mouseDown(event) {
      const { clientX, clientY, offsetX, offsetY } = event

      this.startX = clientX
      this.startY = clientY

      this.selectionOriginCoordinates.x = offsetX
      this.selectionOriginCoordinates.y = offsetY

      this.hide()

      this.isSelecting = true

      // document.addEventListener('mousemove', this.windowMouseMoveListener.bind(this))

      // $('body').style.pointerEvents = 'none'
      // $('body').style.userSelect = 'none'
    }

    mouseMove(event) {
      if (!this.isSelecting) return

      this.endX = event.clientX
      this.endY = event.clientY

      let { offsetX, offsetY } = event
      this.offsetX = offsetX
      this.offsetY = offsetY

      $('.selection_tool').style.display = 'initial'

      DOMTools.styleElement($('.selection_tool_mask'), {
        display: 'initial',
        width: Utils.parsePixels($('.image_preview').width),
        height: Utils.parsePixels($('.image_preview').height)
      })

      if (this.endX < this.startX && this.endY < this.startY) return this.drawRectangleNegativeXNegativeY()
      if (this.endX > this.startX && this.endY > this.startY) return this.drawRectanglePositiveXPositiveY()
      if (this.endX > this.startX && this.endY < this.startY) return this.drawRectanglePositiveXNegativeY()
      if (this.endX < this.startX && this.endY > this.startY) return this.drawRectangleNegativeXPositiveY()
    }

    mouseUp(event) {
      this.isSelecting = false
      $('.selection_tool_controls').style.display = 'flex'
    }

    onClickSelectionCancelBtn() {
      this.hide()
    }

    onClickSelectionCropBtn() {
      const canvas = CanvasSingleton.getInstance()
      const canvasHistory = CanvasHistorySingleton.getInstance()
      const filters = CanvasFilters.getInstance()

      const croppedData = canvas.cropImage()

      canvasHistory.addSnapshot({
        action: 'Cropped image',
        canvasData: {
          image: croppedData.image,
          width: croppedData.width,
          height: croppedData.height
        },
        selectionData: null,
        filtersString: filters.getFiltersString(),
        isUpload: false
      })
    }

    show() {
      DOMTools.elementVisibility([
        $('.selection_tool'),
        $('.selection_tool_mask'),
        $('.selection_tool_controls')
      ], 'initial')
    }

    hide() {
      DOMTools.elementVisibility([
        $('.selection_tool'),
        $('.selection_tool_mask'),
        $('.selection_tool_controls')
      ], 'none')
    }
  }//SelectionTool()

  let selectionToolInstance

  function createSelectionTool() {
    selectionToolInstance = new SelectionTool()
    return selectionToolInstance
  }

  return {
    getInstance: () => {
      if (!selectionToolInstance) selectionToolInstance = createSelectionTool()
      return selectionToolInstance
    }
  }
})()

export default SelectionToolSingleton