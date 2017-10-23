var http = require("http"),
    url = require("url"),
    request = require('superagent'),
    superagent = require('superagent-charset')(request),
    cheerio = require("cheerio"),
    async = require("async"),
    Promise = require('bluebird'),
    eventproxy = require('eventproxy'),
    Article = Promise.promisifyAll(require('./bean/article')),
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
        pageNum = 1,
        loadedArticleList = [];

    for(var i=1 ; i<= pageNum ; i++){
        pageUrls.push('https://voice.hupu.com/soccer/tag/487-' + i + '.html');
    }

    for(let i = 0; i < pageUrls.length; i++){
        let pageUrl = pageUrls[i];

        superagent
            .get(pageUrl)
            .charset('utf-8')
            .then(function(pres){
                var $ = cheerio.load(pres.text);

                $("div.list").each(function (i, listItem) {
                    let url = $(listItem).find("span.n1 > a").attr('href');
                    let title = $(listItem).find("span.n1 > a").text();
                    let date = $(listItem).find("p.time > a").text();
                    let article = new Article(title, url, date);

                    ep.emit('ArticleHtmlFirstRound', article);
                });
            });
    }

    ep.after('ArticleHtmlFirstRound', pageUrls.length * 30 ,function(articles){
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.write('<br/>');
        res.write('The article list contains ' + articles.length + ' articles' + '<br/>');

        loadedArticleList = articles;

        loadedArticleList.forEach(function (article) {
            res.write('Title: ' + article.title + '<br/>');
            res.write('Link: ' + article.link + '<br/>');
            res.write('Release Date: ' + article.releaseDate + '<br/>');
            res.write('<br/>');

            superagent
                .get(article.link)
                .charset('utf-8')
                .then(function(pres){
                    let $ = cheerio.load(pres.text);

                    article.image = $("div.artical-importantPic > img").attr("src");

                    $("div.artical-main-content").each(function (i, p) {
                        article.content += $(p).text();
                    });

                    ep.emit('ArticleHtmlSecondRound');
                });
        });

        res.end();
    });

    ep.after('ArticleHtmlSecondRound', pageUrls.length * 30 ,function(){
        Article.obtainProjectCollectionAsync()
            .then(function(collection){
                collection.remove({});

                collection.insertMany(loadedArticleList);

                mongodb.close(true);
            })
            .catch(function (err) {
                mongodb.close(true);

                res.end(err.message);
            })
    });
}

exports.start= start;