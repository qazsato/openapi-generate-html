#!/usr/bin/env node
import { program } from 'commander'
import inquirer from 'inquirer'
import fs from 'fs'
import yaml from 'js-yaml'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'
import $RefParser from '@apidevtools/json-schema-ref-parser'
import { UI } from './constants/index.js'
import {
  validateCommandInput,
  validateCommandOutput,
  validateCommandUi,
  validateCommandTheme,
  validateInquirerInput,
  validateInquirerOutput,
} from './utils/validate.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  // 1. get CLI options from user
  const options = getCliOptions()
  const answers = await askQuestions(options)
  const result = { ...options, ...answers }

  // 2. bundle HTML file based on the UI
  const htmlContent = await renderOpenApiHtml(result)

  // 3. write the HTML file
  const output = result.output
  fs.writeFileSync(output, htmlContent, 'utf-8')
  console.log(`✅ HTML file generated: ${output}`)
}

function getCliOptions() {
  program
    .option(
      '-i, --input <input>',
      'Input OpenAPI JSON / YAML file',
      validateCommandInput,
    )
    .option(
      '-o, --output <output>',
      'Output HTML file name',
      validateCommandOutput,
    )
    .option('--ui <ui>', `Choose UI (${UI.join(', ')})`, validateCommandUi)
    .option('--title <title>', 'Title of the HTML page', 'OpenAPI Docs')
    .option(
      '--theme <theme>',
      'Theme of the HTML page. Choose from light or dark.',
      validateCommandTheme,
    )
    .parse(process.argv)
  return program.opts()
}

async function askQuestions(options) {
  return await inquirer.prompt([
    {
      type: 'list',
      name: 'ui',
      message: 'Which UI would you like to use?',
      default: UI[0],
      choices: UI,
      when: !options.ui,
    },
    {
      type: 'input',
      name: 'input',
      message: 'Please provide the path to your OpenAPI JSON file:',
      default: './openapi.json',
      validate: validateInquirerInput,
      when: !options.input,
    },
    {
      type: 'input',
      name: 'output',
      message: 'Output HTML file name:',
      default: 'openapi.html',
      validate: validateInquirerOutput,
      when: !options.output,
    },
  ])
}

async function renderOpenApiHtml(result) {
  const ui = result.ui
  const theme = result.theme
  const title = result.title

  const template = fs.readFileSync(
    path.resolve(__dirname, `../resources/${ui}/template.ejs`),
    'utf-8',
  )
  const cssContent = fs.readFileSync(
    path.resolve(__dirname, `../resources/${ui}/index.css`),
    'utf-8',
  )
  const jsContent = fs.readFileSync(
    path.resolve(__dirname, `../resources/${ui}/index.js`),
    'utf-8',
  )

  const input = result.input
  const rawApiDocsText = fs.readFileSync(input, 'utf-8')
  const fileExtension = path.extname(input).toLowerCase()
  let rawApiDocs
  if (fileExtension === '.json') {
    rawApiDocs = JSON.parse(rawApiDocsText)
  } else if (fileExtension === '.yaml' || fileExtension === '.yml') {
    rawApiDocs = yaml.load(rawApiDocsText)
  } else {
    throw new Error(
      'Unsupported file format. Please provide a .json or .yaml/.yml file.',
    )
  }

  const apiDocs = await $RefParser.dereference(rawApiDocs) // resolve $ref

  return ejs.render(template, {
    theme,
    title,
    jsContent,
    cssContent,
    apiDocs: JSON.stringify(apiDocs),
  })
}

main()
