const THEMES = ['light', 'dark']
const themeParam = new URLSearchParams(window.location.search).get('theme')
if (THEMES.includes(themeParam)) {
  document.documentElement.setAttribute('data-theme', themeParam)
}

// refs. https://github.com/dilanx/redark
const redark = {
  codeBlock: {
    backgroundColor: '#18181b',
  },
  colors: {
    error: {
      main: '#ef4444',
    },
    border: {
      light: '#27272a',
      dark: '#a1a1aa',
    },
    http: {
      basic: '#71717a',
      delete: '#ef4444',
      get: '#22c55e',
      head: '#d946ef',
      link: '#06b6d4',
      options: '#eab308',
      patch: '#f97316',
      post: '#3b82f6',
      put: '#ec4899',
    },
    primary: {
      main: '#71717a',
    },
    responses: {
      error: {
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderColor: '#fca5a5',
        color: '#ef4444',
        tabTextColor: '#ef4444',
      },
      info: {
        backgroundColor: 'rgba(59,131,246,0.1)',
        borderColor: '#93c5fd',
        color: '#3b82f6',
        tabTextColor: '#3b82f6',
      },
      redirect: {
        backgroundColor: 'rgba(234,179,8,0.1)',
        borderColor: '#fde047',
        color: '#eab308',
        tabTextColor: '#eab308',
      },
      success: {
        backgroundColor: 'rgba(34,197,94,0.1)',
        borderColor: '#86efac',
        color: '#22c55e',
        tabTextColor: '#22c55e',
      },
      warning: {
        main: '#eab308',
      },
    },
    secondary: {
      main: '#3f3f46',
      light: '#27272a',
    },
    success: {
      main: '#22c55e',
    },
    text: {
      primary: '#fafafa',
      secondary: '#d4d4d8',
      light: '#3f3f46',
    },
  },
  fab: {
    backgroundColor: '#52525b',
    color: '#67e8f9',
  },
  rightPanel: {
    backgroundColor: '#27272a',
    servers: {
      overlay: {
        backgroundColor: '#27272a',
      },
      url: {
        backgroundColor: '#18181b',
      },
    },
  },
  schema: {
    linesColor: '#d8b4fe',
    typeNameColor: '#93c5fd',
    typeTitleColor: '#1d4ed8',
  },
  sidebar: {
    activeTextColor: '#ffffff',
    backgroundColor: '#18181b',
    textColor: '#a1a1aa',
  },
  typography: {
    code: {
      backgroundColor: '#18181b',
      color: '#fde047',
    },
    links: {
      color: '#0ea5e9',
      hover: '#0ea5e9',
      textDecoration: 'none',
      hoverTextDecoration: 'underline',
      visited: '#0ea5e9',
    },
  },
  extensionsHook: (c) => {
    if (c === 'UnderlinedHeader') {
      return {
        color: '#a1a1aa',
        fontWeight: 'bold',
        borderBottom: '1px solid #3f3f46',
      }
    }
  },
}

let option = {
  disableSearch: true,
}
if (document.documentElement.getAttribute('data-theme') === 'dark') {
  option = { theme: redark }
}

// ref. https://redocly.com/docs/redoc/deployment/html#the-redoc-object
Redoc.init(window.apiDocs, option, document.getElementById('redoc-container'))

// ref. https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform#examples
const modifierKeyPrefix =
  navigator.platform.startsWith('Mac') || navigator.platform === 'iPhone'
    ? '⌘' // command key
    : '^' // control key

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
  url.hash = `#tag/${tag}/operation/${operationId}`
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
