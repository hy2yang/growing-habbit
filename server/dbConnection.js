const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

const CONTACTS_COLLECTION = "contacts";

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
let db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/agate-db", function (err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");
});

// CONTACTS API ROUTES BELOW