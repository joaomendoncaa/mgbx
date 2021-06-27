const ImageSingleton = (() => {
  class Image {
    constructor() {
      this._data = null
      this._name = null
    }

    get data() { return this._data }
    get name() { return this._name }

    set data(data) { this._data = data }
    set name(name) { this._name = name }

    upload(imageData) {
      this.data = imageData
      this.name = imageData.name
    }
  }

  let imageInstance

  function createImage() {
    imageInstance = new Image()
    return imageInstance
  }

  return {
    getInstance: () => {
      if (!imageInstance) imageInstance = createImage()
      return imageInstance
    }
  }
})()

export default ImageSingleton