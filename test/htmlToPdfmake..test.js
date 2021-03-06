'use strict'

const { expect } = require('chai')
const htmlToPdfmake = require('../src/htmlToPdfmake')

describe('pdfForElement', () => {

  const pdfForElement = htmlToPdfmake.pdfForElement

  it('should done', () => {
    const html = '<p>normale <b>grassetto</b> <i>corsivo</i> <u>sottolineato</u> <b><i>grassettocorsivo</i></b></p>'
    const expected = [
      {
        "stack": [
          {
            "text": [
              {
                "text": "normale "
              },
              {
                "text": "grassetto",
                "bold": true
              },
              {
                "text": " "
              },
              {
                "text": "corsivo",
                "italics": true
              },
              {
                "text": " "
              },
              {
                "text": "sottolineato",
                "decoration": "underline"
              },
              {
                "text": " "
              },
              {
                "text": "grassettocorsivo",
                "bold": true,
                "italics": true
              }
            ]
          }
        ]
      }
    ]

    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)

  })

  it('should parse h1', () => {
    const html = `<div><h1>header1</h1></div>`
    const expected = [{ "stack": [{ "text": [] }, { "stack": [{ "text": [{ "text": "header1", "fontSize": 32, "bold": true }] }] }] }]

    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)

  })

  it('should parse h2', () => {
    const html = `<div><h2>header2</h2></div>`
    const expected = [{ "stack": [{ "text": [] }, { "stack": [{ "text": [{ "text": "header2", "fontSize": 24, "bold": true }] }] }] }]

    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)

  })

  it('should parse h3', () => {
    const html = `<div><h3>header3</h3></div>`
    const expected = [{ "stack": [{ "text": [] }, { "stack": [{ "text": [{ "text": "header3", "fontSize": 19, "bold": true }] }] }] }]

    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)

  })

  it('should parse h3', () => {
    const html = '<h3>header 3</h3>'
    const expected = [{ "stack": [{ "text": [{ "text": "header 3", "fontSize": 19, "bold": true }] }] }]

    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)

  })

  it('should parse ul', () => {
    const html = `<ul>
                    <li>Coffee</li>
                    <li>Tea</li>
                    <li>Milk</li>
                  </ul>`
    const expected = [
      {
        "ul": [
          [
            {
              "text": [
                {
                  "text": "Coffee"
                },
                {
                  "text": "                    "
                }
              ]
            }
          ],
          [
            {
              "text": [
                {
                  "text": "Tea"
                },
                {
                  "text": "                    "
                }
              ]
            }
          ],
          [
            {
              "text": [
                {
                  "text": "Milk"
                },
                {
                  "text": "                  "
                }
              ]
            }
          ]
        ]
      }
    ]

    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)

  })

  it('should parse ol', () => {
    const html = `<ol>
                    <li>Coffee</li>
                    <li>Tea</li>
                    <li>Milk</li>
                  </ol>`
    const expected = [
      {
        "ol": [
          [
            {
              "text": [
                {
                  "text": "Coffee"
                },
                {
                  "text": "                    "
                }
              ]
            }
          ],
          [
            {
              "text": [
                {
                  "text": "Tea"
                },
                {
                  "text": "                    "
                }
              ]
            }
          ],
          [
            {
              "text": [
                {
                  "text": "Milk"
                },
                {
                  "text": "                  "
                }
              ]
            }
          ]
        ]
      }
    ]

    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)

  })

  it('should parse small', () => {
    const html = `<p>big<small>text</small></p>`
    const expected = [{ "stack": [{ "text": [{ "text": "big" }, { "text": "text", "fontSize": 6 }] }] }]

    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)

  })

  it('should parse multiple row', () => {
    const html = '<p>riga uno</p><p><br></p><p>riga due<br></p>'
    const expected = [{ "stack": [{ "text": [{ "text": "riga uno" }] }] }, { "stack": [{ "text": [] }, { "text": [{ "text": "\n" }] }] }, { "stack": [{ "text": [{ "text": "riga due" }] }, { "text": [{ "text": "\n" }] }] }]
    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)
  })

  it('should parse font-size style', () => {
    const html = '<p style="font-size:14">normale</p>'
    const expected = [{ "fontSize": 14, "stack": [{ "text": [{ "text": "normale" }] }] }]

    const result = pdfForElement(html)
    expect(result).to.deep.eq(expected)
  })

})