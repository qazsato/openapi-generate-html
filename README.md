# openapi-generate-html

![test](https://github.com/qazsato/maplibre-gl-compass/actions/workflows/test.yml/badge.svg)
[![npm version](https://badge.fury.io/js/maplibre-gl-compass.svg)](https://badge.fury.io/js/maplibre-gl-compass)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Generate standalone HTML from OpenAPI Specification. 

## Feature

One of the key benefits of `openapi-generate-html` is its portability.

By generating a single, self-contained HTML file, all required assets (CSS, JavaScript, and OpenAPI data) are embedded directly in the document.

This makes it easy to:

1. **Share** : the file as a single, standalone document without additional dependencies.
2. **Hosting** : the file on any server or serve it locally, with no need for additional resources or configurations.
3. **Distribute** : the file via email or other methods, knowing that it will display consistently across environments.

This portability makes `openapi-generate-html` ideal for situations where reliable, standalone documentation is required.

![Using openapi-generate-html](docs/images/mermaid.png)

## How to use

```bash
npx openapi-generate-html -i openapi.json
```

Use dark theme 🌙

```bash
npx openapi-generate-html -i openapi.json --theme=dark
```

> [!NOTE]
> The dark theme is an experimental feature 🧪

## CLI Options

| command       | default        | description                             |
| ------------- | -------------- | --------------------------------------- |
| --input (-i)  |                | Input OpenAPI file path or URL          |
| --output (-o) | "openapi.html" | Output HTML file name                   |
| --ui          | "stoplight"    | Choose UI (stoplight / swagger / redoc) |
| --theme       | "light"        | Choose Theme (light / dark)             |
| --title       | "OpenAPI Docs" | Title of the HTML page                  |
| --description |                | Description of the HTML page            |

## UI Pattern

|           | Light                                                                                                                                                                                | Dark 🧪                                                                                                                                                                         |
| --------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Stoplight | ![Stoplight Light](docs/images/stoplight_light.png) <br> `--ui=stoplight --theme=light` <br> [sample](https://qazsato.github.io/openapi-generate-html/exmaples/stoplight-light.html) | ![Stoplight Dark](docs/images/stoplight_dark.png) <br> `--ui=stoplight --theme=dark` <br> [sample](https://qazsato.github.io/openapi-generate-html/exmaples/stoplight-dark.html) |
| Swagger   | ![Swagger Light](docs/images/swagger_light.png) <br> `--ui=swagger --theme=light` <br> [sample](https://qazsato.github.io/openapi-generate-html/exmaples/swagger-light.html)         | ![Swagger Dark](docs/images/swagger_dark.png) <br> `--ui=swagger --theme=dark` <br> [sample](https://qazsato.github.io/openapi-generate-html/exmaples/swagger-dark.html)         |
| Redoc     | ![Redoc Light](docs/images/redoc_light.png) <br> `--ui=redoc --theme=light` <br> [sample](https://qazsato.github.io/openapi-generate-html/exmaples/redoc-light.html)                 | ![Redoc Dark](docs/images/redoc_dark.png) <br> `--ui=redoc --theme=dark` <br> [sample](https://qazsato.github.io/openapi-generate-html/exmaples/redoc-dark.html)                 |

## License

This project is licensed under the terms of the [MIT license](./LICENSE).
