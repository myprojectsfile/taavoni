var express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
mongoose.Promise = bluebird;
var cors = require('cors');
var path = require('path');
const api = require('./server/routes/api');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

// mongoose.connect('mongodb://localhost/PersianDevsDb');
var mongoConnectPromise = mongoose.connect('mongodb://localhost/TaavoniDb', {});

mongoConnectPromise.then(function (db) {
    console.log('1- Connected to mongodb Successfully');
    const server = http.createServer(app);
    server.listen(port, () => console.log(`2- Taavoni app running on localhost:${port}`));
});



