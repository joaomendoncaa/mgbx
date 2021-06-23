export default {
  parsePixels: (integer) => `${integer}px`,
  timestampToDateTime: (timestamp) => new Date(timestamp).toLocaleTimeString("en-EN"),
  arrayLastIndex: (arr) => arr.length - 1
}