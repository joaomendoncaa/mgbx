import icons from './SvgIcons'
import ThemeSwitcherSingleton from './ThemeSwitcher'
import $ from './DomElements'
import Utils from './Utils'

import '../styles/Settings.scss'

const SettingsSingleton = (() => {
  class Settings {
    constructor() {
      this._settingsButtonElement = $('.toolbar_settings_btn')
      this._themeSwitcher = ThemeSwitcherSingleton.getInstance()
      this._isOpened = false
      this._shortcuts = [
        {
          title: 'Escape a modal or selection',
          buttons: [
            { data: 'ESC', isMouse: false }
          ]
        },
        {
          title: 'Escape a modal or selection',
          buttons: [
            { data: 'ESC', isMouse: false }
          ]
        },
      ]

      this.__init__()
    }

    get settingsButtonElement() { return this._settingsButtonElement }
    get themeSwitcher() { return this._themeSwitcher }
    get isOpened() { return this._isOpened }

    set isOpened(isOpened) { this._isOpened = isOpened }

    show() {
      this.isOpened = true
      this.changeTab('appearance')
      $('.settings_wrapper').style.display = 'flex'
    }

    hide() {
      this.isOpened = false
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

    setActiveAnchor(tabString) {
      const tabs = ['appearance', 'shortcuts']
      const tab = tabString.toLowerCase()
      const isExistingTab = tabs.find((item) => item === tab)

      if (!isExistingTab) throw new Error('Error trying to get tab')

      $('.settings_main_nav_anchor', true).forEach(node => {
        if (node.classList[0] === `settings_main_nav_anchor_${tab}`) {
          node.classList.add('active_anchor')
        } else {
          node.classList.remove('active_anchor')
        }
      })
    }

    changeTab(tabString) {
      this.changeHeaderTitle(tabString)
      this.setTabPanel(tabString)
      this.setActiveAnchor(tabString)
    }

    /**
     * @param {string} shortcutTitle
     * @param {array} shortcutButtonsList schema example: 
     * [ 
     *  { type: 'keyboard', value: 'ctrl' },
     *  { type: 'mouse', value: 'up' }
     * ]
     */
    setShortcut(shortcutTitle, shortcutButtonsList) {
      let shortcutButtonsListMarkup = ''

      shortcutButtonsList.forEach((shortcut, index) => {
        const isNotTheLastShortcut = index !== Utils.arrayLastIndex(shortcutButtonsList)
        const isTypeMouse = shortcut.type.toLowerCase() === 'mouse'

        const keyShortcut = /*HTML*/`
          <div class="button_key">
            <span class="button_key_text">${shortcut.value.toUpperCase()}</span>
          </div>
        `

        const mouseShortcut = /*HTML*/`
            <div class="button_mouse button_mouse_${shortcut.value.toLowerCase()}"></div>
        `

        const shortcutHTML = /*HTML*/`
          <div class="shortcut_list_item_button_slot">
            ${isTypeMouse ? mouseShortcut : keyShortcut}
          </div>
          ${isNotTheLastShortcut ? /*HTML*/`
            <div class="shortcut_list_item_button_slot">
              <span class="button_plus">+</span>
            </div>
          ` : ''}
        `

        shortcutButtonsListMarkup += shortcutHTML
      })

      $('.settings_shortcuts_list').insertAdjacentHTML('beforeend', /*HTML*/`
        <div class="shortcut_list_item_container">
          <h1 class="shortcut_list_item_title">${shortcutTitle}</h1>
          <div class="shortcut_list_item_buttons_wrapper">
            ${shortcutButtonsListMarkup}
          </div>
        </div>     
      `)
    }

    __init__() {
      //insert settings markup on DOM
      $('body').insertAdjacentHTML('beforeend', /*HTML*/`
        <section class="settings_wrapper">

          <div class="settings_container">

              <header class="settings_header">
                <span class="settings_header_title"></span>
                <button class="settings_header_button_exit">
                  ${icons.exit}
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
                
                  <div class="settings_shortcuts_panel settings_main_panel_container">
                    <header class="settings_main_panel_header">
                      <h1 class="settings_main_panel_header_title">Shortcuts List</h1>
                      <p class="settings_main_panel_header_description">
                        You can boost your productivity using <strong>shortcuts</strong>! 
                      </p>
                    </header>

                    <div class="settings_shortcuts_list">
                    </div>
                  </div>

                </section>
              </main>
          </div>  
        </section>
      `)

      //on initialization the default tab is appearance
      this.changeTab('appearance')
      //on initialization settings modal is hidden
      this.hide()
      //listeners
      $('.toolbar_settings_btn').addEventListener('click', () => { this.show() })
      $('.settings_main_nav_anchor_appearance').addEventListener('click', () => { this.changeTab('appearance') })
      $('.settings_main_nav_anchor_shortcuts').addEventListener('click', () => { this.changeTab('shortcuts') })
      $('.settings_header_button_exit').addEventListener('click', () => { this.hide() })
      $('.button_light_theme').addEventListener('click', () => { this.themeSwitcher.changeTheme('light') })
      $('.button_dark_theme').addEventListener('click', () => { this.themeSwitcher.changeTheme('dark') })
      // TODO: make a listener to close on clicking the wrapper
      // $('.settings_wrapper').addEventListener('click', (event) => { this.hide(event) })

      //shortcuts for the "shortcuts" tab
      this.setShortcut('Escape anything', [
        { type: 'keyboard', value: 'esc' }
      ])
      this.setShortcut('Zoom in', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'mouse', value: 'up' }
      ])
      this.setShortcut('Zoom out', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'mouse', value: 'down' }
      ])
      this.setShortcut('Speedy Zoom in', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 'shift' },
        { type: 'mouse', value: 'up' }
      ])
      this.setShortcut('Speedy Zoom out', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 'shift' },
        { type: 'mouse', value: 'down' }
      ])
      this.setShortcut('Roll-back changes', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 'z' }
      ])
      this.setShortcut('Roll-forward changes', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 'shift' },
        { type: 'keyboard', value: 'z' }
      ])
      this.setShortcut('Save image', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 's' }
      ])
      this.setShortcut('Crop selection', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 'X' }
      ])
      this.setShortcut('Crop selection', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 'X' }
      ])
      this.setShortcut('Crop selection', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 'X' }
      ])
      this.setShortcut('Crop selection', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 'X' }
      ])
      this.setShortcut('Crop selection', [
        { type: 'keyboard', value: 'ctrl' },
        { type: 'keyboard', value: 'X' }
      ])
    }
  }

  let settingsInstance

  function createSettings() {
    settingsInstance = new Settings()
    return settingsInstance
  }

  return {
    getInstance: () => {
      if (!settingsInstance) settingsInstance = createSettings()
      return settingsInstance
    }
  }
})()

export default SettingsSingleton