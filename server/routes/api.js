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
            wordObj.word = paragraphsArray[i][j]
            wordObj.difficultyLevel = (paragraphsArray[i][j].length/10)*100
            wordObj.translatedWord = (paragraphsArray[i][j].length<3 ? null : (isNaN(paragraphsArray[i][j]) ? values[i].data.translations[j].translatedText : null ))
            almostFinalArray.push(wordObj)

          }
          // console.log(translatedWords)
        }

        let finalArray = {
          content: almostFinalArray,
          title: article.title,
          author: article.byline,
          link: url,
          readingTime: Math.round(almostFinalArray.length/200)
        }

        console.log(finalArray.readingTime)
        // console.log(article);
        // res.send(finalArray)
      })

    })

    module.exports = router

