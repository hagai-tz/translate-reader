const express = require('express')
const router = express.Router()
const request = require('request-promise')
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const _ = require('lodash')
const read = require('moz-readability-node');
require('dotenv').config()

router.get('/', async function(req, res){
      //gets the HTML from the URL
      let webData = await request('https://blog.ycombinator.com/before-you-grow/')
      //turn the HTML into DOM document
      const dom = new JSDOM(webData);
      console.log(dom)
      //use the readability library to parse the DOM document into a JSON free from all the clutter.
      const article = new read.Readability(dom.window.document).parse()
      console.log(article)
      let articleHTML = article.content
      // console.log(articleHTML)
      //start cleaning the text for translation
      //turn everything to lower case, array of words and than remove duplicates
      // article.textContent = article.textContent.replace(/[“”—"↩’.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
      // console.log(article.textContent)
      // article.textContent = article.textContent.toLowerCase()
      // console.log(article.textContent)
      
      // article.textContent = article.textContent.replace(/[“”—"↩’.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
      let fullArticle = _.words(article.textContent)
      fullArticle = fullArticle.slice(284)
      
      // let wordsArray = [... new Set(_.words(article.textContent))]
      // console.log(wordsArray)
      // wordsArray = wordsArray.slice(550)
      console.log(fullArticle)


      //Google translate
      let text = {
        "q": fullArticle,
        "source": "en",
        "target": "he",
        "model": "nmt",
        "format": "text"
      }
      // let text = {
      //   "q": wordsArray,
      //   "source": "en",
      //   "target": "he",
      //   "model": "nmt",
      //   "format": "text"
      // }

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

          let almostFinalArray = []

          // for(let i=0; i<wordsArray.length; i++) {
          //     // console.log(translatedWords)
          //     let wordObj = {}
          //     wordObj.word = wordsArray[i]
          //     wordObj.translatedWord = translatedWords.data.translations[i].translatedText
          //     almostFinalArray.push(wordObj)
          //     // console.log(wordObj)
          //    }

          // for(let i=0; i<wordsArray.length; i++) {
          //     // console.log(translatedWords)
          //     let wordObj = {}
          //     wordObj[wordsArray[i]] = translatedWords.data.translations[i].translatedText
          //     wordObj.word = wordsArray[i]
          //     wordObj.translatedWord = translatedWords.data.translations[i].translatedText
          //     almostFinalArray.push(wordObj)
          //     // console.log(wordObj)
          //   }
          //   console.log(almostFinalArray)

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
            
            let finalArray = almostFinalArray.map(word => {
                  return (`<span id=${word.index}> ${word.word} <span class='translatedWord'> ${word.translatedWord}</span> </span>`)
            }).join(' ')

            res.send(finalArray)



          //appending the words back to the text
             for(i=0; i<fullArticle.length; i++ ) {
               let wordPositionCounter = 0

                  for(let j=0; j<almostFinalArray.length; j++) {
                    
                    if(fullArticle[i] === almostFinalArray[j].word) {
                        let wordToPush = (`<span id=${i+1}>${almostFinalArray[j].translatedWord}</span>`)
                        console.log(wordToPush)
                        fullArticle.splice(i, 0, wordToPush)
                        // fullArticle[i].push(wordToPush)
                        }
                      //  console.log("i: ", i) 
                       console.log("j: ", j) 
                      //  console.log("Wordcounter: \t", wordPositionCounter) 
                       wordPositionCounter++
                      }
              }
             console.log(fullArticle)
            //  for(i=0; i<fullArticle.length; i++ ) {
            //    let wordPositionCounter = 0

            //       for(let j=0; j<almostFinalArray.length; j++) {
                    
            //         if(fullArticle[i] === almostFinalArray[j].word) {
            //             let wordToPush = (`<span id=${i+1}>${almostFinalArray[j].translatedWord}</span>`)
            //             console.log(wordToPush)
            //             fullArticle.splice(i, 0, wordToPush)
            //             // fullArticle[i].push(wordToPush)
            //             }
            //           //  console.log("i: ", i) 
            //            console.log("j: ", j) 
            //           //  console.log("Wordcounter: \t", wordPositionCounter) 
            //            wordPositionCounter++
            //           }
            //   }
            //  console.log(fullArticle)



          console.log(almostFinalArray)
        res.send(almostFinalArray)
        
        })

module.exports = router 


