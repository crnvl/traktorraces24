const users = require('../users.json');
const sessions = require('../sessions.json');
const fs = require('fs/promises');
const makeId = require('../utils/sessionKeyGen');

const systemRouter = function (app) {
    app.get('/', (req, res) => {
        res.json({
            statusCode: 200,
            documentation: "https://github.com/angelsflyinhell/PaladinsAssistant",
            sponsor: "https://ko-fi.com/azamivisuals"
        })
    })

    app.post('/register', (req, res) => {

        let alreadyExists;
        for (var i = 0; i < users.length; i++) {
            if (users[i].username === req.body.username)
                alreadyExists = true;

            if (users[i].email === req.body.email)
                alreadyExists = true;
        }
        if (alreadyExists) {
            res.json({
                "success": false,
                "message": "already registered"
            })
            return;
        }

        if (req.body.username === '' || req.body.email === '' || req.body.password === '') {
            res.json({
                "success": false,
                "message": "credentials cannot be empty"
            })
        }

        users.push({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            credits: 0
        })

        fs.writeFile("./users.json", JSON.stringify(users), () => {
            console.log('user registerd')
            console.log(users)
        })

        res.json({
            "success": true,
            "message": "user registered"
        })
    })

    app.post('/login', (req, res) => {
        for (var i = 0; i < users.length; i++) {
            if (users[i].email === req.body.email || users[i].username === req.body.username && users[i].password === req.body.password) {

                const sessionKey = makeId(64);
                sessions.push({
                    "username": req.body.username,
                    "email": req.body.email,
                    "sessionKey": sessionKey
                })

                res.json({
                    "success": true,
                    "message": "user authorized",
                    "sessionKey": sessionKey
                })

                fs.writeFile("./sessions.json", JSON.stringify(sessions)).then(() => {
                    console.log('saved sessionKey')
                    console.log(sessions)
                })
            }
        }

        res.json({
            "success": false,
            "message": "user not authorized"
        })
    })

    app.get('/@me/settings', (req, res) => {
        const sessionKey = req.query.sessionToken;


        for (let i = 0; i < sessions.length; i++) {
            if (sessionKey === sessions[i].sessionKey) {
                for (let x = 0; x < users.length; x++) {
                    if (users[x].username === sessions[i].username) {
                        res.json({
                            "success": true,
                            "message": "authorized",
                            "details": {
                                "email": users[x].email,
                                "username": users[x].username,
                                "balance": users[x].credits,
                                "ranking": users[x].ranking,
                                "description": users[x].description
                            }
                        })
                        return;
                    }
                }
            }
        }

        res.json({
            "success": false,
            "message": "session doesn't exist"
        })
    })

    app.get('/user/:username', (req, res) => {
        const username = req.params.username;

        for (let i = 0; i < users.length; i++) {
            if (username === users[i].username) {
                res.json({
                    "username": users[i].username,
                    "description": users[i].description,
                    "avatar": users[i].avatarUrl
                })
                return;
            }
        }

        res.json({
            "username": '404',
            "description": 'Dieser Nutzer existiert nicht.',
        })
        return;
    })

    app.post('/@me/settings/', (req, res) => {
        const sessionKey = req.body.sessionToken;

        for (let i = 0; i < sessions.length; i++) {
            if (sessionKey === sessions[i].sessionKey) {
                for (let x = 0; x < users.length; x++) {
                    if (users[x].username === sessions[i].username) {
                        if (req.body.avatarUrl === undefined || req.body.avatarUrl === '')
                            users[x].avatarUrl = users[x].avatarUrl;
                        else
                            users[x].avatarUrl = req.body.avatarUrl;

                        if (req.body.description !== undefined) {
                            users[x].description = req.body.description
                            users[x].credits = users[x].credits;
                        }

                        if (req.body.balance !== undefined) {
                            const credits = users[x].credits;
                            if (credits === '' || credits === undefined)
                                users[x].credits = Number.parseFloat(users[x].credits);
                            else
                                users[x].credits = Number.parseFloat(req.body.balance) + Number.parseFloat(users[x].credits);
                            users[x].description = users[x].description
                        }

                        fs.writeFile("./users.json", JSON.stringify(users));
                        res.json({
                            "success": true,
                            "message": "details changed"
                        })
                        return;
                    }
                }
            }
        }

        res.json({
            "success": false,
            "message": "session doesn't exist"
        })
    })

    app.get('/confirmIdentity', (req, res) => {
        const sessionKey = req.query.sessionToken;


        for (let i = 0; i < sessions.length; i++) {
            if (sessionKey === sessions[i].sessionKey) {
                res.json({
                    "success": true,
                    "message": "authorized",
                    "username": sessions[i].username
                })
                return;
            }
        }

        res.json({
            "success": false,
            "message": "unauthorized"
        })
    })
}

module.exports = systemRouter;
