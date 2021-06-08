
module.exports = function (err, req, res, next) {
    console.log('logging.....');
    res.status(500).send('Something failed.');
};
