const path = require('path')
const url = require('url')
const jsdom = require("jsdom")
const fs = require('fs')
const { JSDOM } = jsdom

// http://sfz.uzuzuz.com/?region=110101&birthday=19900101&sex=1&num=10
let targetUrl = 'https://www.tinysoft.org/index.php/index/id/id/370705/year/1991/month/04/day/29/sex/%E7%94%B7'
let http = url.parse(targetUrl)['protocol'].includes('https') ? require('https') : require('http')
let options = url.parse(targetUrl)

function getData(argetUrl, success = null) {
    http.get(targetUrl, resp => {
        if (resp.statusCode == 200) {
            let html = ''
            resp.setEncoding('utf8')
            resp.on('data', (item) => {
                html += item
            })
            resp.on('end', function() {
                success && success(html)
            })
        } else if (resp.statueCode == 302 || resp.statueCode == 301) {
            getData(resp.headers.location, success)
        }
    }).on('error', function(err) {
        console.log(err)
    })
}
getData(targetUrl, success)

function success(html) {
    const dom = new JSDOM(`${html}`)
    const document = dom.window.document
    let targetDom = document.querySelectorAll('.table-hover')
    if (targetDom.length) {
        targetDom = targetDom[0]
    } else
        return false
    let arr = targetDom.querySelectorAll('tbody > tr')
    let jsonStr = []

    arr.forEach(el => {
        let list = el.querySelectorAll('td')
        let obj = {}
        obj.name = list[0].textContent
        obj.id = list[1].textContent
        jsonStr.push(obj)
    });
    fs.writeFile(path.join(__filename, '../../src/commom/utils/identityCardNumbers.js'),
        `export const identityCardNumbers = ${JSON.stringify(jsonStr)}`,
        'utf8',
        (err) => {
            if (err) throw err;
            console.log('身份证已经爬去结束')
        })
}