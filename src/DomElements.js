/**
 * A function to make dom elements selection more "sugary" syntactically
 * @param {string} cssSelector accepts any css selector
 * @param {boolean} selectAllNodes accepts true || false for selecting 1 node or all nodes in the dom
 * @return {Node || NodeList} returns a node or a nodelist depending on the @selectAllNodes param
 */
export default (cssSelector, selectAllNodes = false) => {
  return selectAllNodes === false ? document.querySelector(cssSelector) : document.querySelectorAll(cssSelector)
}