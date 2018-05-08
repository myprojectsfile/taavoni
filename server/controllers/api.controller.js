// var QueueModel = require('../context/context').SafeKharid;
var context = require('../context/context');

module.exports = function (app) {

    app.route('/api/safeKharid')
        .get(get_safeKharid)
        .post(post_darkhastKharid);

    app.route('/api/safeKharid/:id')
        .get(get_safeKharid_byid)
        .put(update_darkhastKharid)
        .delete(del_safeKharid_byid);
};

get_safeKharid = function (req, res) {
    context.SafeKharid.find({}, function (err, result) {
        if (err)
            res.send(err);
        res.json(result);
    });
};

post_darkhastKharid = function (req, res) {
    var darkhastKharid = new context.SafeKharid(req.body);
    darkhastKharid.save(function (err, darkhast) {
        console.log('saving ...');
        if (err) {
            console.log(`this is error: ${err}`);
            res.send(err);
        }
        res.json(darkhast);
    });
};


get_safeKharid_byid = function (req, res) {
    context.SafeKharid.findById(req.params.id, function (err, darkhast) {
        if (err)
            res.send(err);
        res.json(darkhast);
    });
};


update_darkhastKharid = function (req, res) {
    context.SafeKharid.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, darkhast) {
        if (err)
            res.send(err);
        res.json(darkhast);
    });
};


del_safeKharid_byid = function (req, res) {
    context.SafeKharid.remove({
        _id: req.params.id
    }, function (err, darkhast) {
        if (err)
            res.send(err);
        res.json({ message: 'درخواست مورد نظر با موفقیت حذف شد' });
    });
};
