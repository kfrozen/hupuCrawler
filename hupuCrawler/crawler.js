var http = require("http"),
    url = require("url"),
    request = require('superagent'),
    superagent = require('superagent-charset')(request),
    cheerio = require("cheerio"),
    async = require("async"),
    eventproxy = require('eventproxy');

var ep = new eventproxy();

function start(){
    function onRequest(req, res){
        innerStartForArticles(res);
    };
    
    http.createServer(onRequest).listen(3000);
}

function innerStartForArticles(res) {
    var articleUrls = [],
        articleTitles = [],
        pageUrls = [],
        pageNum = 5;

    for(var i=1 ; i<= pageNum ; i++){
        pageUrls.push('https://voice.hupu.com/soccer/tag/487-' + i + '.html');
    }

    for(let i = 0; i < pageUrls.length; i++){
        let pageUrl = pageUrls[i];

        superagent.get(pageUrl).charset('utf-8')
            .end(function(err,pres){
                var $ = cheerio.load(pres.text);

                $("div.list").each(function (i, listItem) {
                    var url = $(listItem).find("span.n1 > a").attr('href');
                    articleUrls.push(url);

                    var title = $(listItem).find("span.n1 > a").text();
                    articleTitles.push(title);

                    ep.emit('ArticleHtml', url, title);
                });
            });
    }

    ep.after('ArticleHtml', pageUrls.length * 30 ,function(articleUrls){
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.write('<br/>');
        res.write('The article list contains ' + articleUrls.length + ' articles' + '<br/>');
        for(let i = 0; i < articleUrls.length; i++)
        {
            // res.write('Title: ' + this.articleTitles[i] + '<br/>');
            res.write('Link: ' + articleUrls[i] + '<br/>');
            res.write('<br/>');
        }
        res.end();
    });
}

exports.start= start;