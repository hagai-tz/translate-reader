const express = require('express');
const router = express.Router();
const request = require('request-promise');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const _ = require('lodash');
const read = require('moz-readability-node');
const ArticleCache = require('../../src/model/articleCacheSchema');
require('dotenv').config();

router.get('/url', async function (req, res) {
  let url = req.query.url;
  let lang = req.query.lang;

  //Searching for Article in the DB
  const isUserArticleCachedBoolean = await ArticleCache.find({ articleURLId: url }, function (err, articleData) {
    if (err) {
      console.log('err: ', err);
      return;
    } return articleData;
  }
  );

  if (isUserArticleCachedBoolean.length === 0) {
    console.log("True")

    //RIPPING THE ARTICLE
    //gets the HTML from the URL
    let webData = await request(url);

    //turn the HTML into DOM document
    const dom = new JSDOM(webData);

    //use the readability library to parse the DOM document into a JSON free from all the clutter.
    const article = new read.Readability(dom.window.document).parse();
    console.log(article);

    let filtered = article.textContent.split('\n');
    filtered = filtered.filter(Boolean);

    let paragraphsArray = [];
    for (let a = 0; a < filtered.length; a++) {
      paragraphsArray.push(_.words(filtered[a]));
    }
    //Deleting empty array elements from the main array
    paragraphsArray = paragraphsArray.filter(p => p.length);

    //spliting arrays that are bigger than 125 charecthers
    let indexObject = [];
    for (let x = 0; x < paragraphsArray.length; x++) {
      if (paragraphsArray[x].length > 125) {
        let leftOverArray = paragraphsArray[x].splice(125);
        paragraphsArray.splice(x + 1, 0, leftOverArray);
        indexObject.push(x);
      }
    }

    console.log(indexObject);
    // res.send(paragraphsArray)

    ////GOOGLE TRANSLATE

    let promiseArray = [];

    for (let api = 0; api < paragraphsArray.length; api++) {
      //What to translate Object
      let text = {
        q: paragraphsArray[api],
        source: 'en',
        target: lang,
        model: 'nmt',
        format: 'text'
      };

      //API call for the google translate server
      let url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
      let translatedWords = request.post({
        url: url,
        body: text,
        json: true
      });
      promiseArray.push(translatedWords);
    }

    Promise.all(promiseArray).then(function (values) {
      console.log('this is values', values);
      // res.send(values)

      // start building the words array
      let almostFinalArray = [];
      for (let i = 0; i < paragraphsArray.length; i++) {
        for (let j = 0; j < paragraphsArray[i].length; j++) {
          let wordObj = {};
          wordObj.word = paragraphsArray[i][j];
          wordObj.difficultyLevel = (paragraphsArray[i][j].length / 10) * 100;
          wordObj.translatedWord =
            paragraphsArray[i][j].length < 3
              ? null
              : isNaN(paragraphsArray[i][j])
                ? values[i].data.translations[j].translatedText
                : null;
          almostFinalArray.push(wordObj);
        }
        // console.log(translatedWords)
      }

      //Reassembling the array after translation
      for (let a = 0; a < indexObject.length; a++) {
        let concatElement = paragraphsArray[indexObject[a]].concat(
          paragraphsArray[indexObject[a] + 1]
        );
        paragraphsArray.splice(indexObject[a], 1, concatElement);
        //  paragraphsArray[indexObject[a]] =  paragraphsArray[indexObject[a]].concat(paragraphsArray[indexObject[a+1]])
        console.log(paragraphsArray);
      }
      // res.send(almostFinalArray)

      let finalArray = {
        content: almostFinalArray,
        title: article.title,
        author: article.byline,
        link: url,
        readingTime: Math.round(almostFinalArray.length / 200),
        excerpt: article.excerpt
      };


      //Checking if the translation is already exists in the DB
      //Save Article to the DB
      const finalArraySavedForDB = new ArticleCache({
        articleURLId: url,
        targetLanguageTranslation: lang,
        dateCreated: Date(),
        translatedArticleContent: finalArray,
        cached: true
      });
       finalArraySavedForDB.save();

      console.log(finalArray);
      // console.log(article);
      res.send(finalArray);
    });

  } else {
    console.log("False")
    res.send(isUserArticleCachedBoolean)
  }

});

module.exports = router;
