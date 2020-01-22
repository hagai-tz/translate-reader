const express = require('express')
const router = express.Router()
const request = require('request-promise')
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const _ = require('lodash')
const read = require('moz-readability-node');
require('dotenv').config()


// let textToRenderReact = "Whats up"
// router.post('', textToRenderReact)

router.get('/', async function(req, res){
    
        //RIPPING THE ARTICLE

      //gets the HTML from the URL
      let webData = await request('https://blog.ycombinator.com/before-you-grow/')
      //turn the HTML into DOM document
      const dom = new JSDOM(webData);
      console.log(dom)
      //use the readability library to parse the DOM document into a JSON free from all the clutter.
      const article = new read.Readability(dom.window.document).parse()
      let fullArticle = _.words(article.textContent)
      fullArticle = fullArticle.slice(284)
      console.log(fullArticle)


    
        //GOOGLE TRANSLATE

        //What to translate Object
      let text = {
        "q": fullArticle,
        "source": "en",
        "target": "he",
        "model": "nmt",
        "format": "text"
      }

      //API call for the google translate server
        let url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`
        let translatedWords = await request.post({
          url: url,
          body: text,
          json: true
          }, function(error, response, body) 
                {
                 let translatedData = body.data.translations
                //  console.log(translatedData[0].translatedText);
                //  res.send(translatedData.translatedText)
                 return translatedData    
                })


        //start building the words array
          let almostFinalArray = []
          for(let i=0; i<fullArticle.length; i++) {
              // console.log(translatedWords)
              let wordObj = {}
              wordObj[fullArticle[i]] = translatedWords.data.translations[i].translatedText
              wordObj.word = fullArticle[i]
              wordObj.translatedWord = translatedWords.data.translations[i].translatedText
              wordObj.index = i
              almostFinalArray.push(wordObj)
              // console.log(wordObj)
            }
            console.log(almostFinalArray)
            res.send(almostFinalArray)
            
            // let finalArray = almostFinalArray.map(word => {
            //     return (`<ul id=${word.index}> <li className="word"> ${word.word} </li> <li className='translatedWord'> ${word.translatedWord}</li> </ul>`)
            // }).join(' ')
            
            // console.log(finalArray)

        })

module.exports = router 


