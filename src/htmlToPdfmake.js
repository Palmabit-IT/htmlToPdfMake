'use strict'

const parse5 = require('parse5');

function getBody(html) {
  const document = parse5.parse(html)
  const htmlParsed = document.childNodes.find(e => e.nodeName === 'html')
  if (!htmlParsed) return []
  const body = htmlParsed.childNodes.find(e => e.nodeName === 'body')
  return body.childNodes
}

function getAttribute(e, attr) {
  const attrFound = e.find(e => e.name === attr)
  return attrFound && attrFound.value
}

function pdfForElement(outerHTML) {

  function ParseContainer(cnt, e, p, styles) {
    var elements = [];
    var children = e.childNodes;
    if (children.length != 0) {
      for (var i = 0; i < children.length; i++) p = ParseElement(elements, children[i], p, styles);
    }
    if (elements.length != 0) {
      for (var i = 0; i < elements.length; i++) cnt.push(elements[i]);
    }
    return p;
  }

  function ComputeStyle(o, styles) {
    for (var i = 0; i < styles.length; i++) {
      var st = styles[i].trim().toLowerCase().split(":");
      if (st.length == 2) {
        switch (st[0]) {
          case "font-size":
            {
              o.fontSize = parseInt(st[1]);
              break;
            }
          case "text-align":
            {
              switch (st[1]) {
                case "right":
                  o.alignment = 'right';
                  break;
                case "center":
                  o.alignment = 'center';
                  break;
              }
              break;
            }
          case "font-weight":
            {
              switch (st[1]) {
                case "bold":
                  o.bold = true;
                  break;
              }
              break;
            }
          case "text-decoration":
            {
              switch (st[1]) {
                case "underline":
                  o.decoration = "underline";
                  break;
              }
              break;
            }
          case "font-style":
            {
              switch (st[1]) {
                case "italic":
                  o.italics = true;
                  break;
              }
              break;
            }
        }
      }
    }
  }

  function ParseElement(cnt, e, p, styles) {
    if (!styles) styles = [];
    // console.log('e', e);
    if (e.attrs && e.attrs.length) { // FIXME
      var nodeStyle = getAttribute(e.attrs, "style");
      if (nodeStyle) {
        var ns = nodeStyle.split(";");
        for (var k = 0; k < ns.length; k++) styles.push(ns[k]);
      }
    }

    switch (e.nodeName.toLowerCase()) {
      case "#text":
        {
          var t = {
            text: e.value.replace(/\n/g, "")
          };
          if (styles) ComputeStyle(t, styles);
            /* if (t.text.trim()) */ p.text.push(t);
          break;
        }
      case "b":
      case "strong":
        {
          //styles.push("font-weight:bold");
          ParseContainer(cnt, e, p, styles.concat(["font-weight:bold"]));
          break;
        }
      case "u":
        {
          //styles.push("text-decoration:underline");
          ParseContainer(cnt, e, p, styles.concat(["text-decoration:underline"]));
          break;
        }
      case "i":
        {
          //styles.push("font-style:italic");
          ParseContainer(cnt, e, p, styles.concat(["font-style:italic"]));
          //styles.pop();
          break;
          //cnt.push({ text: e.innerText, bold: false });
        }
      case "h1":
        {
          p = CreateParagraph();
          var st = {
            stack: []
          }
          st.stack.push(p);
          ComputeStyle(st, styles);
          ParseContainer(st.stack, e, p, styles.concat(["font-size:32", "font-weight:bold"]));

          cnt.push(st);
          break;
        }
      case "h2":
        {
          p = CreateParagraph();
          var st = {
            stack: []
          }
          st.stack.push(p);
          ComputeStyle(st, styles);
          ParseContainer(st.stack, e, p, styles.concat(["font-size:24", "font-weight:bold"]));

          cnt.push(st);
          break;
        }
      case "h3":
        {
          p = CreateParagraph();
          var st = {
            stack: []
          }
          st.stack.push(p);
          ComputeStyle(st, styles);
          ParseContainer(st.stack, e, p, styles.concat(["font-size:19", "font-weight:bold"]));

          cnt.push(st);
          break;
        }
      case "span":
        {
          ParseContainer(cnt, e, p, styles);
          break;
        }
      case "br":
        {
          p = CreateParagraph();
          const newLine = { text: '\n' }
          p.text.push(newLine)
          cnt.push(p);
          break;
        }
      case "table":
        {
          var t = {
            table: {
              widths: [],
              body: []
            }
          }
          var border = e.getAttribute("border");
          var isBorder = false;
          if (border)
            if (parseInt(border) == 1) isBorder = true;
          if (!isBorder) t.layout = 'noBorders';
          ParseContainer(t.table.body, e, p, styles);

          var widths = e.getAttribute("widths");
          if (!widths) {
            if (t.table.body.length != 0) {
              if (t.table.body[0].length != 0)
                for (var k = 0; k < t.table.body[0].length; k++) t.table.widths.push("*");
            }
          } else {
            var w = widths.split(",");
            for (var k = 0; k < w.length; k++) t.table.widths.push(w[k]);
          }
          cnt.push(t);
          break;
        }
      case "tbody":
        {
          ParseContainer(cnt, e, p, styles);
          //p = CreateParagraph();
          break;
        }
      case "tr":
        {
          var row = [];
          ParseContainer(row, e, p, styles);
          cnt.push(row);
          break;
        }
      case "td":
        {
          p = CreateParagraph();
          var st = {
            stack: []
          }
          st.stack.push(p);

          var rspan = e.getAttribute("rowspan");
          if (rspan) st.rowSpan = parseInt(rspan);
          var cspan = e.getAttribute("colspan");
          if (cspan) st.colSpan = parseInt(cspan);

          ParseContainer(st.stack, e, p, styles);
          cnt.push(st);
          break;
        }
      case "div":
      case "p":
        {
          p = CreateParagraph();
          var st = {
            stack: []
          }
          st.stack.push(p);
          ComputeStyle(st, styles);
          ParseContainer(st.stack, e, p);

          cnt.push(st);
          break;
        }
      case "ul":
        {
          const u = {
            ul: []
          }
          ParseContainer(u.ul, e, p, styles);
          cnt.push(u)
          break
        }
      case "ol":
        {
          const o = {
            ol: []
          }
          ParseContainer(o.ol, e, p, styles);
          cnt.push(o)
          break
        }
      case "li":
        {
          p = CreateParagraph();
          var st = []
          st.push(p);
          ParseContainer(st, e, p, styles);
          cnt.push(st);
          break
        }
      case "sub":
      case "small":
        {
          ParseContainer(cnt, e, p, styles.concat(["font-size:6"]));
          break;
        }
      default:
        {
          console.log("Parsing for node " + e.nodeName + " not found");
          break;
        }
    }
    return p;
  }

  function ParseHtml(cnt, htmlText) {
    const html = getBody(htmlText)
    var p = CreateParagraph();
    for (var i = 0; i < html.length; i++) ParseElement(cnt, html[i], p);
  }

  function CreateParagraph() {
    var p = {
      text: []
    };
    return p;
  }

  const content = [];
  ParseHtml(content, outerHTML);
  return content

}

module.exports = {
  pdfForElement
}
