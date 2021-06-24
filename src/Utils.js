export default {
  parsePixels: (integer) => `${integer}px`,
  timestampToDateTime: (timestamp) => new Date(timestamp).toLocaleTimeString("en-EN"),
  arrayLastIndex: (arr) => arr.length - 1,
  capitalizeFirstLetter: (string) => {
    const lowerCaseString = string.toLowerCase()
    const upperCaseFirstLetter = lowerCaseString.charAt(0).toUpperCase()
    const stringRemainign = lowerCaseString.slice(1)
    return upperCaseFirstLetter + stringRemainign
  }
}