import { $ } from './DomTools'

function initLoading() {
    $('body').insertAdjacentHTML('afterbegin', `
        <div class="loading-container">
            <div class="loading-bar"><div>
        </div>
    `)

    $('.loading-container').style.display = 'none'
}

function showLoading() {
    console.log('showLoading')
    $('.loading-container').style.display = 'initial'
}

function hideLoading() {
    console.log('hideLoading')
    $('.loading-container').style.display = 'none'
}

export {
    initLoading,
    showLoading,
    hideLoading
}