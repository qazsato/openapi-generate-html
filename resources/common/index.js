// eslint-disable-next-line no-unused-vars
class SearchDialog {
  dialog
  autocomplete

  constructor(dialogId, inputId, openapi) {
    this.dialog = document.getElementById(dialogId)
    if (!this.dialog) {
      throw new Error(`Dialog with id "${dialogId}" not found`)
    }

    this.autocomplete = new autoComplete({
      selector: `#${inputId}`,
      placeHolder: 'Search endpoints',
      data: {
        src: this.filterEndpoints(openapi),
        keys: ['searchKey'],
      },
      searchEngine: 'loose',
      threshold: 0,
      resultsList: {
        maxResults: undefined,
        class: 'auto-complete-list',
        element: (list, data) => {
          if (data.results.length > 0) {
            list.innerHTML = ''
            data.results.forEach((item) => {
              const li = document.createElement('li')
              li.className = 'auto-complete-list-item'
              li.innerHTML = `
              <div class="method-tag method-${item.value.method.toLowerCase()}">${item.value.method}</div>
              <div class="endpoint-info">
                <div class="endpoint-path">${item.value.path}</div>
                <div class="endpoint-summary">${item.value.summary}</div>
              </div>
            `
              list.appendChild(li)
            })
          }
        },
      },
    })

    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) {
        this.hide()
      }
    })
  }

  on(event, callback) {
    if (event === 'select') {
      this.autocomplete.input.addEventListener('selection', (event) => {
        callback(event.detail.selection.value)
      })
    } else {
      throw new Error(`Unsupported event: ${event}`)
    }
  }

  show() {
    this.autocomplete.input.value = ''
    this.autocomplete.start()
    this.dialog.showModal()
  }

  hide() {
    this.dialog.close()
  }

  filterEndpoints(openapi) {
    const endpoints = []
    const paths = openapi.paths
    for (const path in paths) {
      const methods = Object.keys(paths[path])
      for (const method of methods) {
        if (method === 'parameters') {
          continue
        }
        const summary = paths[path][method].summary || ''
        endpoints.push({
          searchKey: `${method} ${path} ${summary}`,
          method: method.toUpperCase(),
          path,
          operationId: paths[path][method].operationId,
          tag: paths[path][method].tags
            ? paths[path][method].tags[0]
            : 'default',
          summary,
        })
      }
    }
    return endpoints
  }
}
