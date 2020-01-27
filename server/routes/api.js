      const express = require('express')
      const router = express.Router()
      const request = require('request-promise')
      const jsdom = require('jsdom')
      const { JSDOM } = jsdom;
      const _ = require('lodash')
      const read = require('moz-readability-node');
      require('dotenv').config()


      router.get('/', async function (req, res) {

        //RIPPING THE ARTICLE

        //gets the HTML from the URL
        let webData = await request('https://blog.ycombinator.com/hardware-less-hard/')
        // let webData = await request('https://blog.ycombinator.com/scaling-growth-panel/')
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

        let paragraphsArray = []
        for (let a = 0; a < filtered.length; a++) {
          paragraphsArray.push(_.words(filtered[a]))
        }

        console.log(paragraphsArray)
        paragraphsArray = paragraphsArray.filter(p => p.length)
        console.log(paragraphsArray)
        // res.send(paragraphsArray)


        //   //GOOGLE TRANSLATE

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
          console.log("this is values",values);
          // res.send(values)

          // start building the words array
          let almostFinalArray = []
          for(let i=0; i<paragraphsArray.length; i++) {
            for(let j=0; j<paragraphsArray[i].length; j++){
              
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
        });
        // res.send(promiseArray)
        console.log(promiseArray)





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


      //Stash


            // let testArray = []
            // for(let api=0; api<paragraphsArray.length;api++){
            //   //What to translate Object
            //   let text = {
            //   "q": paragraphsArray[api],
            //   "source": "en",
            //   "target": "he",
            //   "model": "nmt",
            //   "format": "text"
            //   }

            //   //API call for the google translate server
            //   let url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`
            //   let translatedWords = await request.post({
            //     url: url,
            //     body: text,
            //     json: true
            //     }, function(error, response, body) 
            //           {
            //             if(error) console.log(error)
            //           let translatedData = body.data.translations
            //           //  console.log(translatedData[0].translatedText);
            //           //  res.send(translatedData.translatedText)
            //           return translatedData    
            //           })
            //           testArray.push(translatedWords)

            //   }
            //     res.send(testArray)
            //       console.log(testArray)
