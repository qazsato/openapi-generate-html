import {
  validateCommandInput,
  validateCommandOutput,
  validateCommandUi,
  validateCommandTheme,
  validateInquirerInput,
  validateInquirerOutput,
} from './validate.js'

describe('validateCommandInput', () => {
  test('should throw error if invalid input file is provided', () => {
    const input = 'invalid-file.txt'
    expect(() => validateCommandInput(input)).toThrow(
      /Must be a JSON or YAML file/,
    )
  })

  test('should return input if valid input file is provided', () => {
    const input = 'valid-file.json'
    expect(validateCommandInput(input)).toEqual(input)
  })
})

describe('validateCommandOutput', () => {
  test('should throw error if invalid output file is provided', () => {
    const output = 'invalid-file.txt'
    expect(() => validateCommandOutput(output)).toThrow(/Must be an HTML file/)
  })

  test('should return output if valid output file is provided', () => {
    const output = 'valid-file.html'
    expect(validateCommandOutput(output)).toEqual(output)
  })
})

describe('validateCommandUi', () => {
  test('should throw error if invalid UI is provided', () => {
    const ui = 'invalid-ui'
    expect(() => validateCommandUi(ui)).toThrow(
      /Please choose from: stoplight, swagger, redoc./,
    )
  })

  test('should return UI if valid UI is provided', () => {
    const ui = 'stoplight'
    expect(validateCommandUi(ui)).toEqual(ui)
  })
})

describe('validateCommandTheme', () => {
  test('should return default theme if no theme is provided', () => {
    const theme = undefined
    expect(validateCommandTheme(theme)).toEqual('light')
  })

  test('should throw error if invalid theme is provided', () => {
    const theme = 'invalid-theme'
    expect(() => validateCommandTheme(theme)).toThrow(
      /Please choose from: light, dark/,
    )
  })

  test('should return theme if valid theme is provided', () => {
    const theme = 'light'
    expect(validateCommandTheme(theme)).toEqual(theme)
  })
})

describe('validateInquirerInput', () => {
  test('should throw error if invalid input file is provided', () => {
    const input = 'invalid-file.txt'
    expect(validateInquirerInput(input)).toEqual(
      'File must be a JSON or YAML file!',
    )
  })

  test('should return true if valid input file is provided', () => {
    const input = 'valid-file.json'
    expect(validateInquirerInput(input)).toEqual(true)
  })
})

describe('validateInquirerOutput', () => {
  test('should throw error if invalid output file is provided', () => {
    const output = 'invalid-file.txt'
    expect(validateInquirerOutput(output)).toEqual('File must be an HTML file!')
  })

  test('should return true if valid output file is provided', () => {
    const output = 'valid-file.html'
    expect(validateInquirerOutput(output)).toEqual(true)
  })
})
