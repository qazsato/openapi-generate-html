import { parseOpenApi } from './parser.js'
import { UI } from '../constants/index.js'

describe('parseOpenApi', () => {
  test('should parse valid JSON format', async () => {
    const validJson =
      '{"openapi": "3.0.0", "info": {"title": "Test API", "version": "1.0.0"}, "paths": {}}'
    const result = await parseOpenApi(validJson, UI.STOPLIGHT)
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    const parsed = JSON.parse(result)
    expect(parsed.openapi).toBe('3.0.0')
    expect(parsed.info.title).toBe('Test API')
  })

  test('should parse valid YAML format', async () => {
    const validYaml = `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths: {}`
    const result = await parseOpenApi(validYaml, UI.STOPLIGHT)
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    const parsed = JSON.parse(result)
    expect(parsed.openapi).toBe('3.0.0')
    expect(parsed.info.title).toBe('Test API')
  })

  test('should use fast-safe-stringify for swagger UI', async () => {
    const validJson =
      '{"openapi": "3.0.0", "info": {"title": "Test API", "version": "1.0.0"}, "paths": {}}'
    const result = await parseOpenApi(validJson, UI.SWAGGER)
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    // fast-safe-stringify may produce different output than JSON.stringify
    const parsed = JSON.parse(result)
    expect(parsed.openapi).toBe('3.0.0')
  })

  test('should use JSON.stringify for non-swagger UI', async () => {
    const validJson =
      '{"openapi": "3.0.0", "info": {"title": "Test API", "version": "1.0.0"}, "paths": {}}'
    const result = await parseOpenApi(validJson, UI.REDOC)
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    const parsed = JSON.parse(result)
    expect(parsed.openapi).toBe('3.0.0')
  })

  test('should handle $ref resolution for swagger UI', async () => {
    const jsonWithRef = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/users': {
          get: {
            responses: {
              200: {
                description: 'Success',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '/users/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
              },
            ],
            responses: {
              200: {
                description: 'Success',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
            },
          },
        },
      },
    })
    const result = await parseOpenApi(jsonWithRef, UI.SWAGGER)
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    const parsed = JSON.parse(result)
    expect(parsed.components.schemas.User).toBeDefined()
    expect(parsed.paths['/users'].get.responses[200]).toBeDefined()
    expect(parsed.paths['/users/{id}'].get.responses[200]).toBeDefined()
  })

  test('should handle $ref resolution for non-swagger UI', async () => {
    const jsonWithRef = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/users': {
          post: {
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
            responses: {
              201: {
                description: 'Created',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
            },
          },
        },
      },
    })
    const result = await parseOpenApi(jsonWithRef, UI.STOPLIGHT)
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    const parsed = JSON.parse(result)
    expect(parsed.components.schemas.User).toBeDefined()
    expect(parsed.paths['/users'].post.requestBody).toBeDefined()
    expect(parsed.paths['/users'].post.responses[201]).toBeDefined()
  })

  test('should handle malformed JSON', async () => {
    const malformedJson = '{"openapi": "3.0.0", "info": {'
    await expect(parseOpenApi(malformedJson, UI.STOPLIGHT)).rejects.toThrow(
      'Unsupported file format. Please provide a .json or .yaml/.yml file.',
    )
  })

  test('should handle malformed YAML', async () => {
    const malformedYaml = `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths: {
  invalid yaml syntax`
    await expect(parseOpenApi(malformedYaml, UI.STOPLIGHT)).rejects.toThrow(
      'Unsupported file format. Please provide a .json or .yaml/.yml file.',
    )
  })
})
