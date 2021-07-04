import themes from './Themes'
import $ from './DomElements'

const ThemeSwitcherSingleton = (() => {
  class ThemeSwitcher {
    constructor() {
      this._themes = themes
      this._default = 'light'
      this._current = {}
      this._styleElement = null

      this.__init__()
    }

    get themes() { return this._themes }
    get default() { return this._default }
    get current() { return this._current }
    get styleElement() { return this._styleElement }

    set current(current) { this._current = current }
    set styleElement(styleElement) { this._styleElement = styleElement }

    saveThemeKeyLocally(themeKey) {
      localStorage.setItem('theme', themeKey)
    }

    getSavedTheme() {
      const themeKey = localStorage.getItem('theme')

      if (!themeKey) {
        this.saveThemeKeyLocally(this.default)
        this.current = this.themes[this.default]
        return this.default
      }

      this.current = this.themes[themeKey]

      return themeKey
    }

    generateStyleStringFromThemeObject(themeKey) {
      const theme = this.themes[themeKey]
      let styleString = ''
      Object.keys(theme).forEach(cssVariable => styleString += `${cssVariable}: ${theme[cssVariable]};\n`)
      return styleString
    }

    changeTheme(themeKey) {
      if (!this.themes.hasOwnProperty(themeKey)) throw new Error('Theme given is not available')

      this.saveThemeKeyLocally(themeKey)
      const styleString = this.generateStyleStringFromThemeObject(themeKey)
      this.setStyleOnDOM(styleString)
    }

    setStyleOnDOM(styleString) {
      this.styleElement.innerHTML = /*HTML*/`
        :root {
          ${styleString}
        }
      `
    }

    __init__() {
      const savedThemeKey = this.getSavedTheme()
      $('head').insertAdjacentHTML('afterbegin', /*HTML*/`
        <style id="current-theme-variables">
        </style>
      `)
      this.styleElement = $('#current-theme-variables')
      this.changeTheme(savedThemeKey)
    }
  }

  let themeSwitcherInstance

  function createThemeSwitcher() {
    themeSwitcherInstance = new ThemeSwitcher()
    return themeSwitcherInstance
  }

  return {
    getInstance: () => {
      if (!themeSwitcherInstance) themeSwitcherInstance = createThemeSwitcher()
      return themeSwitcherInstance
    }
  }
})()

export default ThemeSwitcherSingleton