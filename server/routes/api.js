const express = require('express')
const router = express.Router()
const request = require('request-promise')
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const _ = require('lodash')
const read = require('moz-readability-node');
require('dotenv').config()


    router.get('/url', async function (req, res) {
      let url = req.query.url

      //RIPPING THE ARTICLE
      //gets the HTML from the URL
      let webData = await request(url)

      //turn the HTML into DOM document
      const dom = new JSDOM(webData);

      //use the readability library to parse the DOM document into a JSON free from all the clutter.
      const article = new read.Readability(dom.window.document).parse()

      let filtered = article.textContent.split('\n')
      filtered = filtered.filter(Boolean);

      let paragraphsArray = []
      for (let a = 0; a < filtered.length; a++) {
        paragraphsArray.push(_.words(filtered[a]))
      }

      paragraphsArray = paragraphsArray.filter(p => p.length)
      // res.send(paragraphsArray)

      ////GOOGLE TRANSLATE

      let promiseArray = []
      
      for (let api = 0; api < paragraphsArray.length; api++) {
        //What to translate Object
        let text = {
          "q": paragraphsArray[api],
          "source": "en",
          "target": "he",
          "model": "nmt",
          "format": "text"
        }

        //API call for the google translate server
        let url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`
        let translatedWords = request.post({
          url: url,
          body: text,
          json: true
        })
        promiseArray.push(translatedWords)

      }


      Promise.all(promiseArray).then(function (values) {
        console.log("this is values", values);
        // res.send(values)

        // start building the words array
        let almostFinalArray = []
        for (let i = 0; i < paragraphsArray.length; i++) {
          for (let j = 0; j < paragraphsArray[i].length; j++) {

            let wordObj = {}
            // wordObj[fullArticle[i]] = translatedWords.data.translations[i].translatedText
            wordObj.word = paragraphsArray[i][j]
            wordObj.translatedWord = values[i].data.translations[j].translatedText
            wordObj.index = i
            almostFinalArray.push(wordObj)
            // console.log(wordObj)

          }
          // console.log(translatedWords)
        }

        console.log(almostFinalArray)
        res.send(almostFinalArray)
      })

      // res.send(promiseArray)
      // console.log(promiseArray)

    })

    module.exports = router

