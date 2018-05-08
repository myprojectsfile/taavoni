var mongoose = require('mongoose');

var QueueSchema = new mongoose.Schema({
    name: String,
    status: { type: Boolean, required: true }
});

var QueueModel = mongoose.model('QueueModel', QueueSchema);


module.exports.QueueModel = QueueModel;