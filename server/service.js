const hash = require('./hashService');
const ObjectId = require('mongodb').ObjectID;
let db, accounts, habbits;

async function init(callback) {
    try {
        db = await require("./dbConnection");
        accounts = db.collection("accounts");
        habbits = db.collection("habbits");
        callback();
    }
    catch (e) {
        return handleError(e);
    }
}

async function newUser(username, password) {
    const profile = { username: username };
    try {
        const res = await accounts.findOne(profile);
        if (res) return { alert: 'username already in use' };
        profile.password = hash.getHashed(password);
        profile.habits = [];
        await accounts.insertOne(profile);
        return { userCreated: true, userId: profile._id };
    }
    catch (e) {
        return handleError(e);
    }
}

async function login(username, password) {
    try {
        const doc = await accounts.findOne({ username: username });
        const hashed = hash.getHashed(password);
        if (!doc || doc.password !== hashed) return { alert: 'username or password not correct' };
        else return { loggedIn: true, username: username, userId: doc._id};
    }
    catch (e) {
        return handleError(e);
    }
}

async function changePw(userId, username, newPw) {
    const hashed = hash.getHashed(newPw);
    try {
        const res = await accounts.updateOne(
            {
                $and: [ { _id : ObjectId(userId)}, {username: username} ]                
            }
            , { $set: { password: hashed } }            
        );        
        if (res.matchedCount === 1) return {pwUpdated : true, username: username };
        else return { alert : 'you are unauthorized to modify other accounts'};
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
    init: init,
    newUser: newUser,
    login: login,
    changePw : changePw
};

