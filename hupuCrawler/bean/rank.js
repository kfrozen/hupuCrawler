function Rank(rank) {
    this._id = parseInt(rank);
}

Rank.prototype.teamName = function (team) {
    this.team = team;

    return this;
};

Rank.prototype.rLink = function (link) {
    this.link = link;

    return this;
};

Rank.prototype.rLogo = function (logo) {
    this.logo = logo;

    return this;
};

Rank.prototype.totalGames = function (total) {
    this.total = total;

    return this;
};

Rank.prototype.wonGames = function (won) {
    this.won = won;

    return this;
};

Rank.prototype.tiedGames = function (tied) {
    this.tied = tied;

    return this;
};

Rank.prototype.lostGames = function (lost) {
    this.lost = lost;

    return this;
};

Rank.prototype.rGoals = function (goal) {
    this.goal = goal;

    return this;
};

Rank.prototype.rFumbles = function (fumble) {
    this.fumble = fumble;

    return this;
};

Rank.prototype.goalDifference = function (goalDiff) {
    this.goalDiff = goalDiff;

    return this;
};

Rank.prototype.totalScores = function (scores) {
    this.scores = scores;

    return this;
};

module.exports = Rank;