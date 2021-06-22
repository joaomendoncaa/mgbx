export default {
  parsePixels: (integer) => {
    return `${integer}px`
  },
  timestampToDateTime: (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-EN")
  }
}