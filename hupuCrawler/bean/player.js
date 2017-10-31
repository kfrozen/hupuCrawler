function Player(name, jersey) {
    this.name = name;

    this.jersey = fixPlayerJersey(this.name, jersey);

    this._id = this.name + "_" + this.jersey;
}

Player.prototype.pPosition = function (position) {
    this.position = position;

    this._section = generateSortSection(this.position);

    return this;
};

Player.prototype.pNationality = function (nationality) {
    this.nationality = nationality;

    return this;
};

Player.prototype.pLink = function (link) {
    this.link = link;

    return this;
};

Player.prototype.pAge = function (age) {
    this.age = age;

    return this;
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
    else if(name == "Mahmoud Dahoud"){
        return 19;
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