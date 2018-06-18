const express = require('express');
const path = require('path');
const routes = require('./api/routes');
const bodyParser = require('body-parser');
const app = express();


app.set('port', 3000);

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
})

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', routes);

const server = app.listen(app.get('port'), (req, res) => {
    console.log("Server running on port no. " + server.address().port);
});