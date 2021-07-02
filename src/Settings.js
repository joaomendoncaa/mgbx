import icons from './SvgIcons'
import ThemeSwitcherSingleton from "./ThemeSwitcher"
import $ from './DomElements'
import Utils from './Utils'

import '../styles/Settings.scss'

class Settings {
  constructor() {
    this._settingsButtonElement = $('.toolbar_settings_btn')
    this._themeSwitcher = ThemeSwitcherSingleton.getInstance()

    this.__init__()
  }

  get settingsButtonElement() { return this._settingsButtonElement }
  get themeSwitcher() { return this._themeSwitcher }

  show() {
    this.changeTab('appearance')
    $('.settings_wrapper').style.display = 'flex'
  }

  hide() {
    $('.settings_wrapper').style.display = 'none'
  }

  changeHeaderTitle(tabString) {
    const tabs = ['appearance', 'shortcuts']
    const tab = tabString.toLowerCase()
    const isExistingTab = tabs.find((item) => item === tab)

    if (!isExistingTab) throw new Error('Error trying to set the header title')

    $('.settings_header_title').innerHTML = /*HTML*/`
      <strong>Settings</strong> / ${Utils.capitalizeFirstLetter(tabString)}
    `
  }

  setTabPanel(tabString) {
    const tabs = ['appearance', 'shortcuts']
    const tab = tabString.toLowerCase()
    const isExistingTab = tabs.find((item) => item === tab)

    if (!isExistingTab) throw new Error('Error trying to get tab')

    switch (tab) {
      //case it's appearance
      case tabs[0]:
        $('.settings_shortcuts_panel').style.display = 'none'
        $('.settings_theme_panel').style.display = 'initial'
        break
      //case it's shortcuts
      case tabs[1]:
        $('.settings_shortcuts_panel').style.display = 'initial'
        $('.settings_theme_panel').style.display = 'none'
        break
    }
  }

  changeTab(tabString) {
    this.changeHeaderTitle(tabString)
    this.setTabPanel(tabString)
  }

  __init__() {
    //insert settings markup on DOM
    $('body').insertAdjacentHTML('beforeend', /*HTML*/`
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
                  <a class="settings_main_nav_anchor_appearance settings_main_nav_anchor">Appearance</a>
                  <a class="settings_main_nav_anchor_shortcuts settings_main_nav_anchor">Shortcuts</a>
                </nav>

                <section class="settings_main_panel">

                  <div class="settings_theme_panel settings_main_panel_container">
                    <header class="settings_main_panel_header">
                      <h1 class="settings_main_panel_header_title">Theme Settings</h1>
                      <p class="settings_main_panel_header_description">
                        Select your prefered theme for <strong>Imagebox</strong> so you can work in the eviroment 
                        that best fits you! 
                      </p>
                    </header>
                    <div class="settings_themes_buttons_container">

                      <button class="settings_theme_button button_light_theme">
                        ${icons.lightTheme}
                        <span>Light</span>
                      </button>

                      <button class="settings_theme_button button_dark_theme">
                        ${icons.darkTheme}
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                
                  <div class="settings_shortcuts_panel">
                    <header class="settings_main_panel_header">
                      <h1 class="settings_main_panel_header_title">Shortcuts</h1>
                      <p class="settings_main_panel_header_description">
                        You can boost your productivity using <strong>shortcuts</strong>! 
                      </p>
                    </header>
                  </div>

                </section>
              </main>
          </div>  
        </section>
    `)

    $('.toolbar_settings_btn').addEventListener('click', () => { this.show() })
    $('.settings_main_nav_anchor_appearance').addEventListener('click', () => { this.changeTab('appearance') })
    $('.settings_main_nav_anchor_shortcuts').addEventListener('click', () => { this.changeTab('shortcuts') })
    $('.settings_header_button_exit').addEventListener('click', () => { this.hide() })
    // $('.settings_wrapper').addEventListener('click', (event) => { this.hide(event) })
    $('.button_light_theme').addEventListener('click', () => { this.themeSwitcher.changeTheme('light') })
    $('.button_dark_theme').addEventListener('click', () => { this.themeSwitcher.changeTheme('dark') })
  }
}

export default Settings