const handleDBError = require('./dbConnection').handleError;
const ObjectId = require('mongodb').ObjectID;
let habits;

function init(collection){
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
        checkin: Date.now(),
        cheers: []
    };
}

async function getHabitsFrontPage(page, pageSize) {
    const skip = pageSize * page;
    try {
        const doc = await habits.find({ shared: { $eq: true } }).skip(skip).limit(pageSize).toArray();
        if (!doc) return { alert: 'no more records' };
        else return doc;
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function getHabitsOfUser(userId, getall) {  // only when getall is true will this return all habits of a user
    const params = { _id: ObjectId(userId) };
    if (getall !== true){
        params.shared = true;
    }    
    try {
        const doc = await habits.find(params).toArray();
        if (!doc) return { alert: 'no more records' };
        else return doc;
    }
    catch (e) {
        return handleDBError(e);
    }
}

async function checkinHabit(habitId) {
    try {
        const res = await habits.findOneAndUpdate(   // ++height, update timestamp
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
        return handleDBError(e);
    }
}

async function finishHabit(habitId) {
    try {
        const res = await habits.findOneAndUpdate(
            { _id: ObjectId(habitId) },
            { $set: { finished: true } },
            { returnOriginal: flase }
        );
        return res;
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
            { returnOriginal: flase }
        );
        return res;
    }
    catch (e) {
        return handleDBError(e);
    }
}

module.exports = {   
    init : init,  
    checkOwner : checkOwner,
    getHabitsFrontPage: getHabitsFrontPage,
    getHabitsOfUser: getHabitsOfUser,
    newHabit: newHabit,
    deleteHabit: deleteHabit,
    finishHabit: finishHabit,
    checkinHabit : checkinHabit,
    cheerForHabit :cheerForHabit
};
