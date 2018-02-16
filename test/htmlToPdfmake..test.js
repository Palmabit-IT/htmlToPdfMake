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

    return pdfForElement(html)
      .then(result => {
        expect(result).to.deep.eq(expected)
      })

  })
})