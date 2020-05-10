// server.js
//https://github.com/lenmorld/devto_posts/blob/master/quick_node_express_mongodb/server.js

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = 3000;

// parse JSON (application/json content-type)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// << db setup >>
const db = require("./db");
//const dbName = "sample_weatherdata";
const dbName = "test";
//const dbCollectionName = "data";
const dbCollectionName = "test";

// << db init >>
db.initialize(dbName, dbCollectionName, function(dbCollection) { 
    // successCallback
    // get all items
    const ObjectId = require('mongodb').ObjectID;

    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
    });

    app.get('/', function(req, res) {
        res.sendFile('index.html');
    });

    // CRUD
    //create
    app.post("/items", (req, res) => {
        const item = req.body;
        //const item = {name: "Mats", adress: "Trumpetvägen"};
        console.log("Added item: ", item);
        dbCollection.insertOne(item, (error, result) => { 
            // callback of insertOne
            if (error) throw error;
            // return updated list
            dbCollection.find().toArray((_error, _result) => { 
                // callback of find
                if (_error) throw _error;
                res.json(_result);
            });
        });
    });

    //read one
    app.get("/items/:_id", (req, res) => {
        const itemId = req.params._id;
        console.log("Read item: ", itemId);
        dbCollection.findOne({ "_id": ObjectId(itemId) }, (error, result) => {
            if (error) throw error;
            // return item
            res.json(result);
        });
    });

    //read all
    app.get("/items", (req, res) => {
        // return updated list
        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            res.json(result);
            /*
            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    console.log(key);
                }
            }
            */
        });
    });

    //update
    app.put("/items/:_id", (req, res) => {
        const itemId = req.params._id;
        const item = req.body;
        console.log("Editing item: ", itemId, " to be ", item);
    
        dbCollection.updateOne({"_id": ObjectId(itemId) }, { $set: item }, (error, result) => {
            if (error) throw error;
            // send back entire updated list, to make sure frontend data is up-to-date
            dbCollection.find().toArray(function(_error, _result) {
                if (_error) throw _error;
                res.json(_result);
            });
        });
    });

    //delete
    app.delete("/items/:_id", (req, res) => {
        const itemId = req.params._id;
        console.log("Delete item with id: ", itemId);
    
        dbCollection.deleteOne({ "_id": ObjectId(itemId) }, function(error, result) {
            if (error) throw error;
            // send back entire updated list after successful request
            dbCollection.find().toArray(function(_error, _result) {
                if (_error) throw _error;
                res.json(_result);
            });
        });
    });

}, function(err) { 
    // failureCallback
    throw (err);
});


app.listen(port, () => {
    console.log(`[Server at ${port}]`);
});