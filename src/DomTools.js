/**
 * DomTools is a class for utility functions for manipulating the DOM
 */
class DomTools {
  generateRandomClassPrefix(prefixLength) {
    let finalClassPrefix = ''

    const letters = ['i', 'I', 'm', 'M', 'a', 'A', 'g', 'G', 'e', 'E', 'b', 'B', 'o', 'O', 'x', 'X']

    for (let i = 0; i < prefixLength; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length)
      finalClassPrefix += letters[randomIndex]
    }

    return finalClassPrefix
  }
  styleElement(element, styleMap) {
    if (!element) throw new Error('Element doens\'t exist')
    const styleAttributesList = Object.keys(styleMap)
    styleAttributesList.forEach(attribute => {
      element.style[attribute] = styleMap[attribute]
    })
  }
  styleElements(elementsList, styleMap) {
    if (!elementsList || elementsList.length < 1) throw new Error('You need to specify at least 1 element')
    elementsList.forEach(element => {
      if (!element) throw new Error('Element doens\'t exist')
      const styleAttributesList = Object.keys(styleMap)
      styleAttributesList.forEach(attribute => {
        element.style[attribute] = styleMap[attribute]
      })
    })
  }
  /**
     * Creates an element with set children and set attributes, in the end
     * appends it to the element given in the arguments
     * @param {string} type is a string defining the html element to create
     * @param {string} innerHtml is a string that defines the HTML inside the 
     * element created (can be any HTML) 
     * TODO:Protect the innerHTML for dangerous code
     * @param {array} attributesMap is a list where each item is an array with 2 items
     * first item is a element attribute type string, second one the attribute value also 
     * as a string
     * @param {HTMLElement} parent is a HTML element that will be father to the 
     * element created 
     * @returns {HTMLElement} the function returns the HTML element created
     */
  createElement(type, innerHtml = '', attributesMap, parent) {
    //instantiates the element on DOM
    const element = document.createElement(type)
    //set's the inner HTML inside the instantiated element
    element.innerHTML = innerHtml
    //
    this.styleElement(element, attributesMap)
    parent.append(element)
    //returns the element created
    return element
  }

  changeTextOnElement(text, element) {
    try {
      element.textContent = text
    } catch (err) {
      console.log(err)
      return err
    }
  }

  elementVisibility(elementsList, displayMode = 'flex') {
    elementsList.forEach(element => {
      element.style.display = displayMode
    })
  }
}

export default DomTools