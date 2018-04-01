const mongodb = require('mongodb');

module.exports = new Promise(function (resolve, reject) {
    mongodb.MongoClient.connect((process.env.MONGODB_URI || 'mongodb://localhost:27017/agate-db'), function (err, client) {
        if (err) {
            reject(err);
        }
        else {
            console.log('mongodb connected');
            resolve(client.db());
        }
        
    });
});

