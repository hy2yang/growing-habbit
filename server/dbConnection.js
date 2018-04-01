const mongodb = require('mongodb');

module.exports = new Promise(function (resolve, reject) {
    const path = process.env.MONGODB_URI? process.env.MONGODB_URI+'/agate-db':'mongodb://localhost:27017/agate-db';
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

