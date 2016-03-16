module.exports = function(app) {
    cfg = app.locals.appConfig;

    app.get('/api/user', function (req, res) {
        //just return the current logged in user
        return res.json({name: req.user.name, email: req.user.email});
    });
};