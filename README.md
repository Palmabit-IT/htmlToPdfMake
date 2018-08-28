# HtmlToPdfMake

Convert html to PdfMake schema

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

```bash
npm i -S @palmabit/htmltopdfmake
```

### Usage

```javascript
const { pdfForElement } = require('@palmabit/htmltopdfmake')
const result = pdfForElement('<div><h1>header1</h1></div>')

//result
[
  { "stack": [
    { "text": [] },
    { "stack": [
      { "text": [
        { "text": "header1", "fontSize": 32, "bold": true }
        ]
      }]
    }
  ]
]
```

## Built With

* [Parse5](https://github.com/inikulin/parse5) - HTML parsing/serialization toolset for Node.js. WHATWG HTML Living Standard (aka HTML5)-compliant.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
