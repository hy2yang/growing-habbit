const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const app = express();

const PORT = require('./config').PORT_EXPRESS;
const authService = require('./authService');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});


app.use(jwt({
    secret: require('./config').JWT_SECRET,
    isRevoked: (req, payload, done) => {
        const userId = payload.userId;
        done(null, authService.isRevoked(userId));
    }
}).unless({ path: require('./config').ACCESSIBLE })
);


app.use(function (err, req, res, next) {
    if (err) {
        //console.log(err);
        res.status(401).send(JSON.stringify({ message: 'invalid jwt token' }));
    }
});


app.use(bodyParser.json({ extended: true, type: '*/*' }));

app.use(express.static(path.resolve(__dirname, '../react-ui/build')));


function handleRes(res, resp) {
    if (res.error) resp.status(500);
    else if (res.alert) resp.status(400);
    resp.send(JSON.stringify(res));
}

app.post('/users', (req, resp) => {
    const username = req.body.username;
    const password = req.body.password;
    // todo: check username and pw
    accountService.newUser(username, password).then(res => {
        if (res.userCreated) delete res.userId;
        handleRes(res, resp);
    });
});


app.post('/login', (req, resp) => {
    const username = req.body.username;
    const password = req.body.password;
    // check (regex match is cheaper than db query)
    accountService.login(username, password).then(res => {
        if (res.loggedIn) {
            res.token = authService.generateToken(res.userId);
            delete res.userId;
        }
        handleRes(res, resp);
    });
});


app.post('/logout', (req, resp) => {
    const userId = req.user.userId;
    authService.invalidate(userId);
    resp.send(JSON.stringify({ message: 'logout success' }));
});


app.put('/users/:username/password', (req, resp) => {
    const username = req.params.username;
    const userId = req.user.userId;
    const password = req.body.password;
    // check (regex match is cheaper than db query)
    accountService.changePw(userId, username, password).then(res => handleRes(res, resp));
});


app.get('/users/:username/habits', (req, resp) => {   // same user : get all, other user : get shared
    const userId = req.user.userId;
    const ownerName = req.params.username;

    accountService.checkUser(ownerId, ownerName).then(isOwner => {        
        if (!isOwner || isOwner.error) {
            habitService.getHabitsOfUser(userId, false).then(res => handleRes(res, resp));
        }
        else {
            habitService.getHabitsOfUser(userId, true).then(res => handleRes(res, resp));           
        }
    });
    
});


app.post('/users/:username/habits', (req, resp) => {   // new habit, params in body: ownerId name descr shared
    const ownerId = req.user.userId;
    const ownerName = req.params.username;

    accountService.checkUser(ownerId, ownerName).then(isOwner => {
        if (!isOwner || isOwner.error) {
            handleRes(isOwner, resp);
        }
        else {
            const params = Object.assign(req.body);
            params.ownerId = ownerId;
            habitService.newHabit(params).then(res => handleRes(res, resp));
        }
    });
});


app.delete('/users/:username/habits/:habitId', (req, resp) => {  // delete habit
    const userId = req.user.userId;
    const habitId = req.params.habitId;

    habitService.checkOwner(userId, habitId).then(isOwner => {
        if (!isOwner || isOwner.error) {
            handleRes(isOwner, resp);
        }
        else {
            habitService.deleteHabit(req.params.habitId).then(res => handleRes(res, resp));
        }
    });
});


app.post('/users/:username/habits/:habitId', (req, resp) => {  // user habit checkin
    const userId = req.user.userId;
    const habitId = req.params.habitId;
    habitService.checkOwner(userId, habitId).then(isOwner => {
        if (!isOwner || isOwner.error) {
            handleRes(isOwner, resp);
        }
        else {
            habitService.checkinHabit(req.params.habitId).then(res => handleRes(res, resp));
        }
    });
});


app.post('/habits/:habitId/finished', (req, resp) => {
    const userId = req.user.userId;
    const habitId = req.params.habitId;
    habitService.checkOwner(userId, habitId).then(isOwner => {
        if (!isOwner || isOwner.error) {
            handleRes(isOwner, resp);
        }
        else {
            habitService.finishHabit(req.params.habitId).then(res => handleRes(res, resp));
        }
    });
})


app.post('/habits/:habitId/cheers', (req, resp) => {
    const userId = req.user.userId;
    habitService.cheerForHabit(req.params.habitId, userId).then(res => handleRes(res, resp));
});


app.get('/habits', (req, resp) => {
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;
    habitService.getHabitsFrontPage(page, pageSize).then(res => handleRes(res, resp));
});


service.init(() => {
    this.accountService = require('./accountService');
    this.habitService =require('./habitService');
    app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`);
        console.log('use Ctrl-C to stop this server');
    });
})

