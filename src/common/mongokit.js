const mongodb =require("mongodb");
const MongoClient =mongodb.MongoClient;
const ObjectID = mongodb.ObjectID
const dbConfig = require('../../config').dbConfig;
const url = dbConfig.dbPath;
const dbName = dbConfig.dbName;



async function connDB(dbUrl) {

    try {

        const client = await MongoClient.connect(dbUrl,{useNewUrlParser:true});
        if (client.isConnected()) {
        const globalDB=client.db(dbName);

        return globalDB;

        }
    }
    catch(err) {

        console.log("连接失败" + err.message);
    }

}

const  dbPromise = connDB(url);


module.exports = {
    dbPromise,
    ObjectID,
    objectId: {
        newId: function(){
            return new ObjectID();
        }
    }
};

