var http = require("http"),
    request = require('superagent'),
    superagent = require('superagent-charset')(request),
    cheerio = require("cheerio"),
    async = require("async"),
    Promise = require('bluebird'),
    eventproxy = require('eventproxy'),
    Player = Promise.promisifyAll(require('../bean/player')),
    mongodb = require('../database/db');

var invalidPlayers = ["Sven Bender", "Ousmane Dembélé", "Emre Mor", "Mikel Merino",
                    "Matthias Ginter", "Felix Passlack"];

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

    var ep = new eventproxy();
    var players = [];

    superagent
        .get(pageUrl)
        .charset('utf-8')
        .then(function(pres){
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
                            players.push(new Player(name, jersey, position, nationality, age, link));
                        }
                    }
                });
            });

            ep.emit('PlayerHtmlFirstRound', players);
        });

    ep.on('PlayerHtmlFirstRound' ,function(players){
        Player.obtainProjectCollectionAsync()
            .then(function(collection){
                collection.remove({});

                collection.insertMany(players);

                mongodb.close(true);
            })
            .catch(function (err) {
                mongodb.close(true);
            })
    });
}

exports.innerStartForPlayers = innerStartForPlayers;