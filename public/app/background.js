https = require('https');
r = require('readability-node');
jsdom = require('jsdom').jsdom;

let uri = "https://adambard.com/blog/the-web-is-a-mature-platform/";
https.get(uri, function(res){

    let src = '';
    res.on('data', function(d){ src += d; });
    res.on('end', function(){
    let doc = src
    console.log(doc)
        // let doc = jsdom(src, {features: {
        //     FetchExternalResources: false,
        //     ProcessExternalResources: false
        // }});
        let article = new r.Readability(doc).parse();
        console.log(article.title, "\n\n", article.content);
    });
});