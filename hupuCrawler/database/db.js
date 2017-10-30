var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/HupuCrawlerDB';

function DatabaseUtil() {

}

DatabaseUtil.updateCollectionData = function (collectionName, dataList) {
    MongoClient.connect(url, function(err, db) {
        if(!err){
            var collection = db.collection(collectionName);

            collection.deleteMany({})
                .then(function (r) {
                    return collection.insertMany(dataList);
                })
                .then(function (r) {
                    return db.close();
                })
                .catch(function (err) {
                    console.log(err.message);

                    db.close();
                })
        }
    });
};

module.exports = DatabaseUtil;