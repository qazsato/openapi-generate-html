// Copy third-party UI assets from node_modules into resources/vendor/
// so that they can be embedded into the generated HTML.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const nodeModulesDir = path.resolve(__dirname, '../node_modules')
const vendorDir = path.resolve(__dirname, '../resources/vendor')

const ASSETS = {
  'stoplight.js': '@stoplight/elements/web-components.min.js',
  'stoplight.css': '@stoplight/elements/styles.min.css',
  'swagger.js': 'swagger-ui-dist/swagger-ui-bundle.js',
  'swagger.css': 'swagger-ui-dist/swagger-ui.css',
  'redoc.js': 'redoc/bundles/redoc.standalone.js',
  'autocomplete.js': '@tarekraafat/autocomplete.js/dist/autoComplete.min.js',
  'autocomplete.css':
    '@tarekraafat/autocomplete.js/dist/css/autoComplete.02.css',
}

const REDOC_FONTS = [
  ['Montserrat', 'montserrat', [300, 400, 700]],
  ['Roboto', 'roboto', [300, 400, 700]],
]

function resolvePackageFile(specifier) {
  return path.join(nodeModulesDir, specifier)
}

function removeSourceMap(content) {
  return content.replace(/\/[*/]# sourceMappingURL=\S+?(\s*\*\/)?$/gm, '')
}

// Escape sequences that would end or confuse an inline <script> element.
// `\x3C` is `<` in string, template and regex literals alike.
function escapeInlineScript(content) {
  return content.replace(/<(!--|\/?script)/gi, '\\x3C$1')
}

function escapeInlineStyle(content) {
  return content.replace(/<\/style/gi, '<\\/style')
}

function buildRedocFontsCss() {
  return REDOC_FONTS.flatMap(([family, pkg, weights]) =>
    weights.map((weight) => {
      const file = resolvePackageFile(
        `@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2`,
      )
      const data = fs.readFileSync(file).toString('base64')
      return `@font-face{font-family:'${family}';font-style:normal;font-display:swap;font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2');}`
    }),
  ).join('\n')
}

fs.rmSync(vendorDir, { recursive: true, force: true })
fs.mkdirSync(vendorDir, { recursive: true })

for (const [name, specifier] of Object.entries(ASSETS)) {
  let content = removeSourceMap(
    fs.readFileSync(resolvePackageFile(specifier), 'utf-8'),
  )
  content = name.endsWith('.js')
    ? escapeInlineScript(content)
    : escapeInlineStyle(content)
  fs.writeFileSync(path.join(vendorDir, name), content)
}
fs.writeFileSync(path.join(vendorDir, 'redoc-fonts.css'), buildRedocFontsCss())

console.log(
  `Vendor assets copied to ${path.relative(process.cwd(), vendorDir)}`,
)
