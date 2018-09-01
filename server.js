var express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
mongoose.Promise = bluebird;
var cors = require('cors');
var path = require('path');
var apiController = require('./server/controllers/api.controller');
var app = express();
const methodOverride = require('method-override');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const multer = require('multer');

app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'jade');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist')));

app.use(methodOverride('_method'));

// api routes
apiController(app);

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

// -------- mongodb config -----------

// for local mongo
const mongoUri = 'mongodb://localhost:27017/TaavoniDb';
// for docker mongo 
// const mongoUri = 'mongodb://taavoni_mongodb:27017/TaavoniDb;

const mongoConnectPromise = mongoose.createConnection(mongoUri, { useNewUrlParser: true });

// Init gridfs
let gfs;

mongoConnectPromise.once('open', () => {
    // init stream
    gfs = Grid(mongoConnectPromise.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('1- Connected to mongodb Successfully');
    const server = http.createServer(app);
    server.listen(port, () => console.log(`2- Taavoni app running on localhost:${port}`));
});

// Create Storage engine 
const storage = new GridFsStorage({
    url: mongoUri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

// file upload route
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

// index route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});


// mongoConnectPromise.then(function (db) {
//     console.log('1- Connected to mongodb Successfully');
//     const server = http.createServer(app);
//     server.listen(port, () => console.log(`2- Taavoni app running on localhost:${port}`));
// });



