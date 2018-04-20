const handleDBError = require('./dbConnection').handleError;
const ObjectId = require('mongodb').ObjectID;
let habits;

function init(collection) {
    habits = collection;
    return this;
}

async function checkOwner(userId, habitId) {
    try {
        const doc = await habits.findOne({ _id: ObjectId(habitId) });        
        if (!doc || doc.ownerId !== userId) return false;
        else return true;
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function deleteHabit(habitId) {
    try {
        const doc = await habits.findOneAndDelete({ _id: ObjectId(habitId) });
        return { habitDeleted: true };
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function newHabit(params) {  // ownerId, name, descr, shared
    const profile = getHabitObject(params);
    try {
        const doc = await habits.insertOne(profile);
        return { habitCreated: true, habitId: profile._id };
    }
    catch (e) {
        return handleDBError(e);
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
        checkin: new Date(),
        cheers: []
    };
}

async function getHabitsFrontPage() {
    try {
        const doc = await habits.find({ shared: { $eq: true } }).toArray();        
        if (!doc || doc.length<1 ) return { alert: 'no more records' };
        else return doc;
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function getHabitsOfUser(userId, getall) {  // only when getall is true will this include private habits of a user
    const params = { ownerId: ObjectId(userId).toString() };
    if (getall !== true) {
        params.shared = true;
    }
    try {
        const doc = await habits.find(params).toArray();
        if (!doc || doc.length<1) return { alert: 'no more records' };
        else return doc;
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function checkinHabit(habitId) {
    const timeNow = new Date();
    try {
        const old = await habits.findOne({ _id: ObjectId(habitId)});
        if (sameDay(timeNow, old.checkin)) return { alert: 'you have checked in for this habit today' };
        else {
            const res = await habits.findOneAndUpdate(   // ++height, update timestamp
                { _id: ObjectId(habitId) },
                {
                    $set: { checkin: timeNow },
                    $inc: { height: 1 }
                },
                { returnOriginal: false }
            );
            return res.value;
        }
    }
    catch (e) {
        return handleDBError(e);
    }
}

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

async function finishHabit(habitId) {
    try {
        const res = await habits.findOneAndUpdate(
            { _id: ObjectId(habitId) },
            { $set: { finished: true } },
            { returnOriginal: false }
        );
        return res.value;
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function cheerForHabit(habitId, userId) {
    try {
        const res = await habits.findOneAndUpdate(
            { _id: ObjectId(habitId) },
            { $addToSet: { cheers: userId } },
            { returnOriginal: false }
        );
        return res.value;
    }
    catch (e) {
        return handleDBError(e);
    }
}

module.exports = {
    init: init,
    checkOwner: checkOwner,
    getHabitsFrontPage: getHabitsFrontPage,
    getHabitsOfUser: getHabitsOfUser,
    newHabit: newHabit,
    deleteHabit: deleteHabit,
    finishHabit: finishHabit,
    checkinHabit: checkinHabit,
    cheerForHabit: cheerForHabit
};
