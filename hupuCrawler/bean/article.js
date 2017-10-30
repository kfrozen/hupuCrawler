var mongodb = require('../database/db');

function Article() {
    this.title = arguments[0];
    this.link = arguments[1];
    this.releaseDate = arguments[2];
    this.image = arguments[3];
    this.content = "";
    this._id = this.link;
}

module.exports = Article;