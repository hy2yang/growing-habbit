const mongodb = require('mongodb');

module.exports = new Promise(function (resolve, reject) {
    const path = require('./config').DBPATH;
    mongodb.MongoClient.connect(path, function (err, client) {
        if (err) {
            reject(err);
        }
        else {
            console.log('mongodb connected');
            resolve(client.db());
        }
        
    });
});

