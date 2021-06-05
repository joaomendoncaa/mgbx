/**
 * DomTools is a class for utility functions for manipulating the DOM
 */
class DomTools {
  styleElement(element, styleDictionary) {
    if (!element) throw new Error('Element doens\'t exist')
    const styleAttributes = Object.keys(styleDictionary)
    styleAttributes.forEach(attribute => {
      element.style[attribute] = styleDictionary[attribute]
    })
  }
  /**
     * Creates an element with set children and set attributes, in the end
     * appends it to the element given in the arguments
     * @param {string} type is a string defining the html element to create
     * @param {string} innerHtml is a string that defines the HTML inside the 
     * element created (can be any HTML) 
     * TODO:Protect the innerHTML for dangerous code
     * @param {array} attributesDictionary is a list where each item is an array with 2 items
     * first item is a element attribute type string, second one the attribute value also 
     * as a string
     * @param {HTMLElement} parent is a HTML element that will be father to the 
     * element created 
     * @returns {HTMLElement} the function returns the HTML element created
     */
  createElement(type, innerHtml = '', attributesDictionary, parent) {
    //instantiates the element on DOM
    const element = document.createElement(type)
    //set's the inner HTML inside the instantiated element
    element.innerHTML = innerHtml
    //
    this.styleElement(element, attributesDictionary)
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

  elementVisibility(elementsArray, displayMode = 'flex') {
    elementsArray.forEach(element => {
      element.style.display = displayMode
    })
  }
}

export default DomTools