const mongodb = require('mongodb');

let db, accounts, habits;

async function init(callback) {
    try {
        db = await new Promise((resolve, reject) => {
            const path = require('./config').DBPATH;
            mongodb.MongoClient.connect(path, {uri_decode_auth: true}, function (err, client) {
                if (err) {
                    reject(err);
                }
                else {
                    console.log('mongodb connected');
                    resolve(client.db());
                }

            });
        })
        callback();
    }
    catch (e) {
        return handleError(e);
    }
}

async function getCollection(name){
    try{
        return await db.collection(name);
    }
    catch(e){
        handleError(e);
    }
}

function handleError(e) {
    console.log(e);
    return { error: 'db connection error' };
}


module.exports = {
    init : init,
    handleError : handleError,
    getCollection : getCollection
}
