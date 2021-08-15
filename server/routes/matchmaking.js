var fs = require('fs');
const users = require('../users.json');
const sessions = require('../sessions.json');
const matches = require('../matches.json');
const makeId = require('../utils/sessionKeyGen');

const multiplayer = function (app) {

    app.post('/matches/create', (req, res) => {
        const body = req.body;

        for (let i = 0; i < sessions.length; i++) {
            if ((sessions[i].sessionKey === body.sessionToken && sessions[i].username !== body.owner)) {
                res.json({
                    success: false,
                    message: "unauthorized"
                })
                return;
            }
        }

        matches.push({
            "name": body.name,
            "description": body.description,
            "isPrivate": body.privacy,
            "price": body.price,
            "owner": body.owner,
            "bets": [],
            "players": [],
            "id": makeId(5)
        })

        fs.writeFileSync("./matches.json", JSON.stringify(matches));
        res.json({
            "name": body.name,
            "description": body.description,
            "isPrivate": body.privacy,
            "price": body.price,
            "owner": body.owner,
            "bets": [],
            "players": [],
            "id": makeId(5)
        })
        return;
    })

    app.post('/match/join', (req, res) => {
        const sessionKey = req.body.sessionToken;

        for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].sessionKey === sessionKey) {

                for (let x = 0; x < matches.length; x++) {
                    if (matches[x].id === req.body.matchId) {

                        for (let z = 0; z < matches[x].players.length; z++) {
                            if (matches[x].players[z] === sessions[i].username) {
                                res.json({
                                    success: false,
                                    message: "user already joined"
                                })
                                return;
                            }
                        }
                        matches[x].players.push(sessions[i].username);

                        for (let y = 0; y < users.length; y++) {
                            if (users[y].username === sessions[i].username) {
                                users[y].credits = Number.parseFloat(users[y].credits) - 5
                            }
                        }

                        fs.writeFileSync("./users.json", JSON.stringify(users));
                        fs.writeFileSync("./matches.json", JSON.stringify(matches));

                        res.json({
                            success: true,
                            message: "user joined match"
                        })
                        return;
                    }
                }

            }
        }

        res.json({
            success: false,
            message: "invalid session"
        })
        return;
    })

    app.post('/match/bet', (req, res) => {
        const sessionKey = req.body.sessionToken;

        for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].sessionKey === sessionKey) {

                for (let x = 0; x < matches.length; x++) {
                    if (matches[x].id === req.body.matchId) {

                        for (let z = 0; z < matches[x].bets.length; z++) {
                            if (matches[x].bets[z].name === sessions[i].username) {
                                res.json({
                                    success: false,
                                    message: "user already placed a bet"
                                })
                                return;
                            }
                        }
                        matches[x].bets.push({
                            "name": sessions[i].username,
                            "amount": req.body.amount
                        });

                        for (let y = 0; y < users.length; y++) {
                            if (users[y].username === sessions[i].username) {
                                users[y].credits = Number.parseFloat(users[y].credits) - Number.parseFloat(req.body.amount);
                            }
                        }

                        fs.writeFileSync("./users.json", JSON.stringify(users));

                        fs.writeFileSync("./matches.json", JSON.stringify(matches));

                        res.json({
                            success: true,
                            message: "user placed bet"
                        })
                        return;
                    }
                }

            }
        }

        res.json({
            success: false,
            message: "invalid session"
        })
        return;
    })

    app.get('/matches', (req, res) => {
        const publicMatches = [];

        for (let i = 0; i < matches.length; i++) {
            if (matches[i].isPrivate === 'false') {
                publicMatches.push(matches[i])
            }
        }

        res.json(publicMatches);
    })

    app.post('/match/start', (req, res) => {
        const body = req.body;

        for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].sessionKey === body.sessionToken) {
                for (let x = 0; x < matches.length; x++) {
                    if (matches[x].owner === sessions[i].username && matches[x].id === body.matchId) {

                        const players = matches[x].players;
                        if (players === []) {
                            res.json({
                                success: false,
                                message: "no players"
                            })
                            return;
                        }

                        const winner = getRandomInt(players.length);

                        for (let y = 0; y < users.length; y++) {
                            if(players[winner] === users[y].username) {
                                users[y].credits = Number.parseFloat(users[y].credits) + Number.parseFloat(matches[x].price);
                            }
                        }

                        matches[x].isPrivate = true

                        fs.writeFileSync("./users.json", JSON.stringify(users));
                        fs.writeFileSync("./matches.json", JSON.stringify(matches));

                        res.json({
                            winner: players[winner],
                            success: true,
                            message: "match ended"
                        })
                        return;
                    }
                }
            }
        }

        res.json({
            success: false,
            message: "unauthorized"
        })
    })

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = multiplayer;