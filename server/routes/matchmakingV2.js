const users = require('../savefiles/users.json');
const sessions = require('../savefiles/sessions.json');
const matches = require('../savefiles/matches.json');
const fs = require('fs/promises');
const makeId = require('../utils/sessionKeyGen');

const multiplayerV2 = function (app) {

    app.post('/matches/create', (req, res) => {
        const sessionKey = req.body.sessionToken;
        const username = req.body.owner;
        const name = req.body.name;
        const description = req.body.description;
        const isPrivate = req.body.privacy;
        const price = req.body.price;

        if (sessions[sessionKey] === undefined || sessions[sessionKey].username !== username) {
            res.json({
                success: false,
                message: "unauthorized"
            })
            return;
        }

        const matchId = makeId(5);
        matches[matchId] = {
            'name': name,
            'description': description,
            'isPrivate': isPrivate,
            'price': price,
            'owner': username,
            'players': [],
            'scores': [],
            'id': matchId
        }

        fs.writeFile("./savefiles/matches.json", JSON.stringify(matches));

        res.json(matches[matchId]);
        return;
    })

    app.post('/match/join', (req, res) => {
        const sessionKey = req.body.sessionToken;
        const matchId = req.body.matchId;
        const username = sessions[sessionKey].username;

        if (sessions[sessionKey] === undefined || sessions[sessionKey].username !== username) {
            res.json({
                success: false,
                message: "unauthorized"
            })
            return;
        }

        if (matches[matchId] === undefined) {
            res.json({
                success: false,
                message: "match does not exist"
            })
            return;
        }

        if (matches[matchId].players.indexOf(username) > -1) {
            res.json({
                success: false,
                message: "user already joined"
            })
            return;
        }

        matches[matchId].players.push(username);
        users[username].credits = Number.parseFloat(users[username].credits) - 5;

        fs.writeFile("./savefiles/users.json", JSON.stringify(users));
        fs.writeFile("./savefiles/matches.json", JSON.stringify(matches));


        res.json({
            success: true,
            message: "user joined match"
        })
        return;
    })

    app.get('/matches', (req, res) => {
        const publicMatches = [];

        const matcharray = Object.values(matches);
        for (let i = 0; i < matcharray.length; i++) {
            if (matcharray[i].isPrivate === 'false') {
                publicMatches.push(matcharray[i])
            }
        }

        res.json(publicMatches);
    })

    app.post('/match/start', (req, res) => {
        const sessionKey = req.body.sessionToken;
        const matchId = req.body.matchId;

        if (sessions[sessionKey] === undefined) {
            res.json({
                success: false,
                message: "unauthorized"
            })
            return;
        }

        if (matches[matchId] === undefined) {
            res.json({
                success: false,
                message: "match does not exist"
            })
            return;
        }

        const players = matches[matchId].players;
        if (players === []) {
            res.json({
                success: false,
                message: "no players"
            })
            return;
        }


        const highestScore = getMax(matches[matchId].scores, 'score');

        const winnerName = highestScore.username;
        users[winnerName].credits = Number.parseFloat(users[winnerName].credits) + Number.parseFloat(matches[matchId].price);

        matches[matchId].isPrivate = true;

        fs.writeFile("./savefiles/users.json", JSON.stringify(users));
        fs.writeFile("./savefiles/matches.json", JSON.stringify(matches));


        res.json({
            winner: winnerName,
            success: true,
            message: "match ended"
        })
    })

    app.post('/matches/played', (req, res) => {
        const sessionKey = req.body.sessionKey;
        const matchId = req.body.matchId;
        const score = req.body.score;

        if (sessions[sessionKey] === undefined) {
            res.json({
                success: false,
                message: "unauthorized"
            })
            return;
        }

        if (matches[matchId] === undefined) {
            res.json({
                success: false,
                message: "unauthorized"
            })
            return;
        }

        const username = sessions[sessionKey].username;
        for (let i = 0; i < matches[matchId].scores.length; i++) {

            if (matches[matchId].scores[i].username === username) {
                res.json({
                    success: false,
                    message: "already submitted"
                })
                return;
            }

        }

        const dataset = {
            'username': username,
            'score': score
        }
        matches[matchId].scores.push(dataset)

        fs.writeFile("./savefiles/matches.json", JSON.stringify(matches));
        res.sendStatus(200);
    })

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

module.exports = multiplayerV2;