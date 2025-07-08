const THEMES = ['light', 'dark']
const themeParam = new URLSearchParams(window.location.search).get('theme')
if (THEMES.includes(themeParam)) {
  document.documentElement.setAttribute('data-theme', themeParam)
}

// ref. https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform#examples
const modifierKeyPrefix =
  navigator.platform.startsWith('Mac') || navigator.platform === 'iPhone'
    ? '⌘' // command key
    : '^' // control key

/* ref. https://github.com/stoplightio/elements/blob/main/docs/getting-started/elements/html.md#examples */
;(async () => {
  const docs = document.querySelector('.elements-api')
  docs.apiDescriptionDocument = window.apiDocs

  const searchButton = document.querySelector('#search-button')
  searchButton.addEventListener('click', () => searchDialog.show())
  searchButton.querySelector('.text').textContent =
    `Search ${modifierKeyPrefix}+K`

  // eslint-disable-next-line no-undef
  const searchDialog = new SearchDialog(
    'search-dialog',
    'auto-complete',
    window.apiDocs,
  )
  searchDialog.on('select', (selection) => {
    const operationId = selection.operationId
    const url = new URL(location.href)
    url.hash = `#/operations/${operationId}`
    location.href = url.toString()
    searchDialog.hide()
  })

  document.addEventListener('keydown', function (e) {
    const isCmdOrCtrl = modifierKeyPrefix === '⌘' ? e.metaKey : e.ctrlKey
    if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
      searchDialog.show()
      e.preventDefault()
    }
  })
})()
