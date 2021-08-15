const express = require('express');

const app = express();

app.use(express.json())

const productionDomain = 'https://4c3711.xyz';
const testingDomain = 'http://localhost:3000';
const domain = testingDomain;

// Add headers before the routes are defined
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', domain);
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

require('./routes/system.js')(app);
require('./routes/matchmaking.js')(app);


app.listen(9001, function () {
    console.log(`[traktorraces24 Server] Server is now ready!`)
})