const express = require('express')
const router = express.Router()
const request = require('request-promise')
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const _ = require('lodash')
const read = require('moz-readability-node');
require('dotenv').config()


router.get('/', async function(req, res){
    
        //RIPPING THE ARTICLE

      //gets the HTML from the URL
      let webData = await request('https://blog.ycombinator.com/hardware-less-hard/')
      // let webData = await request('https://medium.com/javascript-in-plain-english/https-medium-com-javascript-in-plain-english-how-to-build-a-simple-chrome-extension-in-vanilla-javascript-e52b2994aeeb')
      //turn the HTML into DOM document
      const dom = new JSDOM(webData);
      // console.log(dom)
      //use the readability library to parse the DOM document into a JSON free from all the clutter.
      const article = new read.Readability(dom.window.document).parse()
      console.log(article)
      let fullArticle = _.words(article.textContent)
      console.log(fullArticle)

      let check = article.textContent.split('\n')
      let filtered = check.filter(Boolean);
      
      let paragraphsArray =[]
      for(let a=0; a<filtered.length;a++){
        paragraphsArray.push(_.words(filtered[a]))
      }
      
      console.log(paragraphsArray)
       paragraphsArray= paragraphsArray.filter( p =>  p.length )
      console.log(paragraphsArray)
      // res.send(paragraphsArray)
      

      // // fullArticle = fullArticle.slice(284)
      // fullArticle = fullArticle.splice(0,128)
      // // console.log(fullArticle)

      
      //   //GOOGLE TRANSLATE

      let testArray = []
      for(let api=0; api<paragraphsArray.length;api++){
        //What to translate Object
        let text = {
        "q": paragraphsArray[api],
        "source": "en",
        "target": "he",
        "model": "nmt",
        "format": "text"
        }
        
        let request = request.post()
        //API call for the google translate server
        let url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`
        let translatedWords = await request.post({
          url: url,
          body: text,
          json: true
          }, function(error, response, body) 
                {
                  if(error) console.log(error)
                let translatedData = body.data.translations
                //  console.log(translatedData[0].translatedText);
                //  res.send(translatedData.translatedText)
                return translatedData    
                })
                testArray.push(translatedWords)

        }
          // res.send(testArray)
            console.log(testArray)

      //   //start building the words array
          // let almostFinalArray = []
          // for(let i=0; i<fullArticle.length; i++) {
          //     // console.log(translatedWords)
          //     let wordObj = {}
          //     // wordObj[fullArticle[i]] = translatedWords.data.translations[i].translatedText
          //     wordObj.word = fullArticle[i]
          //     wordObj.translatedWord = translatedWords.data.translations[i].translatedText
          //     wordObj.index = i
          //     almostFinalArray.push(wordObj)
          //     // console.log(wordObj)
          //   }
          //   console.log(almostFinalArray)
          
          
          //   for(let i=0; i<fullArticle.length; i++) {
          //     // console.log(translatedWords)
          //     let wordObj = {}
          //     // wordObj[fullArticle[i]] = translatedWords.data.translations[i].translatedText
          //     wordObj.word = fullArticle[i]
          //     wordObj.translatedWord = translatedWords.data.translations[i].translatedText
          //     wordObj.index = i
          //     almostFinalArray.push(wordObj)
          //     // console.log(wordObj)
          //   }
          //   console.log(almostFinalArray)

      //       // let finalArray = []
      //       // finalArray.push(almostFinalArray)
      //       // finalArray.push(article.title)
      //       // finalArray.push(article.byline)
      //       // console.log(fullArticle)
      //       // almostFinalArray.push(article.title)
      //       // console.log(almostFinalArray)
      //       res.send(almostFinalArray)

        })

module.exports = router 


