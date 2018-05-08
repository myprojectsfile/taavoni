var QueueModel = require('../context/context').QueueModel;

module.exports = function (app) {
    var apiController = require('../controllers/api.controller')

    // queue Routes
    app.route('/api/queue')
        .get(get_all_queue)
        .post(post_a_queue);

    // app.route('/queue/:id')
    //   .get(apiController.get_queue)
    //   .put(apiController.update_queue)
    //   .delete(apiController.delete_queue);
};

get_all_queue = function (req, res) {
    QueueModel.find({}, function (err, result) {
        if (err)
            res.send(err);
        res.json(result);
    });
};




post_a_queue = function (req, res) {
    var new_queue = new QueueModel(req.body);
    new_queue.save(function (err, queue) {
        if (err)
            res.send(err);
        res.json(queue);
    });
};


// exports.read_a_task = function (req, res) {
//     QueueModel.findById(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };


// exports.update_a_task = function (req, res) {
//     QueueModel.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };


// exports.delete_a_task = function (req, res) {


//     QueueModel.remove({
//         _id: req.params.taskId
//     }, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json({ message: 'Task successfully deleted' });
//     });
// };
