var mongodb = require('../database/db');

function Player() {
    this.name = arguments[0];
    this.jersey = fixPlayerJersey(this.name, arguments[1]);
    this.position = arguments[2];
    this.nationality = arguments[3];
    this.link = arguments[4];
    this.age = arguments[5];
    this._id = this.name + "_" + this.jersey;
    this._section = generateSortSection(this.position);
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

Player.prototype.mergeDetailInfo = function () {
    this.image = arguments[0];
    this.height = arguments[1];
    this.weight = arguments[2];
};

function generateSortSection(position) {
    if(position == "门将"){
        return 1;
    }
    else if(position == "后卫"){
        return 2;
    }
    else if(position == "中场"){
        return 3;
    }
    else if(position == "前锋"){
        return 4;
    }

    return 5;
}

function fixPlayerJersey(name, orgJersey){
    if(name == "Mario Götze"){
        return 10;
    }
    else if(name == "André Schürrle"){
        return 21;
    }
    else if(name == "Marc Bartra"){
        return 5;
    }
    else if(name == "Neven Subotic"){
        return 4;
    }
    else if(name == "Sebastian Rode"){
        return 18;
    }
    else if(name == "Dzenis Burnic"){
        return 31;
    }
    else if(name == "Maximilian Philipp"){
        return 20;
    }

    return parseInt(orgJersey);
}

module.exports = Player;