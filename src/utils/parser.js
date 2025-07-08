import $RefParser from '@apidevtools/json-schema-ref-parser'
import stringify from 'fast-safe-stringify'
import yaml from 'js-yaml'
import { UI } from '../constants/index.js'

export async function parseOpenApi(rawApiDocsText, ui) {
  let rawApiDocs
  if (isJSON(rawApiDocsText)) {
    rawApiDocs = JSON.parse(rawApiDocsText)
  } else if (isYAML(rawApiDocsText)) {
    rawApiDocs = yaml.load(rawApiDocsText)
  } else {
    throw new Error(
      'Unsupported file format. Please provide a .json or .yaml/.yml file.',
    )
  }
  // resolve $ref pointers
  if (ui === UI.SWAGGER) {
    // https://github.com/APIDevTools/json-schema-ref-parser/blob/main/docs/ref-parser.md#dereferenceschema-options-callback
    const apiDocs = await $RefParser.dereference(rawApiDocs)
    return stringify(apiDocs)
  }
  // https://github.com/APIDevTools/json-schema-ref-parser/blob/main/docs/ref-parser.md#bundleschema-options-callback
  const apiDocs = await $RefParser.bundle(rawApiDocs)
  return JSON.stringify(apiDocs)
}

function isJSON(string) {
  try {
    JSON.parse(string)
    return true
  } catch {
    return false
  }
}

function isYAML(string) {
  try {
    yaml.load(string)
    return true
  } catch {
    return false
  }
}
