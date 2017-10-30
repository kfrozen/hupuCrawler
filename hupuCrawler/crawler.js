var http = require("http"),
    articleCrawler = require("./crawlers/articleCrawler"),
    playerCrawler = require("./crawlers/playerCrawler");

function start(){
    function onRequest(req, res){
        if(req.url == '/favicon.ico')
        {
            return;
        }

        console.log('Start working...');

        playerCrawler.innerStartForPlayers();

        articleCrawler.innerStartForArticles(res);
    }
    
    http.createServer(onRequest).listen(4000);
}

exports.start= start;