var http = require("http"),
    request = require('superagent'),
    superagent = require('superagent-charset')(request),
    cheerio = require("cheerio"),
    async = require("async"),
    Promise = require('bluebird'),
    eventproxy = require('eventproxy'),
    Player = Promise.promisifyAll(require('../bean/player')),
    DatabaseUtil = require('../database/db');

var invalidPlayers = ["Sven Bender", "Ousmane Dembélé", "Emre Mor", "Mikel Merino",
                    "Matthias Ginter", "Felix Passlack"];

var ep = new eventproxy();

function isValidPlayer(name) {
    var isValid = true;

    invalidPlayers.forEach(function (playerName) {
        if(name == playerName){
            isValid = false;
        }
    });

    return isValid;
}

function innerStartForPlayers() {
    var pageUrl = "https://soccer.hupu.com/teams/373";
    var players = [];

    superagent
        .get(pageUrl)
        .charset('utf-8')
        .end(function(err, pres){
            if(err){
                console.log(err.message);

                return;
            }

            var $ = cheerio.load(pres.text);

            $("table.team_player").each(function (i, tableItem) {
                let tableRows= $(tableItem).children("tr");

                tableRows.each(function (i, item) {
                    let row = $(item);

                    if(row.attr('class') != "tp_bg"){
                        var jersey = "",
                            age = "",
                            name = "",
                            nationality = "",
                            link = "",
                            position = "";

                        row.children("td").each(function (i, td) {
                            let attribute = $(td);

                            switch (i){
                                case 0:
                                    jersey = attribute.text().trim();

                                    break;

                                case 2:
                                    name = attribute.find("a").text().trim();
                                    link = attribute.find("a").attr("href");

                                    break;

                                case 3:
                                    age = attribute.text().trim();

                                    break;

                                case 4:
                                    nationality = attribute.text().trim();

                                    break;

                                case 5:
                                    position = attribute.text().trim();

                                    break;
                            }
                        });

                        if(isValidPlayer(name) == true){
                            players.push(new Player(name, jersey, position, nationality, link, age));
                        }
                    }
                });
            });

            ep.emit('PlayerHtmlFirstRound', players);
        });

    ep.once('PlayerHtmlFirstRound' ,function(players){

        ep.after("PlayerDetailInfoLoaded", players.length, function (playerList) {

            DatabaseUtil.updateCollectionData("Players", playerList);
        });

        players.forEach(function (player) {
            fetchPlayerDetailInfo(player);
        });
    });
}

function fetchPlayerDetailInfo(player) {
    superagent
        .get(player.link)
        .charset('utf-8')
        .end(function(err, pres){
            if(err){
                console.log(err.message);

                return;
            }

            var $ = cheerio.load(pres.text);
            var image = "";
            var height = "";
            var weight = "";

            $('ul.player_detail').children('li').each(function (i, item) {

                if(i == 0) {
                    image = $(item).find('img').attr('src');
                }
                else if(i == 1) {
                    let spans = $(item).children('span');
                    weight = $(spans[2]).text();
                }
                else if(i == 2) {
                    let spans = $(item).children('span');
                    height = $(spans[0]).text();
                }
            });

            player.mergeDetailInfo(image, height, weight);

            ep.emit("PlayerDetailInfoLoaded", player);
        });
}

exports.innerStartForPlayers = innerStartForPlayers;