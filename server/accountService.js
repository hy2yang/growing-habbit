const hash = require('./hashService');
const handleDBError = require('./dbConnection').handleError;
const ObjectId = require('mongodb').ObjectID;
let accounts;

function init(collection){
    accounts = collection;
    return this;
}

async function newUser(username, password) {
    const profile = { username: username };
    try {
        const res = await accounts.findOne(profile);
        if (res) return { alert: 'username already in use' };
        profile.password = hash.getHashed(password);
        await accounts.insertOne(profile);
        return { userCreated: true, userId: profile._id };
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function login(username, password) {
    try {
        const doc = await accounts.findOne({ username: username });
        const hashed = hash.getHashed(password);
        if (!doc || doc.password !== hashed) return { alert: 'username or password not correct' };
        else return { loggedIn: true, username: username, userId: doc._id };
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function changePw(userId, username, newPw) {
    const hashed = hash.getHashed(newPw);
    try {
        const res = await accounts.findOneAndUpdate(
            {
                $and: [{ _id: ObjectId(userId) }, { username: username }]
            }
            , { $set: { password: hashed } }
        );
        if (res.value) return { pwUpdated: true, username: username };
        else return { alert: 'you are unauthorized to modify other accounts' };
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function checkUser(userId, name) {
    try {
        const doc = await accounts.findOne({ _id: ObjectId(userId) });
        if (!doc || doc.username !== name) return false;
        else return true;
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function addHabitId(userId, habitId){
    try {
        const res = await accounts.findOneAndUpdate(
            { _id: ObjectId(userId) },
            { $push: {habits : habitId}}
        );
        if (res.lastErrorObject.updatedExisting) return true;
        else return false;
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function removeHabitId(userId, habitId){
    try {
        const res = await accounts.findOneAndUpdate(
            { _id: ObjectId(userId) },
            { $pull: {habits : habitId}}
        );
        if (res.lastErrorObject.updatedExisting) return true;
        else return false;
    }
    catch (e) {
        return handleDBError(e);
    }
}

module.exports = {   
    init : init, 
    newUser: newUser,
    login: login,
    changePw: changePw,
    checkUser: checkUser
};