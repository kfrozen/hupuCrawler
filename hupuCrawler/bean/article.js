function Article(title, link) {
    this.title = title;
    this.link = link;
    this._id = this.link;
}

Article.prototype.aReleaseDate = function (date) {
    this.releaseDate = date;

    return this;
};

Article.prototype.aImage = function (image) {
    this.image = image;

    return this;
};

Article.prototype.aContent = function (content) {
    this.content = content;

    return this;
};

module.exports = Article;