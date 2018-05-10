var mongoose = require('mongoose');

// Define Shcemas
var DarkhastSchema = new mongoose.Schema({
    username: { type: String, required: true },
    tedadSahm: Number,
    arzeshSahm: Number,
    tarikhDarkhast: { type: Date, default: Date.now }
});


// Define Models
var SafeKharid = mongoose.model('SafeKharid', DarkhastSchema);
var SafeForush = mongoose.model('SafeForush', DarkhastSchema);

// Export Models
module.exports.SafeForush = SafeForush;
module.exports.SafeKharid = SafeKharid;

module.exports.context = {
    SafeForush: SafeForush,
    SafeKharid: SafeKharid
}