const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const multer = require('multer');

module.exports = function (app) {
    // for local mongo
    const mongoUri = 'mongodb://localhost:27017/TaavoniDb';
    // for docker mongo 
    // const mongoUri = 'mongodb://taavoni_mongodb:27017/TaavoniDb;

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

    app.route('/api/upload')
        .get((req, res) => {
            res.json('upload');
        })
        .post(upload.single('file'), (req, res) => {
            // res.json({ file: req.file });
            res.json('file uploaded');
        });
}