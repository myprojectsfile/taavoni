var express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var bluebird = require('bluebird');

global.mongoose = require('mongoose');
// disable deprecation warning
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = bluebird;

// for local mongo
global.mongoUri = process.env.ENV_TAV_DB_URI || 'mongodb://localhost:27017/TaavoniDb';
// for docker mongo 
// global.mongoUri = 'mongodb://taavoni_mongodb:27017/TaavoniDb';

var apiController = require('./server/controllers/api.controller');
var uploadController = require('./server/controllers/upload.controller');

var app = express();

app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'pug');


app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, 'dist')));



mongoose.connect(mongoUri, {
  useNewUrlParser: true
});

// api routes
apiController(app);

// file routes
uploadController(app);

// index route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
    title: 'error in taavoni server app',
    message: err.message,
    error: err
  });
});


// Get port from environment and store in Express.
const port = process.env.ENV_TAV_SERVER_PORT || '3000';
app.set('port', port);



const server = http.createServer(app);
server.listen(port, () => console.log(`1- Taavoni app running on localhost:${port}`));
