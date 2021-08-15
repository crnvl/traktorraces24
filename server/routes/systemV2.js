const users = require('../savefiles/users.json');
const sessions = require('../savefiles/sessions.json');
const fs = require('fs/promises');
const makeId = require('../utils/sessionKeyGen');

const systemRouterV2 = function (app) {
    app.get('/', (req, res) => {
        res.json({
            statusCode: 200,
            documentation: "https://github.com/angelsflyinhell/PaladinsAssistant",
            sponsor: "https://ko-fi.com/azamivisuals"
        })
    })

    app.post('/register', (req, res) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        if (username === '' || email === '' || password === '') {
            res.json({
                success: false,
                message: 'credentials cannot be empty'
            })
            return;
        }

        if (users[username] !== undefined) {
            res.json({
                success: false,
                message: 'username already taken'
            })
            return;
        }

        if (Object.values(users).find(user => user.email === email) !== undefined) {
            res.json({
                success: false,
                message: 'email already taken'
            })
            return;
        }

        users[username] = {
            'email': email,
            'password': password,
            'credits': 0,
            'description': '',
            'avatarUrl': 'https://traktorraces24.4c3711.xyz/images/menu/carousel1.jpg'
        }

        fs.writeFile("./savefiles/users.json", JSON.stringify(users));

        res.json({
            "success": true,
            "message": "user registered"
        })
        return;

    })

    app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        if (users[username] === undefined) {
            res.json({
                success: false,
                message: 'user does not exist'
            })
            return;
        }

        if (users[username].password === password) {
            const sessionKey = makeId(64);

            sessions[sessionKey] = {
                "username": username
            }

            res.json({
                success: true,
                message: 'user authorized',
                'sessionKey': sessionKey
            })

            fs.writeFile("./savefiles/sessions.json", JSON.stringify(sessions));
            return;
        }

        res.json({
            success: false,
            message: 'user not authorized'
        })
    })

    app.get('/@me/settings', (req, res) => {
        const sessionKey = req.query.sessionToken;

        if (sessions[sessionKey] === undefined) {
            res.json({
                "success": false,
                "message": "session doesn't exist"
            })
            return;
        }

        const username = sessions[sessionKey].username;

        res.json({
            "success": true,
            "message": "authorized",
            "details": {
                "email": users[username].email,
                "username": username,
                "balance": users[username].credits,
                "description": users[username].description
            }
        })
    })

    app.post('/@me/settings', (req, res) => {
        const sessionKey = req.body.sessionToken;
        const description = req.body.description;
        const avatarUrl = req.body.avatarUrl;
        const credits = req.body.balance;

        if (sessions[sessionKey] === undefined) {
            res.json({
                "success": false,
                "message": "session doesn't exist"
            })
            return;
        }

        const username = sessions[sessionKey].username;

        if (description !== undefined) {
            users[username].description = description;
        }

        if (avatarUrl !== undefined || avatarUrl !== '') {
            users[username].avatarUrl = avatarUrl;
        }

        if (credits !== undefined || credits !== '') {
            users[username].credits = Number.parseFloat(credits) + Number.parseFloat(users[username].credits);
        }

        fs.writeFile("./savefiles/users.json", JSON.stringify(users));

        res.json({
            "success": true,
            "message": "details changed"
        })
        return;
    })

    app.get('/user/:username', (req, res) => {
        const username = req.params.username;

        if(users[username] === undefined) {
            res.json({
                'success': false,
                'description': '404',
                'description': 'Dieser Nutzer existiert nicht.'
            })
            return;
        }

        res.json({
            'username': username,
            'description': users[username].description,
            'avatar': users[username].avatarUrl
        })
    })

    app.get('/confirmIdentity', (req, res) => {
        const sessionKey = req.query.sessionToken;

        if(sessionKey === undefined) {
            res.json({
                "success": false,
                "message": "unauthorized"
            })
            return;
        }

        res.json({
            "success": true,
            "message": "authorized",
            "username": sessions[sessionKey].username
        })
    })
}

module.exports = systemRouterV2;