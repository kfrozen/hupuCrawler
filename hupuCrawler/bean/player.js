var mongodb = require('../database/db');

function Player() {
    this.name = arguments[0];
    this.jersey = fixPlayerJersey(this.name, arguments[1]);
    this.position = arguments[2];
    this.nationality = arguments[3];
    this.age = arguments[4];
    this.link = arguments[5];
}

Player.obtainProjectCollection = function(callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('Players', function (err, collection) {
            if (err) {
                mongodb.close(true);

                return callback(err);
            }

            return callback(null, collection);
        });
    });
};

function fixPlayerJersey(name, orgJersey){
    if(name == "Mario Götze"){
        return "10";
    }
    else if(name == "André Schürrle"){
        return "21";
    }
    else if(name == "Marc Bartra"){
        return "5";
    }
    else if(name == "Neven Subotic"){
        return "4";
    }
    else if(name == "Sebastian Rode"){
        return "18";
    }
    else if(name == "Dzenis Burnic"){
        return "31";
    }
    else if(name == "Maximilian Philipp"){
        return "20";
    }

    return orgJersey;
}

module.exports = Player;