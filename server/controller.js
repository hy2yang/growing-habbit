const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const app = express();

const PORT = require('./config').PORT_EXPRESS;
const ALLOWED_ORIGINS = require('./config').ALLOWED_ORIGINS;
const REGEX_USERNAME = require('./config').REGEX.USERNAME;
const REGEX_PW = require('./config').REGEX.PW;
const authService = require('./authService');
const db = require('./dbConnection');
let accountService, habitService;

app.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});


app.use(jwt({
    secret: require('./config').JWT_SECRET,
    isRevoked: (req, payload, done) => {
        done(null, authService.isRevoked(payload.toString()));
    }
}).unless({ path: require('./config').ACCESSIBLE, method: 'OPTIONS' })
);


app.use(function (err, req, res, next) {
    if (err) {
        res.status(401).send(JSON.stringify({ alert: 'invalid jwt token' }));
    }
});


app.use(bodyParser.json({ extended: true, type: '*/*' }));

app.use(express.static(path.resolve(__dirname, '../react-ui/build')));


function handleRes(res, resp) {
    if (res.error) resp.status(500);
    else if (res.alert) resp.status(400);
    resp.send(res);
}

app.post('/users', (req, resp) => {
    const username = req.body.username;
    const password = req.body.password;
    if (REGEX_USERNAME.check(username) && REGEX_PW.check(password)) {
        accountService.newUser(username, password).then(res => {
            if (res.userCreated) delete res.userId;
            handleRes(res, resp);
        });
    }
    else {
        handleRes({ alert: 'invalid input' }, resp);
    }

});


app.post('/login', (req, resp) => {
    const username = req.body.username;
    const password = req.body.password;
    if (REGEX_USERNAME.check(username) && REGEX_PW.check(password)) {
        accountService.login(username, password).then(res => {
            if (res.loggedIn) {
                res.token = authService.generateToken(res.userId);
            }
            handleRes(res, resp);
        });
    }
    else {
        handleRes({ alert: 'invalid input' }, resp);
    }
});


app.post('/logout', (req, resp) => {
    authService.invalidate(req.user.toString());
    resp.send(JSON.stringify({ message: 'logout success' }));
});


app.put('/users/:username/password', (req, resp) => {  // change password, not yet implemented in front
    const username = req.params.username;
    const userId = req.user.userId;
    const password = req.body.password;

    if (REGEX_USERNAME.check(username) && REGEX_PW.check(password)) {
        accountService.changePw(userId, username, password).then(res => handleRes(res, resp));
    }
    else {
        handleRes({ alert: 'invalid input' }, resp);
    }
});


app.get('/users/:username/habits', (req, resp) => {   // same user : get all, other user : get shared
    const userId = req.user.userId;
    const ownerName = req.params.username;
    const pageNum = +req.query.pageNum;
    const pageSize = +req.query.pageSize;
    const from = pageNum * pageSize;
    const to = from + pageSize;

    accountService.getUserIdByName(ownerName).then(ownerId => {
        if (ownerId === userId) {
            habitService.getHabitsOfUser(ownerId, true).then(arr => handleRes(handleArray(arr, from, to), resp));
        } else {
            habitService.getHabitsOfUser(ownerId, false).then(arr => handleRes(handleArray(arr, from, to), resp));
        }
    });
});

app.post('/users/:username/habits', (req, resp) => {   // new habit, params in body: name descr shared
    const userId = req.user.userId;
    const ownerName = req.params.username;

    accountService.getUserIdByName(ownerName).then(ownerId => {
        if (ownerId === userId) {
            const params = Object.assign(req.body);
            params.ownerId = userId;
            habitService.newHabit(params).then(res => handleRes(res, resp));
        } else {
            handleRes({ alert: 'you have no permission' }, resp);
        }
    });
});


app.delete('/habits/:habitId', (req, resp) => {  // delete habit
    const userId = req.user.userId;
    const habitId = req.params.habitId;

    habitService.checkOwner(userId, habitId).then(isOwner => {
        if (!isOwner || isOwner.error) {
            handleRes({ alert: 'you have no permission' }, resp);
        }
        else {
            habitService.deleteHabit(req.params.habitId).then(res => handleRes(res, resp));
        }
    });
});


app.post('/habits/:habitId/checkin', (req, resp) => {  // user habit checkin
    const userId = req.user.userId;
    const habitId = req.params.habitId;
    habitService.checkOwner(userId, habitId).then(isOwner => {
        if (!isOwner || isOwner.error) {
            handleRes({ alert: 'you have no permission' }, resp);
        }
        else {
            habitService.checkinHabit(req.params.habitId).then(res => handleRes(res, resp));
        }
    });
});


app.put('/habits/:habitId/finished', (req, resp) => {
    const userId = req.user.userId;
    const habitId = req.params.habitId;
    const finished = req.body.finished;
    habitService.checkOwner(userId, habitId).then(isOwner => {
        if (!isOwner || isOwner.error) {
            handleRes({ alert: 'you have no permission' }, resp);
        }
        else {
            habitService.finishHabit(req.params.habitId, finished).then(res => {
                handleRes(res, resp);
            });
        }
    });
})


app.post('/habits/:habitId/cheers', (req, resp) => {
    const userId = req.user.userId;
    habitService.cheerForHabit(req.params.habitId, userId).then(res => handleRes(res, resp));
});


app.get('/habits', (req, resp) => {
    const pageNum = +req.query.pageNum;
    const pageSize = +req.query.pageSize;
    const from = pageNum * pageSize;
    const to = from + pageSize;
    habitService.getHabitsFrontPage().then(arr => {
        handleRes(handleArray(arr, from, to), resp);
    });
});

function handleArray(arr, from, to) {
    if (arr.error || arr.alert) return arr;
    const habits = arr.slice(from, to);
    if (!habits || habits.length < 1) return { alert: 'no more records' };
    else return { habits: habits, total: arr.length };
}


db.init(() => {
    db.getCollection('habits').then(habits => { habitService = require('./habitService').init(habits) });
    db.getCollection('accounts').then(accounts => { accountService = require('./accountService').init(accounts) });
    app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`);
        console.log('use Ctrl-C to stop this server');
    });
    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });
})

