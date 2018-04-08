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
        else return { loggedIn: true, username: username, userId: doc._id };
    }
    catch (e) {
        return handleError(e);
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
        if (res.matchedCount === 1) return { pwUpdated: true, username: username };
        else return { alert: 'you are unauthorized to modify other accounts' };
    }
    catch (e) {
        return handleError(e);
    }
}

async function checkUser(userId, name) {
    try {
        const doc = await accounts.findOne({ _id: ObjectId(userId) });
        if (!doc || doc.username !== name) return false;
        else return true;
    }
    catch (e) {
        return handleError(e);
    }
}

async function checkOwner(userId, habitId) {
    try {
        const doc = await habits.findOne({ _id: ObjectId(habitId) });
        if (!doc || doc.ownerId !== userId) return false;
        else return true;
    }
    catch (e) {
        return handleError(e);
    }
}

async function deleteHabit(habitId) {
    try {
        const doc = await habbits.findOneAndDelete({ _id: ObjectId(habitId) });
        return { habitDeleted: true };
    }
    catch (e) {
        return handleError(e);
    }
}

async function newHabit(params) {
    const profile = getHabitObject(params);
    try {
        const doc = await habbits.insertOne(profile);
        return { habitCreated: true, habitId: profile._id };
    }
    catch (e) {
        return handleError(e);
    }
}

function getHabitObject(params) {
    return {
        ownerId: params.ownerId,
        name: params.name,
        descr: params.descr,
        shared: params.shared,
        finished: false,
        height: 0,
        checkin: Date.now(),
        cheers: []
    };
}

async function getHabitsFrontPage(page, pageSize) {
    const skip = pageSize * page;
    try {
        const doc = await habbits.find({ shared: { $eq: true } }).skip(skip).limit(pageSize).toArray();
        if (!doc) return { alert: 'no more records' };
        else return doc;
    }
    catch (e) {
        return handleError(e);
    }
}

async function getHabitsOfUser(userId, getall) {  // only when getall is true will this return all habits of a user
    const params = { _id: ObjectId(userId) };
    if (getall !== true){
        params.shared = true;
    }    
    try {
        const doc = await habbits.find(params).toArray();
        if (!doc) return { alert: 'no more records' };
        else return doc;
    }
    catch (e) {
        return handleError(e);
    }
}

async function checkinHabit(habitId) {
    try {
        const res = await habbits.findOneAndUpdate(   // ++height, update timestamp
            { _id: ObjectId(habitId) },
            {
                $currentDate: { checkin: true },
                $inc: { height: 1 }
            },
            { returnOriginal: flase }
        );
        return res;
    }
    catch (e) {
        return handleError(e);
    }
}

async function finishHabit(habitId) {
    try {
        const res = await habbits.findOneAndUpdate(
            { _id: ObjectId(habitId) },
            { $set: { finished: true } },
            { returnOriginal: flase }
        );
        return res;
    }
    catch (e) {
        return handleError(e);
    }
}

async function cheerForHabit(habitId, userId) {
    try {
        const res = await habbits.findOneAndUpdate(
            { _id: ObjectId(habitId) },
            { $addToSet: { cheers: userId } },
            { returnOriginal: flase }
        );
        return res;
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
    changePw: changePw,
    checkUser: checkUser,
    checkOwner : checkOwner,
    getHabitsFrontPage: getHabitsFrontPage,
    getHabitsOfUser: getHabitsOfUser,
    newHabit: newHabit,
    deleteHabit: deleteHabit,
    finishHabit: finishHabit,
    checkinHabit : checkinHabit,
    cheerForHabit :cheerForHabit
};

