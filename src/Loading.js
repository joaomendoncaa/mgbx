import $ from './DomElements'

function initLoading() {
    $('body').insertAdjacentHTML('afterbegin', `
        <div class="loading-container">
            <div class="loading-bar"><div>
        </div>
    `)

    // startLoading()
}

function showLoading() {
    $('.loading-container').style.display = 'flex'
}

function hideLoading() {
    $('.loading-container').style.display = 'none'
}

export {
    initLoading,
    showLoading,
    hideLoading
}