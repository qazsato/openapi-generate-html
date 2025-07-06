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

/* ref. https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/ */
window.onload = () => {
  window.ui = SwaggerUIBundle({
    spec: window.apiDocs,
    dom_id: '#swagger-ui',
    deepLinking: true,
  })

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
    const tag = selection.tag
    const operationId = selection.operationId
    const url = new URL(location.href)
    url.hash = `#/${tag}/${operationId}`
    location.href = url.toString()
    searchDialog.hide()

    const opblock = document.querySelector(`#operations-${tag}-${operationId}`)
    opblock.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    const opblockButton = opblock.querySelector(
      '.opblock-summary-control[aria-expanded="false"]',
    )
    if (opblockButton) {
      opblockButton.click()
    }
  })

  document.addEventListener('keydown', function (e) {
    const isCmdOrCtrl = modifierKeyPrefix === '⌘' ? e.metaKey : e.ctrlKey
    if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
      searchDialog.show()
      e.preventDefault()
    }
  })
}
