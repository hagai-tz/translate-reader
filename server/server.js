const express = require('express');
const app = express();
const path = require('path');
const api = require('./routes/api')

const mongoose = require('mongoose')
const bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, '...', 'node_modules')));

//MongoDB setup
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
mongoose.connect("mongodb://localhost/paragraph-article-cacheDB", { useNewUrlParser: true, useUnifiedTopology: true  })



app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

    next()
})


app.use('/', api)

const port = 8000;
app.listen(port, function() {
  console.log(`Running on port ${port}`);
});
