import { InvalidArgumentError } from 'commander'
import { UI, THEME, ENABLE_INPUT_EXTS } from '../constants/index.js'

export function validateCommandInput(input) {
  if (!isValidInput(input)) {
    const message = `Must be a JSON or YAML file.`
    throw new InvalidArgumentError(message)
  }
  return input
}

export function validateCommandOutput(output) {
  if (!output) {
    return 'openapi.html'
  }
  if (!isValidOutput(output)) {
    const message = `Must be an HTML file.`
    throw new InvalidArgumentError(message)
  }
  return output
}

export function validateCommandUi(ui) {
  if (!UI.includes(ui)) {
    const message = `Please choose from: ${UI.join(', ')}.`
    throw new InvalidArgumentError(message)
  }
  return ui
}

export function validateCommandTheme(theme) {
  if (!theme) {
    return THEME[0]
  }
  if (!THEME.includes(theme)) {
    const message = `Please choose from: ${THEME.join(', ')}.`
    throw new InvalidArgumentError(message)
  }
  return theme
}

export function validateInquirerInput(input) {
  if (!isValidInput(input)) {
    return 'File must be a JSON or YAML file!'
  }
  return true
}

export function validateInquirerOutput(output) {
  if (!isValidOutput(output)) {
    return 'File must be an HTML file!'
  }
  return true
}

function isValidInput(input) {
  return ENABLE_INPUT_EXTS.some((ext) => input.endsWith(ext))
}

function isValidOutput(output) {
  return output.endsWith('.html')
}
