var http = require("http"),
    url = require("url"),
    request = require('superagent'),
    superagent = require('superagent-charset')(request),
    cheerio = require("cheerio"),
    async = require("async"),
    eventproxy = require('eventproxy');
    Article = require('./bean/article');
    mongodb = require('./database/db');

var ep = new eventproxy();

function start(){
    function onRequest(req, res){
        if(req.url == '/favicon.ico')
        {
            return;
        }

        innerStartForArticles(res);
    };
    
    http.createServer(onRequest).listen(3000);
}

function innerStartForArticles(res) {
    var pageUrls = [],
        pageNum = 1;

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
                    var title = $(listItem).find("span.n1 > a").text();
                    var img = $(listItem).find("div.video > a > img").attr('src');
                    var date = $(listItem).find("p.time > a").text();
                    var article = new Article(title, url, date, img);

                    ep.emit('ArticleHtml', article);
                });
            });
    }

    ep.after('ArticleHtml', pageUrls.length * 30 ,function(articles){
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.write('<br/>');
        res.write('The article list contains ' + articles.length + ' articles' + '<br/>');

        Article.obtainProjectCollection(function(err, collection){
            if(err || !collection){
                mongodb.close(true);

                return;
            }

            for(let i = 0; i < articles.length; i++)
            {
                let article = articles[i];

                res.write('Title: ' + article.title + '<br/>');
                res.write('Link: ' + article.link + '<br/>');
                res.write('ImageUrl: ' + article.image + '<br/>');
                res.write('Release Date: ' + article.releaseDate + '<br/>');
                res.write('<br/>');

                article.save(collection);
            }

            mongodb.close(true);

            res.end();
        });
    });
}

exports.start= start;