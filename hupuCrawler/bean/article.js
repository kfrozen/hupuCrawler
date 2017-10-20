var mongodb = require('../database/db');

function Article() {
    this.title = arguments[0];
    this.link = arguments[1];
    this.releaseDate = arguments[2];
    this.image = arguments[3];
    this.content = arguments[4];
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

            callback(null, collection);
        });
    });
};

Article.prototype.save = function(collection) {
    var article = {
        _id: this.link,
        link: this.link,
        title: this.title,
        content: this.content,
        releaseDate: this.releaseDate,
        image: this.image
    };

    collection.save(article);
};

module.exports = Article;