class ImageUploaded {
  constructor(image) {
    this._image = image
    this._imageName = ''

    this.__init__()
  }

  get image() { return this._image }

  get imageName() { return this._imageName }

  set imageName(name) { this._imageName = name }

  getBlob() { return this.image }

  getName() { return this._imageName }

  __init__() {
    this.imageName = this.image.name
  }
}

export default ImageUploaded