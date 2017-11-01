var http = require("http"),
    request = require('superagent'),
    superagent = require('superagent-charset')(request),
    cheerio = require("cheerio"),
    eventproxy = require('eventproxy'),
    Promise = require('bluebird'),
    Rank = Promise.promisifyAll(require('../bean/rank')),
    DatabaseUtil = require('../database/db');

function innerStartForRanks() {
    var pageUrl = "https://soccer.hupu.com/table/Germany.html";
    var ranks = [];

    superagent
        .get(pageUrl)
        .charset('utf-8')
        .end(function(err, pres){
            if(err){
                console.log(err.message);

                return;
            }

            var $ = cheerio.load(pres.text);

            $("#main_table").find("tbody").children("tr").each(function (i, rankTeam) {
                var rank = null;

                $(rankTeam).children("td").each(function (j, item) {
                    let attribute = $(item);

                    switch (j){
                        case 0:
                            rank = new Rank(attribute.text().trim());

                            break;

                        case 2:
                            rank = rank.teamName(attribute.find("a").text().trim())
                                       .rLink(attribute.find("a").attr("href"));

                            break;

                        case 3:
                            rank = rank.totalGames(attribute.text().trim());

                            break;

                        case 4:
                            rank = rank.wonGames(attribute.text().trim());

                            break;

                        case 5:
                            rank = rank.tiedGames(attribute.text().trim());

                            break;

                        case 6:
                            rank = rank.lostGames(attribute.text().trim());

                            break;

                        case 7:
                            rank = rank.rGoals(attribute.text().trim());

                            break;

                        case 8:
                            rank = rank.rFumbles(attribute.text().trim());

                            break;

                        case 9:
                            rank = rank.goalDifference(attribute.text().trim());

                            break;

                        case 14:
                            rank = rank.totalScores(attribute.text().trim());

                            break;
                    }
                });

                if(rank){
                    ranks.push(rank);
                }
            });

            fetchTeamLogo(ranks);
        });
}

function fetchTeamLogo(ranks){
    var ep = new eventproxy();

    ep.after("TeamLogoTaskDone", ranks.length, function (result) {
        DatabaseUtil.updateCollectionData("Ranks", result);
    });

    ranks.forEach(function (rank) {
        superagent.get(rank.link)
            .charset('utf-8')
            .end(function(err, pres) {
                if (err) {
                    console.log(err.message);

                    return;
                }

                let $ = cheerio.load(pres.text);
                let logoUrl = $("div.main").find("div.left > div.team_info > ul > li.pic_logo > img").attr("src");

                rank.rLogo(logoUrl.replace(/.jpg/, ".png"));

                ep.emit("TeamLogoTaskDone", rank);
            });
    })
}

exports.innerStartForRanks = innerStartForRanks;