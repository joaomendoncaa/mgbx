import icons from './SvgIcons'
import ThemeSwitcherSingleton from "./ThemeSwitcher"
import $ from './DomElements'

import '../styles/Settings.scss'

class Settings {
  constructor() {
    this._settingsButtonElement = $('.toolbar_settings_btn')
    this._themeSwitcher = ThemeSwitcherSingleton.getInstance()

    this.__init__()
  }

  get settingsButtonElement() { return this._settingsButtonElement }
  get themeSwitcher() { return this._themeSwitcher }

  show() { }
  hide() { }

  changeHeaderTitle(tabString) {
    $('.settings_header_title').innerHTML = /*HTML*/`
      <strong>Settings</strong> / ${tabString}
    `
  }

  setTab(tabString) {
    this.changeHeaderTitle(tabString)
  }

  __init__() {
    $('body').inserAdjacentHTML('beforeend', /*HTML*/`
        <section class="settings_wrapper">
          <div class="settings_container">
              <header class="settings_header">
                <span class="settings_header_title"></span>
                <button class="settings_header_button_exit">
                  ${icons.cross}
                </button>
              </header>
              <main class="settings_main">
                <nav class="settings_main_nav">
                  <a class="settings_main_nav_anchor_appearance">Appearance</a>
                  <a class="settings_main_nav_anchor_shortcuts">Shortcuts</a>
                </nav>
              </main>
          </div>  
        </section>
    `)
  }
}

export default Settings