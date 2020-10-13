const auth = require('../routes/auth');
const build = require('../routes/build');

module.exports = function(app) {
    app.use('/auth',auth);
    app.use('/build',build);
}