const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const Grid = require('gridfs-stream');
var bluebird = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = bluebird;
var context = require('../context/context');

module.exports = function (app) {

  // for local mongo
  const mongoUri = process.env.ENV_TAV_DB_URI || 'mongodb://localhost:27017/TaavoniDb';
  // for docker mongo 
  // const mongoUri = 'mongodb://taavoni_mongodb:27017/TaavoniDb';

  mongoose.connect(mongoUri, {
    useNewUrlParser: true
  });
  const mongooseConnection = mongoose.connection;
  // initialize gfs
  let gfs;

  mongooseConnection.once('open', () => {
    // init stream
    gfs = Grid(mongooseConnection.db, mongoose.mongo);
    gfs.collection('uploads');
    // upload routes 
    console.log(`2- Connected to mongodb Successfully at uri: ${mongoUri}`);
    // insert initial objects in collections
    // insert claims
    insertNewClaim('shareholder', 'سهامدار');
    insertNewClaim('admin', 'مدیر سیستم');
    insertNewClaim('tradeAdmin', 'مدیر معاملات');
    insertNewClaim('userAdmin', 'مدیر کاربران');
    // insert gheymatRoozSahm initial object
    insertNewGheymatRoozSahm(1000);
    // insert admin user initial object
    insertAdminUser();
  });

  // Setting up the storage element
  let storage = GridFsStorage({
    url: mongoUri,
    gfs: gfs,
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

  // Multer configuration for single file uploads
  let upload = multer({
    storage: storage
  }).single('file');

  // Route for file upload
  app.route('/api/file/upload')
    .post((req, res) => {
      upload(req, res, (err) => {

        if (err) {
          console.log('error uploading:' + err);
          res.json({
            error_code: 1,
            err_desc: err
          });
          return;
        }
        res.json({
          file: req.file
        });
      });
    });

  //   app.route('/api/file/download/:filename')
  //     .get((req, res) => {

  //       gfs.collection('uploads');

  //       gfs.files.find({
  //         filename: req.params.filename,
  //         root: "uploads"
  //       }, function (err, file) {
  //         if (err) {
  //           return res.status(400).send(err);
  //         } else if (!file) {
  //           return res.status(404).send('فایل مورد نظر پیدا نشد');
  //         }

  //         res.json(file.filename);
  //         // res.set('Content-Type', file.contentType);
  //         // res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

  //         // var readstream = gfs.createReadStream({
  //         //   filename: req.params.filename
  //         // });

  //         // readstream.on("error", function (err) {
  //         //   res.end();
  //         // });

  //         // readstream.pipe(res);
  //       });
  //     });

  app.route('/api/file/:filename')
    .get((req, res) => {
      //set collection name to lookup into
      gfs.collection('uploads');

      // First check if file exists
      gfs.files.find({
        filename: req.params.filename
      }).toArray(function (err, files) {
        if (!files || files.length === 0) {
          return res.status(404).json({
            responseCode: 1,
            responseMessage: "error"
          });
        }
        // create read stream
        var readstream = gfs.createReadStream({
          filename: files[0].filename,
          root: "uploads"
        });
        // set the proper content type 
        res.set('Content-Type', files[0].contentType);
        // res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
        // Return response
        return readstream.pipe(res);
      });
    });

  app.route('/api/file/:filename')
    .delete((req, res) => {
      //set collection name to lookup into
      gfs.collection('uploads');

      // First check if file exists
      gfs.files.find({
        filename: req.params.filename
      }).toArray(function (err, files) {
        if (!files || files.length === 0) {
          return res.status(404).json({
            responseCode: 1,
            responseMessage: "error"
          });
        }
        res.status(200).send();
        // // create read stream
        // var readstream = gfs.createReadStream({
        //   filename: files[0].filename,
        //   root: "uploads"
        // });
        // // set the proper content type 
        // res.set('Content-Type', files[0].contentType);
        // // res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
        // // Return response
        // return readstream.pipe(res);
      });
    });

  // app.route('/api/file/:filename')
  //   .delete((req, res) => {
  //     //set collection name to lookup into
  //     gfs.collection('uploads');

  //     gfs.files.find({
  //       filename: req.params.filename
  //     }, (err, file) => {
  //       console.log(file);
  //       console.log(err);

  //       if (!file) res.status(404).send();
  //       if (err) res.status(400).json(err);
  //       else res.status(200).send();
  //     });
  //   });

  // Route for getting all the files
  app.route('/api/files')
    .get((req, res) => {
      let filesData = [];
      let count = 0;
      // set the collection to look up into
      gfs.collection('uploads');

      gfs.files.find({}).toArray((err, files) => {
        if (err)
          res.json(err);

        // Error checking
        if (!files || files.length === 0) {
          return res.status(404).json({
            responseCode: 1,
            responseMessage: err
          });
        }
        // Loop through all the files and fetch the necessary information
        files.forEach((file) => {
          filesData[count++] = {
            // originalname: file.metadata.originalname,
            filename: file.filename,
            contentType: file.contentType
          }
        });

        res.json(filesData);
      });
    });
}

function insertNewClaim(claimName, claimTitle) {
  context.Claim.findOne({
    'claim': claimName
  }, function (err, claim) {
    if (err)
      console.log('error in finding claim object:' + err);
    if (!claim) {
      let newClaim = new context.Claim({
        claim: claimName,
        tozihat: claimTitle
      });
      newClaim.save((err, newClaim) => {
        if (err)
          console.log('error in saving claim:' + err);
        else
          console.log('new claim added:' + newClaim.claim);
      });
    }
  });
}

function insertNewGheymatRoozSahm(gheymat) {
  context.GheymatRoozSahm.findOne({}, function (err, gheymatRow) {
    if (err)
      console.log('error finding gheymat object:' + err);
    if (!gheymatRow) {
      let newGheymat = new context.GheymatRoozSahm({
        gheymatRooz: gheymat
      });
      newGheymat.save((err) => {
        if (err)
          console.log('error in saving gheymatRoozSahm:' + err);
        else
          console.log('new gheymatRoozSahm added:');
      });
    }
  });
}

function insertAdminUser() {
  context.User.findOne({}, function (err, user) {
    if (err)
      console.log('error finding gheymat object:' + err);
    if (!user) {
      let newUser = new context.User({
        username: 'admin',
        password: '123',
        name: 'کاربر',
        family: 'ارشد',
        mobile: '09111111111',
        codeMelli: '1111111111',
        enabled: true
      });
      newUser.save((err) => {
        if (err)
          console.log('error in saving admin user:' + err);
        else {
          console.log('admin user was added:');
          addClaimsToAdminUser();
        }
      });
    }
  });
}

function addClaimsToAdminUser() {
  context.User.findOne({
    'username': 'admin'
  }, function (err, user) {
    if (err) console.log('error finding admin user');
    if (user) {
      // get all claims
      context.Claim.find({}, function (err, claims) {
        if (claims) {
          // remove shareholder claim from all claims list
          claims = claims.filter(function (claimItem) {
            return claimItem.claim !== 'shareholder';
          });
          // add all claims to admin user
          user.claims.push.apply(user.claims, claims);
          user.save((err) => {
            if (err)
              console.log('error in saving admin user claims:' + err);
            else
              console.log('all claims was added to admin user:');
          });
        }
      });
    }
  })
}
