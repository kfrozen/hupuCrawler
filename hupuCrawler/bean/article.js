var mongodb = require('../database/db');

function Article() {
    this.title = arguments[0];
    this.link = arguments[1];
    this.releaseDate = arguments[2];
    this.image = arguments[3];
    this.content = "";
    this._id = this.link;
}

Article.obtainProjectCollection = function(callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('Articles', function (err, collection) {
            if (err) {
                mongodb.close(true);

                return callback(err);
            }

            return callback(null, collection);
        });
    });
};

module.exports = Article;