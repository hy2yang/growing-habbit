const mongodb = require('mongodb');

let db, accounts, habits;

async function init(callback) {
    try {
        db = await new Promise((resolve, reject) => {
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
        })
        accounts = db.collection("accounts");
        habits = db.collection("habbits");
        callback();
    }
    catch (e) {
        return handleError(e);
    }
}

function handleError(e) {
    console.log(e);
    return { error: 'db connection error' };
}


module.exports = {
    init : init,
    accounts : accounts,
    habits : habits,
    handleError : handleError
}
