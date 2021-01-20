// mongodb driver
const mongodb = require('mongodb');
const MongoClient = require("mongodb").MongoClient;
const dbConnectionUrl = "mongodb+srv://dbUser:dbPassword@cluster0.gtvws.mongodb.net/dbCollection?retryWrites=true&w=majority";


module.exports = {
    initialize
};


function initialize(dbName, dbCollectionName, successCallback, failureCallback ) {
    MongoClient.connect(dbConnectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, dbInstance) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err); // this should be "caught" by the calling function
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);

            console.log(`[Connected to: ${dbName} using ${dbCollectionName}]`);
            successCallback(dbCollection);
        }
    });
}

